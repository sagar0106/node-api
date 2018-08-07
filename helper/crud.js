(function() {
    'use strict';


    var crud = function() {};

    function list(entity, options, body, cb) {
        options = options || {};
        entity.count(options.where, function(err, count) {
            if (err) {
                cb(err, count);
            } else {
                entity.find(options.where)
                    .select(options.select)
                    .sort(options.sort)
                    .skip(options.pageskip)
                    .limit(options.pagesize)
                    .exec(function(err, data) {
                        var obj = {
                            data: data,
                            count: count
                        }
                        cb(err, obj);
                    });
            }
        })
    }

    function one(entity, options, body, cb) {
        options = options || {};
        entity.findById(options).populate(body.populate).exec(function(err, data) {
            cb(err, data);
        })
    }

    function create(entity, options, body, req, cb) {
        options = options || {};
        body.isActive = true;
        entity.create(body, function(err, data) {
            cb(err, data);
        });
    }

    function update(entity, options, body, req, cb) {
        options = options || {};
        entity.findOneAndUpdate(options, body, { new: true }, function(err, data) {
            cb(err, data);
        });
    }

    function remove(entity, options, body, cb) {
        options = options || {};
        entity.findOneAndRemove(options, function(err, data) {
            cb(err, data);
        });
    }

    crud.prototype.list = list;
    crud.prototype.one = one;
    crud.prototype.create = create;
    crud.prototype.update = update
    crud.prototype.remove = remove;
    module.exports = new crud();
})();