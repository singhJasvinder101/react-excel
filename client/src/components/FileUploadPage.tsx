import React, { useCallback } from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import FileUploader from "./FileUploader"
import DataPreview from "./DataPreview"
import ErrorModal from "./ErrorModal"
import { deleteFile, fetchFiles, fetchRecords } from "../../api/fileApi"
import { importData, uploadFile } from "../../api/dataApi"
import RecordsView from "./RecordsView"
import FilesList from "./FileList"

const FileUploadPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<any>({})
    const [errors, setErrors] = useState<any>({})
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [selectedSheet, setSelectedSheet] = useState("")
    const [validData, setValidData] = useState<any>({})
    const [filesList, setFilesList] = useState([])
    const [selectedFileId, setSelectedFileId] = useState("")
    const [fileRecords, setFileRecords] = useState([])
    const [recordsLoading, setRecordsLoading] = useState(false)

    const handleDeleteRow = useCallback((rowIndex: number) => {
        setValidData((prevData) => {
            const updatedSheetData = [...prevData[selectedSheet]];
            updatedSheetData.splice(rowIndex, 1);
            return { ...prevData, [selectedSheet]: updatedSheetData };
        });
    }, [selectedSheet]);

    useEffect(() => {
        loadFiles()
    }, [])

    const loadFiles = useCallback(async () => {
        const files = await fetchFiles()
        console.log(files)
        setFilesList(files)
    }, [])

    const handleFileUpload = useCallback(
        async (uploadedFile: File) => {
            setFile(uploadedFile)
            const result = await uploadFile(uploadedFile)
            setErrors(result.sheets)
            setPreviewData(result.sheets)
            setValidData(result.validData)
            setSelectedSheet(Object.keys(result.sheets)[0])
            setShowErrorModal(Object.values(result.sheets).some((sheet: any) => sheet.errors.length > 0))
            loadFiles()
        },
        [loadFiles],
    )

    const handleImport = useCallback(async () => {
        await importData(validData)
        loadFiles()
    }, [validData, loadFiles])

    const handleFileSelection = useCallback(async (fileId: string) => {
        setSelectedFileId(fileId)
        setRecordsLoading(true)
        const records = await fetchRecords(fileId)
        setFileRecords(records)
        setRecordsLoading(false)
    }, [])

    const handleDeleteFile = useCallback(
        async (fileId: string) => {
            await deleteFile(fileId)
            loadFiles()
            if (fileId === selectedFileId) {
                setSelectedFileId("")
                setFileRecords([])
            }
        },
        [loadFiles, selectedFileId],
    )

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <h1 className="text-3xl font-bold mb-8">Excel Data Importer</h1>

            <FileUploader onFileUpload={handleFileUpload} />

            {selectedSheet && (
                <DataPreview
                    validData={validData}
                    onDeleteRow={handleDeleteRow}
                    selectedSheet={selectedSheet}
                    onSheetChange={setSelectedSheet}
                    onImport={handleImport}
                />
            )}

            <ErrorModal
                show={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errors={errors}
                selectedSheet={selectedSheet}
            />

            <FilesList files={filesList} onFileSelect={handleFileSelection} onFileDelete={handleDeleteFile} />

            {selectedFileId && <RecordsView fileId={selectedFileId} records={fileRecords} loading={recordsLoading} />}
        </motion.div>
    )
}

export default FileUploadPage
