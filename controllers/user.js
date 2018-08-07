(function() {
    'use strict';
    var config = require('../config/config');
    var crud = require('../helper/crud');
    var mongoose = require('mongoose');
    //  var bcrypt = require("bcrypt");
    var crypto = require('crypto')
    var Entity = mongoose.model('User');

    var controller = function() {};

    function list(req, res, next) {
        crud.list(Entity, req.options, req.body, function(err, data) {
            if (err) {
                return next(err);
            }
            req.data = data;
            next();
        });
    }

    function create(req, res, next) {
        var cipher = crypto.createCipher('aes-256-ctr', req.body.password)
        var crypted = cipher.update(config.secret, 'utf8', 'hex')
        crypted += cipher.final('hex');
        req.body.password = crypted;
        //   req.body.password = bcrypt.hashSync(req.body.password, 5); // we are using bcrypt to hash our password before saving it to the database
        console.log('--body---');
        console.log(req.body);
        crud.create(Entity, {}, req.body, req, function(err, data) {
            if (err) {
                return next(err);
            }
            req.data = data;
            next();
        });
    }

    function getById(req, res, next) {
        crud.one(Entity, req.params.id, { populate: '' }, function(err, data) {
            if (err) {
                return next(err);
            }
            req.data = data;
            next();
        });
    }

    function update(req, res, next) {
        var cipher = crypto.createCipher('aes-256-ctr', req.body.password)
        var crypted = cipher.update(config.secret, 'utf8', 'hex')
        crypted += cipher.final('hex');
        req.body.password = crypted;
        var query = { _id: mongoose.Types.ObjectId(req.params.id) }
        crud.update(Entity, query, req.body, req, function(err, data) {
            if (err) {
                return next(err);
            }
            req.data = data;
            next();
        });
    }

    function remove(req, res, next) {
        var query = { _id: mongoose.Types.ObjectId(req.params.id) }
        crud.remove(Entity, query, {}, function(err, data) {
            if (err) {
                return next(err);
            }
            req.data = data;
            next();
        });
    }

    controller.prototype.list = list;
    controller.prototype.create = create;
    controller.prototype.getById = getById;
    controller.prototype.update = update;
    controller.prototype.remove = remove;
    module.exports = new controller();
})();