import apiClient from './api'

export const productoService = {
  // Obtener todos los productos con paginación
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/productos', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error en getAll:', error.response?.data)
      throw error.response?.data || { message: 'Error al obtener productos' }
    }
  },

  // Obtener un producto por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error en getById:', error.response?.data)
      throw error.response?.data || { message: 'Error al obtener producto' }
    }
  },

  // Crear producto - enviar como FormData para soportar imágenes
  create: async (data) => {
    try {
      console.log('📤 Creando producto con FormData')
      
      const response = await apiClient.post('/productos', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('✅ Producto creado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error en create:', error.response?.data)
      throw error.response?.data || { message: 'Error al crear producto' }
    }
  },

  // Actualizar producto - con soporte para imágenes
  update: async (id, data) => {
    try {
      let response
      
      if (data instanceof FormData) {
        // Para FormData con imágenes, usar POST con _method=PUT
        data.append('_method', 'PUT')
        response = await apiClient.post(`/productos/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // Para datos JSON normales
        response = await apiClient.put(`/productos/${id}`, data)
      }
      
      console.log('✅ Producto actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error en update:', error.response?.data)
      throw error.response?.data || { message: 'Error al actualizar producto' }
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      await apiClient.delete(`/productos/${id}`)
      return { success: true }
    } catch (error) {
      console.error('❌ Error en delete:', error.response?.data)
      throw error.response?.data || { message: 'Error al eliminar producto' }
    }
  }
}