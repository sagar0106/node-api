(function() {
    'use strict';
    const config = require('../config/config');
    const mongoose = require('mongoose');
    const Entity = mongoose.model('User')
    const _ = require('lodash');
    const jwt = require('jsonwebtoken');
    const crypto = require('crypto')
    const db = require('mongoskin').db(config.dbconnection);
    const q = require('q');
    let controller = function() {};

    controller.prototype.login = function(req, res, next) {
        const cipher = crypto.createCipher('aes-256-ctr', req.body.password)
        let crypted = cipher.update(config.secret, 'utf8', 'hex')
        crypted += cipher.final('hex');
        req.body.password = crypted;
        req.body.username = req.body.username.toLowerCase();
        Entity.findOne({
            username: req.body.username,
            password: req.body.password,
            isRemoved: false
        }, function(err, data) {
            if (err) {
                next(err)
            } else {
                if (!data) {
                    return res.status(401).send({
                        message: "Email and/or Password do not match with our records."
                    })
                } else if (!data._doc.isActive) {
                    return res.status(401).send({
                        message: "Sorry, your account has been deactivated. Please contact your administrator to activate your account."
                    })
                } else {
                    const tokenData = _.pick(data._doc, ['_id', 'username', 'firstname', 'lastname']);
                    const shortUser = _.pick(data._doc, ['username', 'firstname', 'role', '_id']);
                    const token = jwt.sign(tokenData, config.secret);
                    getUserPermissions(shortUser.role).then(function(permissions) {
                        shortUser.permissions = permissions;
                        req.loginData = {
                            shortUser: shortUser,
                            token: token
                        }
                        req.userData = data._doc;

                        return res.status(200).json({
                            token: token,
                            user: shortUser,
                            message: 'Successfully signed'
                        });
                    });
                }
            }
        })
    }


    controller.prototype.validatetoken = function(req, res, next) {
        jwt.verify(req.body.id, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                Entity.findOne({ '_id': decoded._id, passwordFlag: true }, function(err, data) {
                    if (err) {
                        res.json(err);
                    } else {
                        Entity.update({ '_id': decoded._id }, { $set: { passwordFlag: false } }, function(err, tokendata) {
                            if (err) {
                                res.json(err);
                            } else {
                                res.status(200).send(data);
                            }
                        })
                    }
                });
            }
        });

    }

    function getUserPermissions(role) {
        var deferred = q.defer();
        var permissions;
        // var rolesToFetch = [];

        //   db.collection('modules').find({}).toArray(function(er, mArr) {
        db.collection('roles').find({ 'title': role }, { "title": 1, "modules": 1 }).toArray(function(e, data) {
            console.log(data);
            // Set up permissions in a coded way,
            permissions = _.reduce(data, function(a, role) {
                _.forEach(role.modules, function(module) {
                    a[module._id] = a[module._id] || {};
                    _.forEach(module.permissions, function(p) {
                        //Generate code
                        var per =
                            (p.view ? '1' : '0') // view
                            +
                            (p.edit ? '1' : '0') +
                            (p.create ? '1' : '0') +
                            (p.editSchema ? '1' : '0') +
                            (p.review ? '1' : '0');
                        if (per.indexOf('1') !== -1) {
                            if (a[module._id][p.entity]) {
                                var p2 = a[module._id][p.entity];
                                per = _.map(per, function(v, i) {
                                    //If either of permissions are 1, then return 1 otherwise 0
                                    // doing a logical or
                                    //Shorter version
                                    return (parseInt(per[i]) || parseInt(p2[i])).toString();
                                    //Longer version
                                    //(per[i] === '1') ? '1' : ((p2[i] === '1') ? '1' : '0');
                                }).join('');
                            };
                            a[module._id][p.entity] = per;
                        }
                    });
                });
                return a;
            }, {});

            delete permissions[undefined];
            // _.forEach(permissions, function(per, key) {
            //     var indx = _.findIndex(mArr, function(mr) {
            //         return mr.isActive && mr._id == key;
            //     });
            //     if (indx == -1) {
            //         delete permissions[key];
            //     }
            // });

            deferred.resolve(permissions);
        });
        //   });
        return deferred.promise;
    }

    module.exports = new controller();
})();