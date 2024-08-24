(function() {
    'use strict';
    let controller = function() {};
    controller.prototype.success = function(req, res, next) {
        var statusCode = req.statusCode || res.statusCode || 200;
        return res.status(statusCode).send(req.data);
    }
    module.exports = new controller();
})();