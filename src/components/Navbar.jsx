import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAdmin = user?.is_admin === 1 || user?.rol === 'admin'
  const cartCount = getCartCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <Link to="/productos" style={{ 
        color: 'white', 
        textDecoration: 'none', 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '28px' }}>🏪</span>
        DSS404 TATSU
      </Link>

      {/* Menú desktop */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        alignItems: 'center', 
        flexWrap: 'wrap'
      }}>
        <Link to="/productos" style={{ color: 'white', textDecoration: 'none' }}>📦 Productos</Link>

        {isAdmin ? (
          <>
            <Link to="/admin/pedidos" style={{ color: 'white', textDecoration: 'none' }}>📋 Pedidos</Link>
            <Link to="/admin/categorias" style={{ color: 'white', textDecoration: 'none' }}>📂 Categorías</Link>
            <Link to="/admin/usuarios" style={{ color: 'white', textDecoration: 'none' }}>👥 Usuarios</Link>
          </>
        ) : (
          <>
            <Link to="/carrito" style={{ 
              color: 'white', 
              textDecoration: 'none',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              🛒 Carrito
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-15px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/mis-pedidos" style={{ color: 'white', textDecoration: 'none' }}>📜 Mis Pedidos</Link>
          </>
        )}

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          paddingLeft: '1rem',
          borderLeft: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '5px 12px',
            borderRadius: '20px'
          }}>
            <span>👋</span>
            <span style={{ fontSize: '0.875rem' }}>
              {user?.nombre_completo || user?.nombre || `${user?.nombre} ${user?.apellido}` || user?.email?.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(231, 76, 60, 0.8)',
              color: 'white',
              border: 'none',
              padding: '6px 15px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e74c3c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.8)'}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}