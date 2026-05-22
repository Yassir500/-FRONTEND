import axios from 'axios'
import { setupInterceptors } from '../interceptors/axiosInterceptors'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Configurar interceptors
setupInterceptors(apiClient)

export default apiClient
