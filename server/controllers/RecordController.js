const Record = require('../models/Record');


const importRecords = async (req, res) => {
    try {
        const { validData } = req.body; 
        console.log(validData)
        const allValidRows = Object.values(validData).flat();
        const records = await Record.insertMany(allValidRows);
        res.json({ message: 'Import successful', imported: records.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

const getRecordById = async (req, res) => {
    try {
        const records = await Record.find({ fileId: req.params.fileId });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports ={
    importRecords,
    getRecordById
}