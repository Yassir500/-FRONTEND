import apiClient from './api'

export const usuarioService = {
  // Obtener todos los usuarios
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/usuarios', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuarios' }
    }
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/usuarios/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuario' }
    }
  },

  // Crear usuario (admin)
  create: async (data) => {
    try {
      const response = await apiClient.post('/usuarios', data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear usuario' }
    }
  },

  // Actualizar usuario
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar usuario' }
    }
  },

  // Cambiar rol de usuario (1=cliente, 2=personal, 3=admin)
  changeRole: async (id, rol) => {
    try {
      const response = await apiClient.patch(`/usuarios/${id}/rol`, { rol: parseInt(rol) })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al cambiar rol' }
    }
  },

  // Eliminar usuario
  delete: async (id) => {
    try {
      await apiClient.delete(`/usuarios/${id}`)
      return { success: true }
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar usuario' }
    }
  },

  // Restaurar usuario eliminado
  restore: async (id) => {
    try {
      const response = await apiClient.patch(`/usuarios/${id}/restore`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al restaurar usuario' }
    }
  }
}