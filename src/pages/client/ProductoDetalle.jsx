import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productoService } from '../../services/productoService'
import { useCart } from '../../hooks/useCart'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'

export const ProductoDetalleCliente = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducto()
  }, [id])

  const fetchProducto = async () => {
    setLoading(true)
    try {
      const response = await productoService.getById(id)
      setProducto(response.data || response)
    } catch (error) {
      navigate('/productos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(producto, cantidad)
    setToast({ message: `${cantidad}x ${producto.nombre} agregado al carrito`, type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) return <LoadingSpinner />
  if (!producto) return null

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#3498db', cursor: 'pointer' }}>
        ← Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: 'white', borderRadius: '16px', padding: '24px' }}>
        {/* Imagen */}
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
          <div style={{ fontSize: '100px' }}>📦</div>
        </div>

        {/* Detalles */}
        <div>
          <h1 style={{ marginBottom: '15px' }}>{producto.nombre}</h1>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6', marginBottom: '20px' }}>{producto.descripcion}</p>
          
          <div style={{ marginBottom: '20px' }}>
            <span style={{ color: '#7f8c8d' }}>Categoría: </span>
            <strong>{producto.categoria?.nombre || 'Sin categoría'}</strong>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span style={{ color: '#7f8c8d' }}>Stock disponible: </span>
            <strong style={{ color: producto.stock > 0 ? '#27ae60' : '#e74c3c' }}>
              {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
            </strong>
          </div>

          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60', marginBottom: '20px' }}>
            ${producto.precio}
          </div>

          {producto.stock > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <span>Cantidad:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    style={{ width: '35px', height: '35px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ minWidth: '40px', textAlign: 'center' }}>{cantidad}</span>
                  <button
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                    style={{ width: '35px', height: '35px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>

              <button className="btn btn-success" style={{ width: '100%' }} onClick={handleAddToCart}>
                🛒 Agregar al carrito
              </button>
            </>
          )}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}