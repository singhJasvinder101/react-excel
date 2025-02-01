import axios from "axios"

const API_URL = "http://localhost:5000"

export const uploadFile = async (file: File) => {
    try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await axios.post(`${API_URL}/upload`, formData)
        return response.data
    } catch (error) {
        console.error("Error uploading file:", error)
        throw error
    }
}

export const importData = async (validData: any) => {
    try {
        const response = await axios.post(`${API_URL}/import`, { validData })
        return response.data
    } catch (error) {
        console.error("Error importing data:", error)
        throw error
    }
}

