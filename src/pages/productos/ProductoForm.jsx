import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productoService } from '../../services/productoService'
import { categoriaService } from '../../services/categoriaService'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'

export const ProductoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = !!id
  const isAdmin = user?.rol === 3
  
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [imagenesPreview, setImagenesPreview] = useState([])
  const [formData, setFormData] = useState({
    nombre_producto: '',
    precio_lista: '',
    categoria_id: '',
    marca_id: '',
    modelo_anio: '',
    stock: '',
    imagenes: []
  })
  const [errors, setErrors] = useState({})

  const currentYear = new Date().getFullYear()
  const minYear = 1900
  const maxYear = currentYear + 1

  useEffect(() => {
    fetchCategorias()
    if (isEditing) {
      fetchProducto()
    }
  }, [id])

  const getRedirectPath = () => {
    return isAdmin ? '/admin/productos' : '/productos'
  }

  const fetchCategorias = async () => {
    try {
      const response = await categoriaService.getAll()
      let categoriasData = []
      if (response.data && Array.isArray(response.data)) {
        categoriasData = response.data
      } else if (Array.isArray(response)) {
        categoriasData = response
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        categoriasData = response.data.data
      }
      setCategorias(categoriasData)
    } catch (error) {
      showToast('Error al cargar categorías', 'error')
    }
  }

  const fetchProducto = async () => {
    setLoading(true)
    try {
      const response = await productoService.getById(id)
      const producto = response.data || response
      setFormData({
        nombre_producto: producto.nombre_producto || '',
        precio_lista: producto.precio_lista || '',
        categoria_id: producto.categoria_id || '',
        marca_id: producto.marca_id || '',
        modelo_anio: producto.modelo_anio || '',
        stock: producto.stock || '',
        imagenes: []
      })
      if (producto.imagenes && producto.imagenes.length > 0) {
        setImagenesPreview(producto.imagenes)
      }
    } catch (error) {
      showToast('Error al cargar producto', 'error')
      navigate(getRedirectPath())
    } finally {
      setLoading(false)
    }
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    if (formData.imagenes.length + files.length > 5) {
      showToast('Máximo 5 imágenes por producto', 'error')
      return
    }
    
    const validFiles = []
    for (const file of files) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        showToast(`Formato no soportado: ${file.name}. Use JPG, PNG o WEBP`, 'error')
        continue
      }
      
      if (file.size > 2 * 1024 * 1024) {
        showToast(`La imagen ${file.name} excede los 2MB`, 'error')
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...validFiles] }))
      
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagenesPreview(prev => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }))
    setImagenesPreview(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nombre_producto?.trim()) {
      newErrors.nombre_producto = 'El nombre del producto es requerido'
    } else if (formData.nombre_producto.length > 255) {
      newErrors.nombre_producto = 'El nombre no puede exceder 255 caracteres'
    }
    
    if (!formData.precio_lista) {
      newErrors.precio_lista = 'El precio es requerido'
    } else if (parseFloat(formData.precio_lista) < 0) {
      newErrors.precio_lista = 'El precio no puede ser negativo'
    } else if (parseFloat(formData.precio_lista) > 99999999.99) {
      newErrors.precio_lista = 'El precio es demasiado alto'
    }
    
    if (formData.marca_id && parseInt(formData.marca_id) < 1) {
      newErrors.marca_id = 'El ID de marca debe ser mayor a 0'
    }
    
    if (formData.modelo_anio) {
      const anio = parseInt(formData.modelo_anio)
      if (isNaN(anio) || anio < minYear || anio > maxYear) {
        newErrors.modelo_anio = `El año debe estar entre ${minYear} y ${maxYear}`
      }
    }
    
    if (!formData.stock && formData.stock !== 0) {
      newErrors.stock = 'El stock es requerido'
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo'
    }
    
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
      const dataToSend = new FormData()
      
      // Campos obligatorios
      dataToSend.append('nombre_producto', formData.nombre_producto.trim())
      dataToSend.append('precio_lista', parseFloat(formData.precio_lista))
      dataToSend.append('stock', parseInt(formData.stock))
      
      // Campos opcionales
      if (formData.categoria_id && formData.categoria_id !== '') {
        dataToSend.append('categoria_id', parseInt(formData.categoria_id))
      }
      if (formData.marca_id && formData.marca_id !== '') {
        dataToSend.append('marca_id', parseInt(formData.marca_id))
      }
      if (formData.modelo_anio && formData.modelo_anio !== '') {
        dataToSend.append('modelo_anio', parseInt(formData.modelo_anio))
      }
      
      // Imágenes
      if (formData.imagenes && formData.imagenes.length > 0) {
        formData.imagenes.forEach(imagen => {
          dataToSend.append('imagenes[]', imagen)
        })
      }

      console.log('📤 Enviando producto al backend:')
      for (let pair of dataToSend.entries()) {
        if (pair[0] === 'imagenes[]') {
          console.log(pair[0] + ': Archivo - ' + pair[1].name)
        } else {
          console.log(pair[0] + ': ' + pair[1])
        }
      }

      if (isEditing) {
        await productoService.update(id, dataToSend)
        showToast('Producto actualizado correctamente')
      } else {
        await productoService.create(dataToSend)
        showToast('Producto creado correctamente')
      }
      setTimeout(() => navigate(getRedirectPath()), 1500)
    } catch (error) {
      console.error('❌ Error al guardar:', error)
      if (error.errors) {
        setErrors(error.errors)
      } else if (error.message) {
        showToast(error.message, 'error')
      } else {
        showToast('Error al guardar producto', 'error')
      }
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(getRedirectPath())
  }

  if (loading && isEditing) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>
          {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h1>
        <p style={{ marginBottom: '25px', color: '#7f8c8d', fontSize: '0.9rem' }}>
          Complete la información del producto
        </p>

        <form onSubmit={handleSubmit}>
          {/* Nombre del producto */}
          <div className="form-group">
            <label>Nombre del producto *</label>
            <input 
              type="text" 
              name="nombre_producto" 
              value={formData.nombre_producto} 
              onChange={handleChange} 
              disabled={loading}
              placeholder="Ej: Bicicleta Montana Pro"
              maxLength="255"
            />
            {errors.nombre_producto && <div className="error">{errors.nombre_producto}</div>}
            <small style={{ color: '#7f8c8d' }}>Máximo 255 caracteres</small>
          </div>

          {/* Precio */}
          <div className="form-group">
            <label>Precio *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '1.2rem', color: '#666' }}>$</span>
              <input 
                type="number" 
                name="precio_lista" 
                value={formData.precio_lista} 
                onChange={handleChange} 
                step="0.01" 
                min="0" 
                max="99999999.99"
                disabled={loading}
                placeholder="0.00"
                style={{ flex: 1 }}
              />
            </div>
            {errors.precio_lista && <div className="error">{errors.precio_lista}</div>}
            <small style={{ color: '#7f8c8d' }}>Precio en pesos mexicanos (MXN)</small>
          </div>

          {/* Stock */}
          <div className="form-group">
            <label>Stock *</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
              min="0" 
              disabled={loading}
              placeholder="0"
            />
            {errors.stock && <div className="error">{errors.stock}</div>}
            <small style={{ color: '#7f8c8d' }}>Cantidad de productos disponibles en inventario</small>
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label>Categoría</label>
            <select 
              name="categoria_id" 
              value={formData.categoria_id} 
              onChange={handleChange} 
              disabled={loading}
            >
              <option value="">Seleccionar categoría (opcional)</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre_categoria || cat.nombre}
                </option>
              ))}
            </select>
            <small style={{ color: '#7f8c8d' }}>Si no selecciona, quedará sin categoría</small>
          </div>

          {/* ID de Marca */}
          <div className="form-group">
            <label>ID de Marca</label>
            <input 
              type="number" 
              name="marca_id" 
              value={formData.marca_id} 
              onChange={handleChange} 
              min="1" 
              disabled={loading}
              placeholder="Ej: 1, 2, 3..."
            />
            {errors.marca_id && <div className="error">{errors.marca_id}</div>}
            <small style={{ color: '#7f8c8d' }}>Identificador numérico de la marca (opcional)</small>
          </div>

          {/* Año del modelo */}
          <div className="form-group">
            <label>Año del modelo</label>
            <input 
              type="number" 
              name="modelo_anio" 
              value={formData.modelo_anio} 
              onChange={handleChange} 
              min={minYear} 
              max={maxYear}
              disabled={loading}
              placeholder={`Ej: ${currentYear}`}
            />
            {errors.modelo_anio && <div className="error">{errors.modelo_anio}</div>}
            <small style={{ color: '#7f8c8d' }}>Año de fabricación o modelo (opcional) - entre {minYear} y {maxYear}</small>
          </div>

          {/* Imágenes */}
          <div className="form-group">
            <label>Imágenes del producto</label>
            <input 
              type="file" 
              name="imagenes" 
              onChange={handleImageChange} 
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={loading}
              style={{ padding: '10px 0' }}
            />
            <small style={{ color: '#7f8c8d', display: 'block', marginTop: '5px' }}>
              📷 Puedes seleccionar hasta 5 imágenes (JPEG, PNG, WEBP, máx 2MB cada una)
            </small>
            {errors.imagenes && <div className="error">{errors.imagenes}</div>}
          </div>

          {/* Previsualización de imágenes */}
          {imagenesPreview.length > 0 && (
            <div className="form-group">
              <label>Previsualización ({imagenesPreview.length}/5)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {imagenesPreview.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ flex: 1, padding: '12px' }}
            >
              {loading ? 'Guardando...' : (isEditing ? '💾 Actualizar Producto' : '✅ Crear Producto')}
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={handleCancel}
              style={{ flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white' }}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}