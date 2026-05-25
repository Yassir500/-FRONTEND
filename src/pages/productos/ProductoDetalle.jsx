import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productoService } from '../../services/productoService'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'

export const ProductoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const { user } = useAuth()
  const { addToCart } = useCart()
  const isAdmin = user?.is_admin === 1 || user?.rol === 'admin'

  useEffect(() => {
    fetchProducto()
  }, [id])

  const fetchProducto = async () => {
    setLoading(true)
    try {
      const response = await productoService.getById(id)
      setProducto(response.data || response)
    } catch (error) {
      showToast('Producto no encontrado', 'error')
      navigate('/productos')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddToCart = () => {
    addToCart(producto)
    showToast(`${producto.nombre} agregado al carrito`)
  }

  if (loading) return <LoadingSpinner />
  if (!producto) return null

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}>
        ← Volver
      </button>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '80px' }}>📦</div>
        </div>
        
        <div style={{ flex: 1, padding: '30px' }}>
          <h1 style={{ marginBottom: '10px' }}>{producto.nombre}</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>{producto.descripcion}</p>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#666' }}>Categoría: </span>
            <span>{producto.categoria?.nombre || 'Sin categoría'}</span>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <span style={{ color: '#666' }}>Stock: </span>
            <span style={{ color: producto.stock > 0 ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
              {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
            </span>
          </div>
          
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60', marginBottom: '25px' }}>
            ${producto.precio}
          </div>

          {isAdmin ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/productos/editar/${producto.id}`} className="btn btn-warning" style={{ flex: 1, textAlign: 'center' }}>
                Editar producto
              </Link>
              <button onClick={() => navigate('/productos')} className="btn" style={{ flex: 1 }}>
                Volver
              </button>
            </div>
          ) : (
            <button className="btn btn-success" style={{ width: '100%' }} onClick={handleAddToCart} disabled={producto.stock === 0}>
              {producto.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'}
            </button>
          )}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}