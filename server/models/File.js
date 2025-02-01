const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: {type: String, required: true},
    uploadDate: { type: Date, default: Date.now },
    recordIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record' }]
});

module.exports = mongoose.model('File', fileSchema);
