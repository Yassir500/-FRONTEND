import apiClient from './api'

export const productoService = {
  // Obtener todos los productos
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/productos', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener productos' }
    }
  },

  // Obtener un producto
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener producto' }
    }
  },

  // Crear producto
  create: async (data) => {
    try {
      const response = await apiClient.post('/productos', data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear producto' }
    }
  },

  // Actualizar producto
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/productos/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar producto' }
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      await apiClient.delete(`/productos/${id}`)
      return { success: true }
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar producto' }
    }
  }
}
