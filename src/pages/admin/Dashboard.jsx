import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productoService } from '../../services/productoService'
import { pedidoService } from '../../services/pedidoService'
import { usuarioService } from '../../services/usuarioService'

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    productos: 0,
    pedidos: 0,
    usuarios: 0,
    ingresos: 0,
    pedidosPendientes: 0
  })
  const [loading, setLoading] = useState(true)
  const [ultimosPedidos, setUltimosPedidos] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productos, pedidos, usuarios] = await Promise.all([
        productoService.getAll(),
        pedidoService.getAll(),
        usuarioService.getAll()
      ])

      const productosData = productos.data || productos
      const pedidosData = pedidos.data || pedidos
      const usuariosData = usuarios.data || usuarios

      const ingresos = pedidosData.reduce((total, p) => total + (p.total || 0), 0)
      const pedidosPendientes = pedidosData.filter(p => p.estado === 'pendiente' || p.estado === 'procesando').length
      
      // Últimos 5 pedidos
      const ultimos = [...pedidosData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

      setStats({
        productos: productosData.length,
        pedidos: pedidosData.length,
        usuarios: usuariosData.length,
        ingresos: ingresos,
        pedidosPendientes: pedidosPendientes
      })
      setUltimosPedidos(ultimos)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { title: 'Productos', value: stats.productos, icon: '📦', color: '#3498db', link: '/admin/productos' },
    { title: 'Pedidos', value: stats.pedidos, icon: '📋', color: '#e74c3c', link: '/admin/pedidos' },
    { title: 'Pendientes', value: stats.pedidosPendientes, icon: '⏳', color: '#f39c12', link: '/admin/pedidos' },
    { title: 'Usuarios', value: stats.usuarios, icon: '👥', color: '#27ae60', link: '/admin/usuarios' },
    { title: 'Ingresos', value: `$${stats.ingresos.toFixed(2)}`, icon: '💰', color: '#9b59b6', link: '/admin/reportes' }
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '10px' }}>Dashboard</h1>
      <p style={{ marginBottom: '30px', color: '#7f8c8d' }}>Bienvenido al panel de administración</p>

      {/* Tarjetas de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {cards.map(card => (
          <Link key={card.title} to={card.link} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              borderLeft: `4px solid ${card.color}`,
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>{card.title}</p>
                  <h2 style={{ margin: '10px 0 0', fontSize: '28px', color: '#2c3e50' }}>{card.value}</h2>
                </div>
                <div style={{ fontSize: '40px' }}>{card.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Últimos pedidos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>📋 Últimos pedidos</h3>
          {ultimosPedidos.length === 0 ? (
            <p style={{ color: '#7f8c8d' }}>No hay pedidos recientes</p>
          ) : (
            <div>
              {ultimosPedidos.map(pedido => (
                <div key={pedido.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <strong>#{pedido.id}</strong>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {pedido.usuario?.nombre || pedido.usuario?.email}
                    </div>
                  </div>
                  <div>
                    <span style={{
                      backgroundColor: pedido.estado === 'pendiente' ? '#f39c12' : '#27ae60',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px'
                    }}>
                      {pedido.estado}
                    </span>
                    <strong style={{ marginLeft: '10px' }}>${pedido.total}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/pedidos" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: '#3498db' }}>
            Ver todos →
          </Link>
        </div>

        {/* Acciones rápidas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>⚡ Acciones rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/admin/productos/crear" className="btn btn-primary" style={{ textAlign: 'center' }}>
              ➕ Nuevo Producto
            </Link>
            <Link to="/admin/categorias" className="btn btn-warning" style={{ textAlign: 'center' }}>
              📂 Gestionar Categorías
            </Link>
            <Link to="/admin/usuarios" className="btn btn-info" style={{ textAlign: 'center' }}>
              👥 Gestionar Usuarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}