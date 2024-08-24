(function() {
    'use strict';
    const config = require('../config/config');
    const _ = require('lodash');
    const jwt = require('jsonwebtoken');
    let controller = function() {};

    function checkToken(req, res, next) {
        const token = req.get("x-access-token");
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