var express = require('express');
var helper = require('../helper/success');
var fs = require('fs');
var tokenService = require('../services/validateToken');

var controller = {};
fs
    .readdirSync(__dirname + "/../controllers")
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        controller[file.split('.')[0]] = require(__dirname + "/../controllers/" + file);
    });


module.exports = function(app) {
    var apiRoutes = express.Router();
    try {
        fs.readdirSync(__dirname + "/../controllers")
            .filter(function(file) {
                return (file.indexOf(".") !== 0) && (file !== "index.js");
            })
            .forEach(function(file) {
                //require(__dirname+'/'+file)(app);
                var filename = file.split('.')[0];
                //check if the controller is present
                if (controller[filename]) {
                    apiRoutes.route('/' + filename)
                        .get(controller[filename].list, helper.success)
                        .post(controller[filename].create, helper.success);


                    apiRoutes.route('/' + filename + '/:id')
                        .get(controller[filename].getById, helper.success)
                        .patch(controller[filename].update, helper.success)
                        .delete(controller[filename].remove, helper.success);
                } else {
                    console.log(filename + " --- NO controller created");
                }
            });
    } catch (e) {
        console.log(e);
    }
    require('./auth.js')(app);

    app.use('/api', tokenService.checkToken, apiRoutes);
}