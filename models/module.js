const mongoose = require('mongoose'),

    moduleSchema = new mongoose.Schema({
        title: { type: String, required: true }
    });

module.exports = mongoose.model('module', moduleSchema);