import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ErrorModalProps {
    show: boolean
    onClose: () => void
    errors: any
    selectedSheet: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({ show, onClose, errors, selectedSheet }) => {
    console.log(errors)
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg shadow-xl max-w-lg w-full"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Validation Errors</h3>
                            <div className="mb-4">
                                <label htmlFor="sheet-select" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Sheet:
                                </label>
                                <select
                                    id="sheet-select"
                                    value={selectedSheet}
                                    onChange={(e) => e.target.value}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    {Object.keys(errors).map((sheet) => (
                                        <option key={sheet} value={sheet}>
                                            {sheet}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors[selectedSheet]?.errors && errors[selectedSheet].errors.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-red-500">
                                    {errors[selectedSheet].errors.map((err: string, idx: number) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No errors for this sheet.</p>
                            )}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ErrorModal

