import React, { useState, useEffect } from 'react'
import { categoriaService } from '../../services/categoriaService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'
import { Modal } from '../../components/Modal'

export const CategoriasList = () => {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nombre: '' })
  const [formData, setFormData] = useState({ 
    nombre_categoria: '',  // ← Cambiado de 'nombre' a 'nombre_categoria'
    color: '#3498db', 
    icono: '📁' 
  })
  const [formErrors, setFormErrors] = useState({})

  // Colores predefinidos para categorías
  const colores = [
    { nombre: 'Azul', valor: '#3498db' },
    { nombre: 'Verde', valor: '#27ae60' },
    { nombre: 'Rojo', valor: '#e74c3c' },
    { nombre: 'Naranja', valor: '#f39c12' },
    { nombre: 'Morado', valor: '#9b59b6' },
    { nombre: 'Rosa', valor: '#e84393' },
    { nombre: 'Turquesa', valor: '#1abc9c' },
    { nombre: 'Gris', valor: '#7f8c8d' }
  ]

  // Iconos predefinidos
  const iconos = ['📁', '📦', '👕', '💻', '📚', '🎮', '🏠', '🚗', '🍕', '💊', '🎵', '⚽']

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    setLoading(true)
    try {
      const response = await categoriaService.getAll()
      console.log('Categorías recibidas:', response) // Para debug
      setCategorias(response.data || response)
    } catch (error) {
      showToast(error.message || 'Error al cargar categorías', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleOpenForm = (categoria = null) => {
    if (categoria) {
      setSelectedCategoria(categoria)
      setFormData({ 
        nombre_categoria: categoria.nombre_categoria,  // ← Cambiado
        color: categoria.color || '#3498db', 
        icono: categoria.icono || '📁' 
      })
    } else {
      setSelectedCategoria(null)
      setFormData({ nombre_categoria: '', color: '#3498db', icono: '📁' })
    }
    setFormErrors({})
    setShowForm(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.nombre_categoria.trim()) errors.nombre_categoria = 'El nombre es requerido'  // ← Cambiado
    return errors
  }

  const handleSaveCategoria = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)
    try {
      // Enviar con el nombre correcto del campo
      const dataToSave = {
        nombre_categoria: formData.nombre_categoria  // ← Cambiado
      }

      if (selectedCategoria) {
        await categoriaService.update(selectedCategoria.id, dataToSave)
        showToast('Categoría actualizada', 'success')
      } else {
        await categoriaService.create(dataToSave)
        showToast('Categoría creada', 'success')
      }
      setShowForm(false)
      fetchCategorias()
    } catch (error) {
      if (error.errors) {
        setFormErrors(error.errors)
      } else {
        showToast(error.message || 'Error al guardar categoría', 'error')
      }
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await categoriaService.delete(deleteModal.id)
      showToast('Categoría eliminada', 'success')
      setDeleteModal({ show: false, id: null, nombre: '' })
      fetchCategorias()
    } catch (error) {
      showToast(error.message || 'Error al eliminar categoría', 'error')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="header-actions" style={{ marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#2c3e50' }}>📂 Categorías</h1>
          <p style={{ color: '#7f8c8d', marginTop: '5px' }}>Gestiona las categorías de tus productos</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => handleOpenForm()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <span style={{ fontSize: '18px' }}>+</span> Nueva Categoría
        </button>
      </div>

      {categorias.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: 'white', 
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📂</div>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>No hay categorías</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Comienza creando tu primera categoría</p>
          <button className="btn btn-primary" onClick={() => handleOpenForm()}>+ Crear Categoría</button>
        </div>
      ) : (
        <div className="productos-grid">
          {categorias.map(categoria => (
            <div 
              key={categoria.id} 
              className="producto-card" 
              style={{ 
                borderTop: `4px solid ${categoria.color || '#3498db'}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                padding: '8px 12px', 
                fontSize: '24px',
                opacity: 0.1
              }}>
                {categoria.icono || '📁'}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '40px', 
                  backgroundColor: `${categoria.color || '#3498db'}20`, 
                  borderRadius: '12px', 
                  padding: '10px',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {categoria.icono || '📁'}
                </div>
                <div>
                  <h3 className="producto-titulo" style={{ margin: 0, fontSize: '1.1rem' }}>
                    {categoria.nombre_categoria}  {/* ← CAMBIADO: antes era categoria.nombre */}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#95a5a6', margin: 0 }}>ID: #{categoria.id}</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px', minHeight: '50px' }}>
                {/* Aquí puedes mostrar descripción si la agregas */}
              </div>
              
              <div className="producto-actions" style={{ marginTop: '15px' }}>
                <button 
                  className="btn btn-warning btn-sm" 
                  onClick={() => handleOpenForm(categoria)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => setDeleteModal({ show: true, id: categoria.id, nombre: categoria.nombre_categoria })}  // ← CAMBIADO
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal del formulario */}
      <Modal 
        isOpen={showForm} 
        title={selectedCategoria ? '✏️ Editar Categoría' : '➕ Nueva Categoría'} 
        onConfirm={handleSaveCategoria} 
        onClose={() => setShowForm(false)} 
        confirmText={selectedCategoria ? 'Actualizar' : 'Crear'}
        isLoading={loading}
      >
        <div style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>🎨 Icono</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {iconos.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icono: icon }))}
                  style={{
                    fontSize: '24px',
                    padding: '8px',
                    width: '50px',
                    height: '50px',
                    border: formData.icono === icon ? '2px solid #3498db' : '1px solid #ddd',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>📛 Nombre *</label>
            <input 
              type="text" 
              name="nombre_categoria"  // ← CAMBIADO: antes era 'nombre'
              value={formData.nombre_categoria}  // ← CAMBIADO
              onChange={handleFormChange} 
              placeholder="Ej: Electrónica, Ropa, Hogar..."
              disabled={loading}
              style={{ fontSize: '16px' }}
            />
            {formErrors.nombre_categoria && <div className="error">{formErrors.nombre_categoria}</div>}  {/* ← CAMBIADO */}
          </div>

          <div className="form-group">
            <label>🎨 Color</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {colores.map(color => (
                <button
                  key={color.valor}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.valor }))}
                  style={{
                    backgroundColor: color.valor,
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: formData.color === color.valor ? '3px solid #2c3e50' : 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>

          {formData.color && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: `${formData.color}20`, 
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '14px',
              color: formData.color
            }}>
              Vista previa del color seleccionado
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal 
        isOpen={deleteModal.show} 
        title="🗑️ Eliminar categoría" 
        onConfirm={handleDelete} 
        onClose={() => setDeleteModal({ show: false, id: null, nombre: '' })} 
        confirmText="Eliminar"
      >
        ¿Estás seguro de eliminar la categoría <strong>"{deleteModal.nombre}"</strong>?
        <br />
        <span style={{ color: '#e74c3c', fontSize: '12px' }}>Esta acción no se puede deshacer.</span>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}