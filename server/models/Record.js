const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    rowNumber: Number,
    name: String,
    amount: Number,
    date: Date,
    verified: String
});

module.exports = mongoose.model('Record', recordSchema);
