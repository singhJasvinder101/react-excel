const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
require("dotenv").config()

const { importRecords, getRecordById } = require('./controllers/RecordController');
const { uploadFile, getFiles, deleteFileById } = require('./controllers/FileController');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== '.xlsx') {
            return cb(new Error('Only .xlsx files are allowed'));
        }
        cb(null, true);
    }
});

// description of each route inshort

// POST /upload: Process and store file metadata
app.post('/upload', upload.single('file'), uploadFile);

// POST /import: Store records linked to file
app.post('/import', importRecords);

// GET /files: Retrieve all uploaded file metadata
app.get('/files', getFiles);

// GET /records/:fileId: Retrieve records linked to a file
app.get('/records/:fileId', getRecordById);

app.delete('/files/:fileId', deleteFileById);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
