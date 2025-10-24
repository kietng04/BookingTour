import axios from 'axios'
import { env } from './env'
import { storage } from './storage'

export const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
 
  
  async (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth
      storage.removeToken()
      storage.removeUser()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

