import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { Toast } from '../../components/Toast'

export const Carrito = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('El carrito está vacío', 'error')
      return
    }
    
    // ✅ Validar que todos los productos tengan stock
    const productosSinStock = cart.filter(item => !item.stock || item.stock <= 0)
    
    if (productosSinStock.length > 0) {
      const nombresProductos = productosSinStock.map(p => p.nombre).join(', ')
      showToast(`❌ Los siguientes productos no tienen stock: ${nombresProductos}`, 'error')
      return
    }
    
    // ✅ Validar que la cantidad no supere el stock disponible
    const productosExcedenStock = cart.filter(item => item.cantidad > item.stock)
    
    if (productosExcedenStock.length > 0) {
      const nombresProductos = productosExcedenStock.map(p => `${p.nombre} (solicitaste ${p.cantidad}, stock: ${p.stock})`).join(', ')
      showToast(`❌ Cantidad excede stock disponible: ${nombresProductos}`, 'error')
      return
    }
    
    navigate('/pedidos/crear')
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>¡Explora nuestros productos y agrega algunos!</p>
        <button className="btn btn-primary" onClick={() => navigate('/productos')}>Ver productos</button>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Mi Carrito</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Lista de productos */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
            Productos ({cart.length})
          </div>
          <div>
            {cart.map(item => {
              const sinStock = !item.stock || item.stock <= 0
              const excedeStock = item.cantidad > item.stock
              
              return (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '15px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: sinStock || excedeStock ? '#fdecea' : 'white'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{item.nombre}</h4>
                    <p style={{ margin: '5px 0 0', color: '#27ae60', fontWeight: 'bold' }}>${item.precio}</p>
                    {sinStock && (
                      <p style={{ margin: '5px 0 0', color: '#e74c3c', fontSize: '12px' }}>❌ Producto agotado</p>
                    )}
                    {excedeStock && !sinStock && (
                      <p style={{ margin: '5px 0 0', color: '#e74c3c', fontSize: '12px' }}>
                        ⚠️ Stock disponible: {item.stock} unidades
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)} 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: '1px solid #ddd', 
                        background: 'white', 
                        borderRadius: '4px', 
                        cursor: sinStock ? 'not-allowed' : 'pointer',
                        opacity: sinStock ? 0.5 : 1
                      }}
                      disabled={sinStock}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.cantidad}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)} 
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: '1px solid #ddd', 
                        background: 'white', 
                        borderRadius: '4px', 
                        cursor: sinStock ? 'not-allowed' : 'pointer',
                        opacity: sinStock ? 0.5 : 1
                      }}
                      disabled={sinStock}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '18px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resumen */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Resumen</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Envío</span>
              <span style={{ color: '#27ae60' }}>Gratis</span>
            </div>
          </div>
          <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', marginBottom: '20px', textAlign: 'right' }}>
            <strong>Total:</strong> <span style={{ color: '#27ae60', fontSize: '1.25rem' }}>${getCartTotal().toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-success" 
            style={{ width: '100%' }} 
            onClick={handleCheckout}
          >
            Proceder al pago
          </button>
          <button className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}