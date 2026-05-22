export const setupInterceptors = (apiClient) => {
  // Request Interceptor - Agregar token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response Interceptor - Manejar errores
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config

      // Si es error 401 y no es un reintento
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        // Limpiar token y redirigir a login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'

        return Promise.reject(error)
      }

      // Si es error 403 (sin permisos)
      if (error.response?.status === 403) {
        console.error('No tienes permisos para esta acción')
      }

      // Si es error 422 (validación)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors || {}
        return Promise.reject({
          status: 422,
          message: 'Error de validación',
          errors: validationErrors
        })
      }

      // Si es error 404
      if (error.response?.status === 404) {
        console.error('Recurso no encontrado')
      }

      // Error genérico del servidor
      if (error.response?.status >= 500) {
        console.error('Error del servidor')
      }

      return Promise.reject(error)
    }
  )
}
