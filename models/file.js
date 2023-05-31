const mongoose = require('mongoose');            // importing mongoose

const Schema = mongoose.Schema;                  // fetching schema from mongoose

const fileSchema = new Schema({                  // structure of data in database
    filename: { type: String, required: true},
    path: { type: String, required: true},
    size: { type: Number, required: true},
    uuid: { type: String, required: true},
    sender: { type: String, required: false},
    receiver: { type: String, required: false},
}, { timestamps: true});

module.exports = mongoose.model('File', fileSchema);           //exporting