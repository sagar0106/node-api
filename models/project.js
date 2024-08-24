const mongoose = require('mongoose'),
    projectSchema = new mongoose.Schema({
        title: { type: String, required: true },
        toDo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'toDo' }]
    });

module.exports = mongoose.model('Project', projectSchema);