(function() {
    'use strict';
    var config = require('../config/config');
    var mongoose = require('mongoose');
    var Entity = mongoose.model('User')
    var _ = require('lodash');
    var jwt = require('jsonwebtoken');
    var crypto = require('crypto')
    var controller = function() {};

    controller.prototype.login = function(req, res, next) {
        var cipher = crypto.createCipher('aes-256-ctr', req.body.password)
        var crypted = cipher.update(config.secret, 'utf8', 'hex')
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
                    var tokenData = _.pick(data._doc, ['_id', 'username', 'firstname', 'lastname']);
                    var shortUser = _.pick(data._doc, ['username', 'firstname', 'role', '_id']);
                    var token = jwt.sign(tokenData, config.secret);
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


    module.exports = new controller();
})();