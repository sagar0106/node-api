(function() {
    'use strict';
    const config = require('../config/config');
    const crud = require('../helper/crud');
    const mongoose = require('mongoose');
    const crypto = require('crypto')
    const Entity = mongoose.model('User');

    let controller = function() {};

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
        const cipher = crypto.createCipher('aes-256-ctr', req.body.password)
        let crypted = cipher.update(config.secret, 'utf8', 'hex')
        crypted += cipher.final('hex');
        req.body.password = crypted;
        //   req.body.password = bcrypt.hashSync(req.body.password, 5); // we are using bcrypt to hash our password before saving it to the database
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
        const cipher = crypto.createCipher('aes-256-ctr', req.body.password)
        let crypted = cipher.update(config.secret, 'utf8', 'hex')
        crypted += cipher.final('hex');
        req.body.password = crypted;
        const query = { _id: mongoose.Types.ObjectId(req.params.id) }
        crud.update(Entity, query, req.body, req, function(err, data) {
            if (err) {
                return next(err);
            }
            req.data = data;
            next();
        });
    }

    function remove(req, res, next) {
        const query = { _id: mongoose.Types.ObjectId(req.params.id) }
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