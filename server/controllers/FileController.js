const FileMeta = require('../models/File');
const config = require('../config.json');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { validateAndParseDate } = require('../utils/dateFormat');
const Record = require('../models/Record');


const getFiles = async (req, res) => {
    try {
        const files = await FileMeta.find().sort({ uploadDate: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteFileById = async (req, res) => {
    try {
        const file = await FileMeta.findById(req.params.fileId);
        if (!file) return res.status(404).json({ error: 'File not found' });

        await Record.deleteMany({ fileId: file._id });
        await file.deleteOne();
        res.json({ message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const filePath = req.file.path;
        if (!fs.existsSync(filePath)) return res.status(400).json({ error: 'File not found after upload' });

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        if (workbook.worksheets.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Uploaded file is empty' });
        }
        
        console.log(req.file)
        const fileMeta = new FileMeta({ fileName: req.file.filename, uploadDate: new Date() });
        await fileMeta.save();

        const response = { sheets: {}, validData: {} };

        workbook.eachSheet((worksheet, sheetId) => {
            const sheetName = worksheet.name;
            const sheetConfig = config.default;
            const colMapping = sheetConfig.columns;
            const validations = sheetConfig.validation;

            const headerRow = worksheet.getRow(1);
            const headers = {};
            headerRow.eachCell((cell, colNumber) => headers[cell.value] = colNumber);

            let sheetErrors = [];
            for (const colName in colMapping) {
                if (!headers[colName]) {
                    sheetErrors.push(`Sheet ${sheetName} is missing required column ${colName}`);
                }
            }

            if (sheetErrors.length > 0) {
                hasErrors = true;
                response.sheets[sheetName] = { errors: sheetErrors };
                return;
            }

            response.sheets[sheetName] = { errors: [], data: [] };
            response.validData[sheetName] = [];

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowData = { fileId: fileMeta._id, rowNumber };
                const rowErrors = [];
                for (const colName in colMapping) {
                    const colIndex = headers[colName];
                    let cellValue = row.getCell(colIndex).value;

                    if (colMapping[colName] === 'Verified') {
                        cellValue = (String(cellValue).trim().toLowerCase() === 'yes');
                    }

                    rowData[colMapping[colName]] = cellValue;

                    const rules = validations[colName];
                    if (rules) {
                        if (rules.required && !cellValue) {
                            rowErrors.push(`Row ${rowNumber}: ${colName} is required.`);
                        }
                        if (rules.numeric && isNaN(Number(cellValue))) {
                            rowErrors.push(`Row ${rowNumber}: ${colName} must be numeric.`);
                        }
                        if (rules.date) {
                            const { valid, date, message } = validateAndParseDate(cellValue);
                            if (!valid) rowErrors.push(`Row ${rowNumber}: ${colName} - ${message}`);
                            else rowData[colMapping[colName]] = date;
                        }
                    }
                }

                if (rowErrors.length > 0) {
                    response.sheets[sheetName].errors.push(...rowErrors);
                    hasErrors = true;
                } else {
                    response.sheets[sheetName].data.push(rowData);
                    response.validData[sheetName].push(rowData);
                }
            });
        });

        fs.unlinkSync(req.file.path);

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getFiles,
    deleteFileById,
    uploadFile
}