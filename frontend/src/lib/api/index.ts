import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && originalRequest) {
          // Try to refresh the token
          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                refreshToken
              })

              const { accessToken, refreshToken: newRefreshToken } = response.data.data

              // Update tokens
              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('refreshToken', newRefreshToken)

              // Retry the original request
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: any): Promise<any> {
    return this.client.get(url, { params })
  }

  async post<T>(url: string, data?: any): Promise<any> {
    return this.client.post(url, data)
  }

  async put<T>(url: string, data?: any): Promise<any> {
    return this.client.put(url, data)
  }

  async patch<T>(url: string, data?: any): Promise<any> {
    return this.client.patch(url, data)
  }

  async delete<T>(url: string): Promise<any> {
    return this.client.delete(url)
  }
}

export const api = new ApiClient()
export default api