import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productoService } from '../../services/productoService'
import { categoriaService } from '../../services/categoriaService'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'
import { Modal } from '../../components/Modal'

export const ProductosList = () => {
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nombre: '' })
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const isAdmin = user?.rol === 3

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filtrarProductos()
  }, [categoriaSeleccionada, productos])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll()
      ])
      
      let productosData = []
      if (productosRes.data && Array.isArray(productosRes.data)) {
        productosData = productosRes.data
      } else if (Array.isArray(productosRes)) {
        productosData = productosRes
      } else if (productosRes.data && productosRes.data.data && Array.isArray(productosRes.data.data)) {
        productosData = productosRes.data.data
      }
      
      let categoriasData = []
      if (categoriasRes.data && Array.isArray(categoriasRes.data)) {
        categoriasData = categoriasRes.data
      } else if (Array.isArray(categoriasRes)) {
        categoriasData = categoriasRes
      } else if (categoriasRes.data && categoriasRes.data.data && Array.isArray(categoriasRes.data.data)) {
        categoriasData = categoriasRes.data.data
      }
      
      setProductos(productosData)
      setProductosFiltrados(productosData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      showToast(error.message || 'Error al cargar datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filtrarProductos = () => {
    if (categoriaSeleccionada === 'todas') {
      setProductosFiltrados(productos)
    } else {
      const filtrados = productos.filter(
        producto => producto.categoria_id === parseInt(categoriaSeleccionada)
      )
      setProductosFiltrados(filtrados)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDelete = async () => {
    try {
      await productoService.delete(deleteModal.id)
      showToast('Producto eliminado correctamente', 'success')
      fetchData()
    } catch (error) {
      showToast(error.message || 'Error al eliminar producto', 'error')
    } finally {
      setDeleteModal({ show: false, id: null, nombre: '' })
    }
  }

  // ✅ VALIDACIÓN PARA AGREGAR AL CARRITO - VERIFICA STOCK
  const handleAddToCart = (producto) => {
    // Validar que haya stock disponible
    if (!producto.stock || producto.stock <= 0) {
      showToast(`❌ ${producto.nombre_producto} no tiene stock disponible`, 'error')
      return
    }
    
    // Validar que el producto tenga un ID válido
    if (!producto.id) {
      showToast('Error: Producto inválido', 'error')
      return
    }
    
    // Agregar al carrito
    addToCart({
      id: producto.id,
      nombre: producto.nombre_producto,
      precio: producto.precio_lista,
      stock: producto.stock
    })
    showToast(`✅ ${producto.nombre_producto} agregado al carrito`, 'success')
  }

  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId)
    return categoria?.nombre_categoria || 'Sin categoría'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(price)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="header-actions">
        <div>
          <h1>🛒 Productos</h1>
          <p>Explora nuestra colección de productos</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/admin/productos/crear')}>
            ➕ Nuevo Producto
          </button>
        )}
      </div>

      {/* Filtro por categorías */}
      {categorias.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#2c3e50' }}>📂 Filtrar por categoría</h3>
              <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#95a5a6' }}>
                {productosFiltrados.length} producto(s) encontrado(s)
              </p>
            </div>
            
            {categoriaSeleccionada !== 'todas' && (
              <button 
                onClick={() => setCategoriaSeleccionada('todas')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e74c3c',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                ✕ Limpiar filtro
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => setCategoriaSeleccionada('todas')}
              style={{
                padding: '8px 20px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                background: categoriaSeleccionada === 'todas' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : '#f1f3f5',
                color: categoriaSeleccionada === 'todas' ? 'white' : '#2c3e50'
              }}
            >
              📌 Todas las categorías
            </button>

            {categorias.map(categoria => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaSeleccionada(categoria.id.toString())}
                style={{
                  padding: '8px 20px',
                  borderRadius: '30px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  background: categoriaSeleccionada === categoria.id.toString() 
                    ? '#3498db'
                    : '#f1f3f5',
                  color: categoriaSeleccionada === categoria.id.toString() ? 'white' : '#2c3e50'
                }}
              >
                📁 {categoria.nombre_categoria}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {productosFiltrados.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: 'white', 
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>No hay productos</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
            No se encontraron productos en esta categoría
          </p>
          {categoriaSeleccionada !== 'todas' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setCategoriaSeleccionada('todas')}
            >
              Ver todos los productos
            </button>
          )}
        </div>
      ) : (
        <div className="productos-grid">
          {productosFiltrados.map(producto => {
            const tieneStock = producto.stock > 0
            return (
              <div 
                key={producto.id} 
                className="producto-card"
                style={{
                  borderTop: '4px solid #3498db',
                  opacity: tieneStock ? 1 : 0.7
                }}
              >
                {/* Badge de categoría */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#f0f0f0',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span>📁</span>
                  <span>{getCategoriaNombre(producto.categoria_id)}</span>
                </div>

                {/* Badge de "Sin stock" */}
                {!tieneStock && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    ❌ Sin stock
                  </div>
                )}

                {/* Imagen o icono */}
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img 
                      src={producto.imagenes[0]} 
                      alt={producto.nombre_producto}
                      style={{ maxWidth: '100%', height: 'auto', maxHeight: '120px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ fontSize: '48px' }}>📦</div>
                  )}
                </div>

                {/* Información del producto */}
                <h3 className="producto-titulo" style={{ marginBottom: '5px' }}>
                  {producto.nombre_producto}
                </h3>
                
                <p className="producto-precio" style={{ margin: '10px 0' }}>
                  {formatPrice(producto.precio_lista)}
                </p>
                
                <p className="producto-stock" style={{ 
                  marginBottom: '15px',
                  color: tieneStock ? '#27ae60' : '#e74c3c',
                  fontWeight: 'bold'
                }}>
                  {tieneStock ? `📊 Stock: ${producto.stock} unidades` : '❌ Producto agotado'}
                </p>
                
                {/* Botones de acción */}
                {isAdmin ? (
                  <div className="producto-actions">
                    <button 
                      className="btn btn-warning btn-sm" 
                      onClick={() => navigate(`/admin/productos/editar/${producto.id}`)}
                      style={{ flex: 1 }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => setDeleteModal({ 
                        show: true, 
                        id: producto.id, 
                        nombre: producto.nombre_producto 
                      })}
                      style={{ flex: 1 }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ) : (
                  <button 
                    className={`btn ${tieneStock ? 'btn-success' : 'btn-secondary'}`}
                    style={{ width: '100%', marginTop: '15px' }} 
                    onClick={() => handleAddToCart(producto)} 
                    disabled={!tieneStock}
                  >
                    {tieneStock ? '🛒 Agregar al carrito' : '❌ Sin stock disponible'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de eliminación */}
      <Modal 
        isOpen={deleteModal.show} 
        title="🗑️ Confirmar eliminación" 
        onConfirm={handleDelete} 
        onClose={() => setDeleteModal({ show: false, id: null, nombre: '' })}
      >
        ¿Estás seguro de eliminar el producto <strong>"{deleteModal.nombre}"</strong>?
        <br />
        <span style={{ color: '#e74c3c', fontSize: '12px' }}>Esta acción no se puede deshacer.</span>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}