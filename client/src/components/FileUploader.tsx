import React from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"

interface FileUploaderProps {
    onFileUpload: (file: File) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
        },
        maxSize: 2 * 1024 * 1024,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0])
            }
        },
    })

    return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-8">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300"
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the file here ...</p>
                ) : (
                    <p className="text-gray-500">Drag 'n' drop an .xlsx file here, or click to select file</p>
                )}
            </div>
        </motion.div>
    )
}

export default FileUploader

