import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pedidoService } from '../../services/pedidoService'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { Toast } from '../../components/Toast'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export const PedidoForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({ 
    direccion: '', 
    telefono: '', 
    notas: '' 
  })
  const [errors, setErrors] = useState({})
  const total = getCartTotal()

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Tu carrito está vacío</h2>
        <button className="btn btn-primary" onClick={() => navigate('/productos')}>
          Ver productos
        </button>
      </div>
    )
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida'
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Preparar datos del pedido INCLUYENDO dirección y teléfono
      const pedidoData = {
        usuario_id: user?.id,
        direccion: formData.direccion,      // ← Campo agregado
        telefono: formData.telefono,        // ← Campo agregado
        notas: formData.notas,              // ← Campo agregado
        fecha_pedido: new Date().toISOString().split('T')[0],
        estado_pedido: 1,
        items: cart.map((item, index) => ({
          item_id: index + 1,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_lista: parseFloat(item.precio) || 0,
          descuento: 0
        }))
      }

      console.log('📤 Enviando pedido:', JSON.stringify(pedidoData, null, 2))

      const response = await pedidoService.create(pedidoData)
      
      console.log('✅ Pedido creado:', response)
      
      const pedidoId = response.data?.id || response.id
      
      clearCart()
      showToast('Pedido realizado con éxito')
      
      // Redirigir al detalle del pedido
      setTimeout(() => {
        navigate(`/pedidos/${pedidoId}`)
      }, 1500)
      
    } catch (error) {
      console.error('❌ Error al crear pedido:', error)
      console.error('❌ Response data:', error.response?.data)
      
      if (error.errors) {
        setErrors(error.errors)
      } else if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error')
      } else {
        showToast(error.message || 'Error al crear pedido', 'error')
      }
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Finalizar Pedido</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Formulario */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '15px', fontSize: '1.25rem' }}>Datos de envío</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Dirección *</label>
              <input 
                type="text" 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
                placeholder="Calle, número, colonia" 
                disabled={loading} 
              />
              {errors.direccion && <div className="error">{errors.direccion}</div>}
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input 
                type="tel" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                placeholder="Número de contacto" 
                disabled={loading} 
              />
              {errors.telefono && <div className="error">{errors.telefono}</div>}
            </div>

            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea 
                name="notas" 
                value={formData.notas} 
                onChange={handleChange} 
                rows="3" 
                placeholder="Instrucciones de entrega" 
                disabled={loading} 
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn" 
                onClick={() => navigate('/carrito')}
                style={{ flex: 1, backgroundColor: '#6c757d', color: 'white' }}
              >
                ← Volver al carrito
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                style={{ flex: 1 }} 
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '15px', fontSize: '1.25rem' }}>Resumen del pedido</h2>

          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '15px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px', 
                borderBottom: '1px solid #eee' 
              }}>
                <div>
                  <strong>{item.nombre}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>Cantidad: {item.cantidad}</div>
                </div>
                <strong>${(item.precio * item.cantidad).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
            <strong>Total:</strong> 
            <span style={{ color: '#27ae60', fontSize: '1.25rem', marginLeft: '10px' }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {loading && <LoadingSpinner />}
    </div>
  )
}
