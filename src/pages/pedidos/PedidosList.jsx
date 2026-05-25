import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'
import { Modal } from '../../components/Modal'

export const PedidosList = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null })
  const navigate = useNavigate()

  const estadosConfig = {
    pendiente: { color: '#f39c12', label: 'Pendiente' },
    procesando: { color: '#3498db', label: 'Procesando' },
    enviado: { color: '#9b59b6', label: 'Enviado' },
    entregado: { color: '#27ae60', label: 'Entregado' },
    cancelado: { color: '#e74c3c', label: 'Cancelado' }
  }

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    setLoading(true)
    try {
      const response = await pedidoService.getAll()
      setPedidos(response.data || response)
    } catch (error) {
      showToast(error.message || 'Error al cargar pedidos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdateEstado = async (id, estado) => {
    try {
      await pedidoService.update(id, { estado })
      showToast(`Estado actualizado a ${estadosConfig[estado]?.label || estado}`)
      fetchPedidos()
    } catch (error) {
      showToast(error.message || 'Error al actualizar estado', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await pedidoService.delete(deleteModal.id)
      showToast('Pedido eliminado correctamente')
      fetchPedidos()
    } catch (error) {
      showToast(error.message || 'Error al eliminar pedido', 'error')
    } finally {
      setDeleteModal({ show: false, id: null })
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="header-actions">
        <h1>Gestión de Pedidos</h1>
      </div>

      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
          <p>No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.usuario?.nombre_completo || pedido.usuario?.nombre || `${pedido.usuario?.nombre} ${pedido.usuario?.apellido}` || pedido.usuario?.email}</td>
                  <td>{new Date(pedido.created_at).toLocaleDateString()}</td>
                  <td><strong>${pedido.total}</strong></td>
                  <td>
                    <select
                      value={pedido.estado}
                      onChange={(e) => handleUpdateEstado(pedido.id, e.target.value)}
                      style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', color: 'white', backgroundColor: estadosConfig[pedido.estado]?.color || '#95a5a6', cursor: 'pointer' }}
                    >
                      {Object.entries(estadosConfig).map(([key, config]) => (
                        <option key={key} value={key} style={{ color: '#333' }}>{config.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/admin/pedidos/${pedido.id}`)}>Ver</button>
                    <button className="btn btn-danger btn-sm" style={{ marginLeft: '5px' }} onClick={() => setDeleteModal({ show: true, id: pedido.id })}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={deleteModal.show} title="Eliminar pedido" onConfirm={handleDelete} onClose={() => setDeleteModal({ show: false, id: null })}>
        ¿Estás seguro de eliminar este pedido?
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}