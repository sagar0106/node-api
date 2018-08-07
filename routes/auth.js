(function() {
    'use strict';

    //  var user = require('../controllers/user');
    var _ = require('lodash');
    var authService = require('../services/auth');

    module.exports = function(app) {

        app.route('/login')
            .post(authService.login);

        // app.route('/forgotpassword')
        //     .post(authService.forgotpassword);

        // app.route('/changepassword')
        //     .post(authService.changepassword);

        app.route('/validatetoken')
            .post(authService.validatetoken);

        // app.route('/requiredpassword')
        //     .post(authService.requiredpassword);

    }
})();