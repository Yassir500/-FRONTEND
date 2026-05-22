import apiClient from './api'

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      })
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: error.message || 'Error al iniciar sesión' }
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrarse' }
    }
  },

  // Obtener perfil
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener perfil' }
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/refresh')
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al refrescar token' }
    }
  },

  // Verificar email
  verifyEmail: async (email) => {
    try {
      const response = await apiClient.post('/verify-email', { email })
      return response.data.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al verificar email' }
    }
  }
}
