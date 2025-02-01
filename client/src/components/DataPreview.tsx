import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { indianNumberFormat, formatDate } from "../../utils/formatters";

interface DataPreviewProps {
    validData: any;
    selectedSheet: string;
    onSheetChange: (sheet: string) => void;
    onImport: () => void;
    onDeleteRow: (rowIndex: number) => void;
}

const DataPreview: React.FC<DataPreviewProps> = React.memo(({ validData, selectedSheet, onSheetChange, onImport, onDeleteRow }) => {
    const currentSheetRows = useMemo(() => validData[selectedSheet] || [], [validData, selectedSheet]);

    const handleDelete = (index: number) => {
        if (window.confirm("Are you sure you want to delete this row?")) {
            onDeleteRow(index);
        }
    };

    const Row = useCallback(
        ({ index, style }: { index: number; style: React.CSSProperties }) => {
            const row = currentSheetRows[index];
            return (
                <div style={style} className="flex border-b items-center">
                    <div className="flex-1 p-2">{row.rowNumber}</div>
                    <div className="flex-1 p-2">{row.name}</div>
                    <div className="flex-1 p-2">{indianNumberFormat(row.amount)}</div>
                    <div className="flex-1 p-2">{formatDate(row.date)}</div>
                    <div className="flex-1 p-2">{row.verified ? "Yes" : "No"}</div>
                    <button
                        className="p-1 bg-red-500 text-sm text-white rounded hover:bg-red-600 focus:outline-none"
                        onClick={() => handleDelete(index)}
                    >
                        Delete
                    </button>
                </div>
            );
        },
        [currentSheetRows]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h2 className="text-2xl font-semibold mb-4">Data Preview</h2>
            <div className="mb-4">
                <label htmlFor="sheet-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Sheet:
                </label>
                <select
                    id="sheet-select"
                    value={selectedSheet}
                    onChange={(e) => onSheetChange(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    {Object.keys(validData).map((sheet) => (
                        <option key={sheet} value={sheet}>
                            {sheet}
                        </option>
                    ))}
                </select>
            </div>
            <div className="h-96 border rounded">
                <AutoSizer>
                    {({ height, width }) => (
                        <List height={height} itemCount={currentSheetRows.length} itemSize={35} width={width}>
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onImport}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Import Data
            </motion.button>
        </motion.div>
    );
});

export default DataPreview;
