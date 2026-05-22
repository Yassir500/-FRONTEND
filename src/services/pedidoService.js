import apiClient from './api'

export const pedidoService = {
  // Obtener todos los pedidos
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/pedidos', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pedidos' }
    }
  },

  // Obtener un pedido
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/pedidos/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pedido' }
    }
  },

  // Crear pedido
  create: async (data) => {
    try {
      const response = await apiClient.post('/pedidos', data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear pedido' }
    }
  },

  // Actualizar pedido
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/pedidos/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar pedido' }
    }
  },

  // Eliminar pedido
  delete: async (id) => {
    try {
      await apiClient.delete(`/pedidos/${id}`)
      return { success: true }
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar pedido' }
    }
  }
}
