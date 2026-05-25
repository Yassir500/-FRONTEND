import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  const estadosConfig = {
    pendiente: { color: '#f39c12', label: 'Pendiente' },
    procesando: { color: '#3498db', label: 'Procesando' },
    enviado: { color: '#9b59b6', label: 'Enviado' },
    entregado: { color: '#27ae60', label: 'Entregado' },
    cancelado: { color: '#e74c3c', label: 'Cancelado' }
  }

  useEffect(() => {
    fetchMisPedidos()
  }, [])

  const fetchMisPedidos = async () => {
    setLoading(true)
    try {
      const response = await pedidoService.getAll({ usuario_id: user?.id })
      setPedidos(response.data || response)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
          <p>No tienes pedidos aún</p>
          <button className="btn btn-primary" onClick={() => navigate('/productos')}>Comenzar a comprar</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {pedidos.map(pedido => (
            <div key={pedido.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', cursor: 'pointer' }} onClick={() => navigate(`/pedidos/${pedido.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div>
                  <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>Pedido #{pedido.id}</p>
                  <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>{new Date(pedido.created_at).toLocaleDateString()}</p>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '0.875rem', backgroundColor: estadosConfig[pedido.estado]?.color || '#95a5a6' }}>
                  {estadosConfig[pedido.estado]?.label || pedido.estado}
                </span>
              </div>
              
              <div>
                <p style={{ margin: '5px 0' }}>Total: <strong>${pedido.total}</strong></p>
                <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>Productos: {pedido.items?.length || 0}</p>
              </div>
              
              <div style={{ marginTop: '10px', color: '#007bff', fontSize: '0.875rem' }}>Ver detalles →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}