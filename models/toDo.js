const mongoose = require('mongoose'),

    toDoSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: String,
        isCompleted: { type: Boolean, required: true }
    });

module.exports = mongoose.model('toDo', toDoSchema);