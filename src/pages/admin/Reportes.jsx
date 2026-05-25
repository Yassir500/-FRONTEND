import React, { useState, useEffect } from 'react'
import { pedidoService } from '../../services/pedidoService'
import { productoService } from '../../services/productoService'

export const AdminReportes = () => {
  const [reporte, setReporte] = useState({
    ventasPorMes: {},
    productosMasVendidos: [],
    totalVentas: 0,
    totalPedidos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportes()
  }, [])

  const fetchReportes = async () => {
    try {
      const [pedidos, productos] = await Promise.all([
        pedidoService.getAll(),
        productoService.getAll()
      ])

      const pedidosData = pedidos.data || pedidos
      const productosData = productos.data || productos

      // Ventas por mes
      const ventasPorMes = {}
      pedidosData.forEach(pedido => {
        const mes = new Date(pedido.created_at).toLocaleString('es', { month: 'long', year: 'numeric' })
        ventasPorMes[mes] = (ventasPorMes[mes] || 0) + (pedido.total || 0)
      })

      // Productos más vendidos (simulado)
      const productosMasVendidos = productosData.slice(0, 5).map(p => ({
        ...p,
        ventas: Math.floor(Math.random() * 100) + 10
      })).sort((a, b) => b.ventas - a.ventas)

      const totalVentas = pedidosData.reduce((sum, p) => sum + (p.total || 0), 0)

      setReporte({
        ventasPorMes,
        productosMasVendidos,
        totalVentas,
        totalPedidos: pedidosData.length
      })
    } catch (error) {
      console.error('Error al cargar reportes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando reportes...</div>
  }

  return (
    <div>
      <h1 style={{ marginBottom: '10px' }}>📊 Reportes</h1>
      <p style={{ marginBottom: '30px', color: '#7f8c8d' }}>Análisis de ventas y estadísticas</p>

      {/* Tarjetas resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>💰</div>
          <h3>Total Ventas</h3>
          <p style={{ fontSize: '24px', color: '#27ae60', fontWeight: 'bold' }}>${reporte.totalVentas.toFixed(2)}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>📦</div>
          <h3>Total Pedidos</h3>
          <p style={{ fontSize: '24px', color: '#3498db', fontWeight: 'bold' }}>{reporte.totalPedidos}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>⭐</div>
          <h3>Ticket Promedio</h3>
          <p style={{ fontSize: '24px', color: '#9b59b6', fontWeight: 'bold' }}>
            ${reporte.totalPedidos > 0 ? (reporte.totalVentas / reporte.totalPedidos).toFixed(2) : 0}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Ventas por mes */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px' }}>
          <h3>📅 Ventas por mes</h3>
          {Object.entries(reporte.ventasPorMes).length === 0 ? (
            <p>No hay datos de ventas</p>
          ) : (
            <div>
              {Object.entries(reporte.ventasPorMes).map(([mes, total]) => (
                <div key={mes} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{mes}</span>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                  <div style={{
                    backgroundColor: '#ecf0f1',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((total / reporte.totalVentas) * 100, 100)}%`,
                      backgroundColor: '#3498db',
                      height: '8px',
                      borderRadius: '10px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Productos más vendidos */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px' }}>
          <h3>🏆 Productos más vendidos</h3>
          {reporte.productosMasVendidos.length === 0 ? (
            <p>No hay datos de productos</p>
          ) : (
            <div>
              {reporte.productosMasVendidos.map((producto, index) => (
                <div key={producto.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <span style={{
                      backgroundColor: '#f39c12',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      marginRight: '10px'
                    }}>#{index + 1}</span>
                    {producto.nombre}
                  </div>
                  <div>
                    <strong>{producto.ventas}</strong> ventas
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}