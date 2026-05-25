// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className="loading-spinner"><div className="spinner"></div></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Validación para administrador (rol = 3)
  if (adminOnly) {
    const isAdmin = user?.rol === 3 || user?.rol === 'admin' || user?.is_admin === 1
    
    if (!isAdmin) {
      // Si no es admin, redirigir a productos
      return <Navigate to="/productos" replace />
    }
  }

  return children
}
