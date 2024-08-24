(function() {
    'use strict';

    const mongoose = require('mongoose'),
    fs = require('fs');

    module.exports = function() {

        const dbUrl = 'mongodb://localhost/testDb';
        const db = mongoose.connect(dbUrl);

        // When successfully connected
        mongoose.connection.on('connected', function() {
            console.log('Mongoose default connection open to ' + dbUrl);
        });

        // If the connection throws an error
        mongoose.connection.on('error', function(err) {
            console.log('Mongoose default connection error: ' + err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function() {
            console.log('Mongoose default connection disconnected');
        });

        fs
            .readdirSync(__dirname + "/../models")
            .filter(function(file) {
                return (file.indexOf(".") !== 0) && (file !== "index.js");
            })
            .forEach(function(file) {
                require('../models/' + file);
            });

        return db;
    };
})();