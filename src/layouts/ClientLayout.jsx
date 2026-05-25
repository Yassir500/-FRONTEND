import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export const ClientLayout = () => {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartCount = getCartCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      {/* Navbar superior para clientes */}
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
        zIndex: 100,
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
          <span>DSS404 TATSU</span>
        </Link>

        {/* Menú desktop - SIN OFERTAS Y SIN CONTACTO */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/productos" style={{ color: 'white', textDecoration: 'none' }}>📦 Productos</Link>
          <Link to="/nosotros" style={{ color: 'white', textDecoration: 'none' }}>📖 Nosotros</Link>
        </div>

        {/* Iconos de usuario y carrito */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/carrito" style={{ 
            color: 'white', 
            textDecoration: 'none',
            position: 'relative',
            fontSize: '24px'
          }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
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

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              👤
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>

            {/* Dropdown menu */}
            {mobileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '180px',
                zIndex: 101,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {user?.nombre_completo || user?.nombre || user?.email}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{user?.email}</div>
                </div>
                <Link to="/mis-pedidos" style={{
                  display: 'block',
                  padding: '10px 16px',
                  color: '#2c3e50',
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}>
                  📜 Mis Pedidos
                </Link>
                <div style={{ borderTop: '1px solid #eee' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer'
                    }}
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>



      {/* Contenido principal */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: 'calc(100vh - 150px)' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '40px 20px 20px',
        marginTop: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div>
            <h3 style={{ marginBottom: '15px' }}>🏪 DSS404 TATSU</h3>
            <p style={{ opacity: 0.8 }}>Tu tienda de confianza en línea. Los mejores productos al mejor precio.</p>
          </div>
          <div>
            <h4>Enlaces rápidos</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/productos" style={{ color: '#ecf0f1', textDecoration: 'none', opacity: 0.8 }}>Productos</Link></li>
              <li><Link to="/nosotros" style={{ color: '#ecf0f1', textDecoration: 'none', opacity: 0.8 }}>Nosotros</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>📧 soporte@dss404.com</p>
            <p>📞 (55) 1234-5678</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
          <p>&copy; 2024 DSS404 TATSU - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}