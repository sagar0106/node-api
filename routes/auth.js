(function() {
    'use strict';

    const authService = require('../services/auth');

    module.exports = function(app) {

        app.route('/login')
            .post(authService.login);

        app.route('/validatetoken')
            .post(authService.validatetoken);

        // app.route('/forgotpassword')
        //     .post(authService.forgotpassword);

        // app.route('/changepassword')
        //     .post(authService.changepassword);

        // app.route('/requiredpassword')
        //     .post(authService.requiredpassword);

    }
})();