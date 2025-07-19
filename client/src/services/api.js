import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const parseDecision = async (text) => {
  try {
    const response = await api.post('/api/parse-decision', text,{
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to parse decision')
  }
}

export const logDecision = async (decision) => {
  try {
    const response = await api.post('/api/log-decision', decision)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to log decision')
  }
}

export const processOCR = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post('/api/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data.text
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to process image')
  }
}