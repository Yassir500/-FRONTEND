import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
    logout()
    navigate('/login')
  }

  return (
    <div className="container">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
        <h1>DSS404 TATSU</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Bienvenido, {user?.nombre_completo || user?.nombre}</span>
          <button onClick={handleLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2>Dashboard</h2>
        <p>Email: {user?.email}</p>
        <p>Rol: {user?.rol || 'Usuario'}</p>

        <hr style={{ margin: '20px 0' }} />

        <h3>Opciones Disponibles</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <a href="#/productos" style={{ color: '#007bff', textDecoration: 'none' }}>→ Gestionar Productos</a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="#/pedidos" style={{ color: '#007bff', textDecoration: 'none' }}>→ Ver Pedidos</a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="#/categorias" style={{ color: '#007bff', textDecoration: 'none' }}>→ Gestionar Categorías</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
