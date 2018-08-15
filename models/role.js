var mongoose = require('mongoose'),

    roleSchema = new mongoose.Schema({
        title: { type: String, required: true },
        modules: []
    });

module.exports = mongoose.model('role', roleSchema);