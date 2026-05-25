import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export const PedidoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)

  const estadosConfig = {
    1: { color: '#f39c12', label: 'Pendiente' },
    2: { color: '#3498db', label: 'Procesando' },
    3: { color: '#e74c3c', label: 'Rechazado' },
    4: { color: '#27ae60', label: 'Completado' }
  }

  useEffect(() => {
    fetchPedido()
  }, [id])

  const fetchPedido = async () => {
    setLoading(true)
    try {
      const response = await pedidoService.getById(id)
      console.log('📦 Pedido recibido:', response)
      setPedido(response.data || response)
    } catch (error) {
      console.error('Error al cargar pedido:', error)
      navigate('/mis-pedidos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!pedido) return null

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}>
        ← Volver
      </button>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Pedido #{pedido.id}</h2>
          <span style={{ 
            padding: '5px 15px', 
            borderRadius: '20px', 
            backgroundColor: estadosConfig[pedido.estado_pedido]?.color || '#95a5a6' 
          }}>
            {estadosConfig[pedido.estado_pedido]?.label || 'Desconocido'}
          </span>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Información del cliente */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Información del cliente</h3>
            <p><strong>Nombre:</strong> {pedido.usuario?.nombre_completo || pedido.usuario?.nombre || `${pedido.usuario?.nombre} ${pedido.usuario?.apellido}`}</p>
            <p><strong>Email:</strong> {pedido.usuario?.email}</p>
          </div>

          {/* Fecha del pedido - SOLO FECHA Y HORA */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '10px' }}>📅 Fecha del pedido</h3>
            <p style={{ margin: 0 }}>
              {new Date(pedido.created_at).toLocaleString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>

          {/* Notas del pedido (si existen) */}
          {pedido.notas && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Notas:</strong>
              <p style={{ margin: '5px 0 0' }}>{pedido.notas}</p>
            </div>
          )}

          {/* Productos */}
          <h3>Productos</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.items && pedido.items.length > 0 ? (
                  pedido.items.map(item => (
                    <tr key={item.id}>
                      <td>{item.producto?.nombre_producto || 'Producto no disponible'}</td>
                      <td>{item.cantidad}</td>
                      <td>${parseFloat(item.precio_lista).toFixed(2)}</td>
                      <td>${(item.cantidad * parseFloat(item.precio_lista)).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No hay productos en este pedido</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.25rem' }}>
            <strong>Total:</strong> 
            <span style={{ color: '#27ae60', fontSize: '1.5rem', marginLeft: '10px' }}>
              ${pedido.total ? parseFloat(pedido.total).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
