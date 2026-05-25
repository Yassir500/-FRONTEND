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
    pendiente: { color: '#f39c12', label: 'Pendiente' },
    procesando: { color: '#3498db', label: 'Procesando' },
    enviado: { color: '#9b59b6', label: 'Enviado' },
    entregado: { color: '#27ae60', label: 'Entregado' },
    cancelado: { color: '#e74c3c', label: 'Cancelado' }
  }

  useEffect(() => {
    fetchPedido()
  }, [id])

  const fetchPedido = async () => {
    setLoading(true)
    try {
      const response = await pedidoService.getById(id)
      setPedido(response.data || response)
    } catch (error) {
      navigate(-1)
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
          <span style={{ padding: '5px 15px', borderRadius: '20px', backgroundColor: estadosConfig[pedido.estado]?.color || '#95a5a6' }}>
            {estadosConfig[pedido.estado]?.label || pedido.estado}
          </span>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3>Información del cliente</h3>
              <p><strong>Nombre:</strong> {pedido.usuario?.nombre_completo || pedido.usuario?.nombre || `${pedido.usuario?.nombre} ${pedido.usuario?.apellido}`}</p>
              <p><strong>Email:</strong> {pedido.usuario?.email}</p>
            </div>
            <div>
              <h3>Detalles de envío</h3>
              <p><strong>Dirección:</strong> {pedido.direccion}</p>
              <p><strong>Teléfono:</strong> {pedido.telefono}</p>
              <p><strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleString()}</p>
            </div>
          </div>

          <h3>Productos</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {pedido.items?.map(item => (
                  <tr key={item.id}>
                    <td>{item.producto?.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio_unitario}</td>
                    <td>${item.cantidad * item.precio_unitario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pedido.notas && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Notas:</strong>
              <p style={{ margin: '5px 0 0' }}>{pedido.notas}</p>
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.25rem' }}>
            <strong>Total:</strong> <span style={{ color: '#27ae60', fontSize: '1.5rem' }}>${pedido.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}