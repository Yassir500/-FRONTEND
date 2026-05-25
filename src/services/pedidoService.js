import apiClient from './api'

export const pedidoService = {
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/pedidos', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pedidos' }
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/pedidos/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pedido' }
    }
  },

  create: async (data) => {
    try {
      console.log('📤 Creando pedido:', data)
      const response = await apiClient.post('/pedidos', data)
      console.log('✅ Pedido creado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error en create:', error.response?.data)
      throw error.response?.data || { message: 'Error al crear pedido' }
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/pedidos/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar pedido' }
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/pedidos/${id}`)
      return { success: true }
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar pedido' }
    }
  }
}
