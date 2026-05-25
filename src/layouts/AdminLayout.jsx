import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export const AdminLayout = () => {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Menú de administrador
  const adminMenu = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/productos', icon: '📦', label: 'Productos' },
    { path: '/admin/pedidos', icon: '📋', label: 'Pedidos' },
    { path: '/admin/categorias', icon: '📂', label: 'Categorías' },
    { path: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
    { path: '/admin/reportes', icon: '📈', label: 'Reportes' },
    { path: '/admin/configuracion', icon: '⚙️', label: 'Configuración' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '70px',
        backgroundColor: '#1a252f',
        color: 'white',
        transition: 'all 0.3s ease',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          gap: '10px'
        }}>
          {sidebarOpen ? (
            <>
              <span style={{ fontSize: '24px' }}>🏪</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Panel</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >◀</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: '24px' }}>🏪</span>
              <button 
                onClick={() => setSidebarOpen(true)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >▶</button>
            </>
          )}
        </div>

        {/* Menú */}
        <nav style={{ padding: '20px 0' }}>
          {adminMenu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span>👤</span>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Administrador</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{user?.nombre || user?.email}</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{
        marginLeft: sidebarOpen ? '260px' : '70px',
        flex: 1,
        transition: 'all 0.3s ease'
      }}>
        {/* Top bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px 25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#2c3e50' }}>Panel de Administración</h2>
            <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#7f8c8d' }}>
              Bienvenido de vuelta, {user?.nombre || user?.email}
            </p>
          </div>
        </div>

        {/* Outlet para las páginas */}
        <div style={{ padding: '25px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}