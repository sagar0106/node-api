    var mongoose = require('mongoose'),

        UserSchema = new mongoose.Schema({
            username: {
                type: String
            },
            firstname: {
                type: String,
                required: true
            },
            lastname: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            isActive: { type: Boolean, default: true },
            isRemoved: { type: Boolean, default: false },
            password: { type: String, required: true },
            // salt: { type: String }
            email: { type: String },
        });

    module.exports = mongoose.model('User', UserSchema);