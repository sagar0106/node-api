(function() {
    'use strict';
    var config = require('../config/config');
    var _ = require('lodash');
    var jwt = require('jsonwebtoken');
    var controller = function() {};

    function checkToken(req, res, next) {
        var token = req.get("x-access-token");
        console.log("----token---");
        console.log(token);
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("----err---");
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // req.userId = decoded._id;
                // req.organizationId = decoded.organizationId;
                // req.username = decoded.username;
                // req.name = decoded.name;
                // req.userRoles = decoded.role;
                next();
            }
        })

    }

    controller.prototype.checkToken = checkToken;
    module.exports = new controller();
})();