import axios from "axios"

const API_URL = "http://localhost:5000"

export const fetchFiles = async () => {
    try {
        const response = await axios.get(`${API_URL}/files`)
        return response.data
    } catch (error) {
        console.error("Error fetching files:", error)
        throw error
    }
}

export const fetchRecords = async (fileId: string) => {
    try {
        const response = await axios.get(`${API_URL}/records/${fileId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching records:", error)
        throw error
    }
}

export const deleteFile = async (fileId: string) => {
    try {
        await axios.delete(`${API_URL}/files/${fileId}`)
    } catch (error) {
        console.error("Error deleting file:", error)
        throw error
    }
}

