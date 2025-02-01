# Excel Data Importer

Excel Data Importer is a full-stack application designed to efficiently process, validate, preview, and import large Excel (.xlsx) files into a MongoDB database. The project leverages a robust Express backend with MongoDB aggregation pipelines for efficient data upsert and deletion, and a modern React frontend using virtualization to handle large datasets without performance degradation.

---

## Table of Contents

- [Features](#features)
- [Architecture and Technology Stack](#architecture-and-technology-stack)
- [Scalability](#scalability)
- [Error Handling and Testing](#error-handling-and-testing)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- **Excel File Upload**  
  - Supports only `.xlsx` files up to 2 MB by default.
  - Uses [Multer](https://github.com/expressjs/multer) for file uploads.
  
- **Data Parsing and Validation**  
  - Utilizes [ExcelJS](https://github.com/exceljs/exceljs) to read and parse Excel files.
  - Validates required columns, numeric fields, dates, and boolean fields.
  - Provides detailed row-by-row error messages for missing or invalid data.
  - Throws an error if the file is empty or if a sheet lacks mandatory columns.

- **Data Preview with Virtualization**  
  - Displays a preview of valid rows per sheet using virtualization (via `react-window` and `react-virtualized-auto-sizer`).
  - Allows deletion of individual rows with a confirmation prompt before removal.
  - Includes a dropdown to switch between sheets.

- **Data Import Using Aggregation Pipelines**  
  - Leverages MongoDB aggregation pipelines (including `$merge` and `$match`) for efficient upsert operations.
  - Ensures that importing does not duplicate data—only new rows are inserted and existing rows are updated.
  - Deletes records from the database that have been removed in the preview.
  
- **File Management**  
  - Saves file metadata in MongoDB.
  - Provides APIs to list, view associated records, and delete files (which also deletes related records).
  
- **Frontend and Backend Integration**  
  - A seamless integration between a React frontend and an Express/MongoDB backend.
  - Uses Framer Motion for smooth animations and modern UI feedback.
  - Implements modular and reusable components for file upload, data preview, error display, and record viewing.

---

## Architecture and Technology Stack

- **Backend:**  
  - **Express.js:** For building RESTful APIs.
  - **MongoDB:** NoSQL database for storing file metadata and records.
  - **Mongoose:** ODM for MongoDB.
  - **ExcelJS:** To parse Excel files.
  - **Multer:** For handling file uploads.
  - **Aggregation Pipelines:** Used to upsert and delete records efficiently.
  
- **Frontend:**  
  - **React:** For building a modern, component-based UI.
  - **Framer Motion:** For smooth animations.
  - **react-window & react-virtualized-auto-sizer:** For virtualization to efficiently render large lists of rows.
  - **Axios:** For API calls.

---

## Scalability

This project is designed to scale and handle large Excel files with lakhs (hundreds of thousands) of rows:
  
- **Backend Optimizations:**
  - Uses MongoDB aggregation pipelines to perform bulk upserts and deletions, minimizing the number of write operations.
  - Efficient bulk operations reduce the cost of updates even when only a few rows change.
  
- **Frontend Optimizations:**
  - Virtualization (via `react-window` and `react-virtualized-auto-sizer`) allows the UI to render only visible rows, ensuring smooth performance regardless of the dataset size.
  - React hooks and memoization help prevent unnecessary re-renders when dealing with thousands of rows.

---

## Error Handling and Testing

- **Robust Error Handling:**
  - The backend returns clear error messages for cases such as:
    - No file uploaded.
    - File not found after upload.
    - Empty files or sheets.
    - Missing mandatory columns.
    - Data type validation errors (e.g., non-numeric values for numeric fields).
  - The frontend displays errors via an error modal, ensuring users understand and can correct issues.

- **Testing:**
  - The solution has been tested against a variety of scenarios:
    - **Empty Files:** Uploading an empty Excel file triggers an error.
    - **Missing Columns:** Files missing required columns result in detailed error messages.
    - **Invalid Data:** Rows with invalid or improperly formatted data are flagged with specific row-level error messages.
  - This thorough testing ensures reliability even when handling diverse or unexpected file formats.

---

## Project Structure

```
Directory structure:
└── singhjasvinder101-react-excel/
    ├── client/
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── vite.config.js
    │   ├── .gitignore
    │   ├── api/
    │   │   ├── dataApi.ts
    │   │   └── fileApi.ts
    │   ├── public/
    │   ├── src/
    │   │   ├── App.css
    │   │   ├── App.jsx
    │   │   ├── index.css
    │   │   ├── main.jsx
    │   │   ├── assets/
    │   │   └── components/
    │   │       ├── DataPreview.tsx
    │   │       ├── ErrorModal.tsx
    │   │       ├── FileList.tsx
    │   │       ├── FileUploadPage.tsx
    │   │       ├── FileUploader.tsx
    │   │       └── RecordsView.tsx
    │   └── utils/
    │       └── formatters.ts
    └── server/
        ├── config.json
        ├── package-lock.json
        ├── package.json
        ├── server.js
        ├── .gitignore
        ├── config/
        │   └── db.js
        ├── controllers/
        │   ├── FileController.js
        │   └── RecordController.js
        ├── middleware/
        │   └── file.js
        ├── models/
        │   ├── File.js
        │   └── Record.js
        ├── uploads
        └── utils/
            └── dateFormat.js

```
---

## Usage

1. **Installation:**
   - Clone the repository.
   - Install backend dependencies (inside the `server` folder):
     ```bash
     npm install
     ```
   - Install frontend dependencies (inside the `client` folder):
     ```bash
     npm install
     ```
     
2. **Configuration:**
   - Create a `.env` file for environment variables (e.g., MongoDB URI, PORT).
   - Adjust `config.json` to set up your Excel column mappings and validation rules.

3. **Running the Application:**
   - Start the backend server:
     ```bash
     nodemon server.js
     ```
   - Start the frontend (if using create-react-app):
     ```bash
     npm run dev
     ```
     
4. **Using the Application:**
   - Upload an Excel file using the file uploader.
   - Preview the parsed data. Delete any unwanted rows using the “Delete” button (with confirmation).
   - Import the valid data into the database.
   - View the list of uploaded files and associated records.
   - Delete files (which will also delete associated records) via the Files List.

---

## Future Enhancements

- **File Streaming:**  
  Implement streaming for processing huge Excel files (millions of rows) to further reduce memory usage.

- **Support for Additional Formats:**  
  Add support for CSV or other file formats alongside Excel.

- **Advanced Validation:**  
  Enhance validation logic (e.g., custom regex validations, cross-field validations).

- **User Authentication and Role-Based Access:**  
  Secure the API endpoints and the frontend by adding user authentication, so that only authorized users can upload or delete files.

- **Data Visualization:**  
  Integrate charts and graphs to provide insights into the imported data.

- **Improved Error Reporting:**  
  Log errors to an external monitoring service and provide more granular error feedback to users.

- **Internationalization:**  
  Support different number and date formats based on user locale.

- **Progress Indicators:**  
  Add progress bars or spinners during file processing and data import for better UX on large datasets.

---

Excel Data Importer is designed with scalability, robust error handling, and an optimal user experience in mind—making it a solid foundation for projects that require importing and processing large datasets. Enjoy using and extending it!

