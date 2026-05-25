// src/services/categoriaService.js
import apiClient from './api'

export const categoriaService = {
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/categorias', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener categorías' }
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/categorias/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener categoría' }
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/categorias', {
        nombre_categoria: data.nombre_categoria || data.nombre  // Acepta ambos formatos
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear categoría' }
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/categorias/${id}`, {
        nombre_categoria: data.nombre_categoria || data.nombre
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar categoría' }
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/categorias/${id}`)
      return { success: true }
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar categoría' }
    }
  }
}