const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    Code: {
        type: 'number',
        required: true
    },
    Email: {
        type: 'string',
        required: true
    },
    ExpiresIn: {
        type: "number",
        required: true
    },
    Used: {
        type: 'number',
        enum: [0, 1],
        default: 0

    },
}, { timestamps: true })

const model = mongoose.model("Email-Code", schema);
module.exports = model;