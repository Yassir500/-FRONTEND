import React, { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { ErrorAlert } from '../components/ErrorAlert'
import { SuccessAlert } from '../components/SuccessAlert'

export const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    password_confirmation: '',
    telefono: '',
    calle: '',
    ciudad: '',
    estado_dir: '',
    codigo_postal: ''
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Validaciones
  const validateEmail = useCallback((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }, [])

  const validatePassword = useCallback((value) => {
    return value.length >= 8
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Mínimo 8 caracteres'
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden'
    }

    return newErrors
  }, [formData, validateEmail, validatePassword])

  // Manejar cambios
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)
    setSuccessMessage(null)

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const data = await authService.register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        telefono: formData.telefono,
        calle: formData.calle,
        ciudad: formData.ciudad,
        estado_dir: formData.estado_dir,
        codigo_postal: formData.codigo_postal
      })

      setSuccessMessage('¡Registro exitoso! Redirigiendo...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors)
      } else {
        setApiError(error.message || 'Error al registrarse')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '50px', marginBottom: '50px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Crear Cuenta</h1>

        <ErrorAlert error={apiError} onClose={() => setApiError(null)} />
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage(null)} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={loading}
            />
            {errors.nombre && <div className="error">{errors.nombre}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Tu apellido"
              disabled={loading}
            />
            {errors.apellido && <div className="error">{errors.apellido}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Tu teléfono"
              disabled={loading}
            />
            {errors.telefono && <div className="error">{errors.telefono}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="calle">Calle</label>
            <input
              type="text"
              id="calle"
              name="calle"
              value={formData.calle}
              onChange={handleChange}
              placeholder="Calle y número"
              disabled={loading}
            />
            {errors.calle && <div className="error">{errors.calle}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="Ciudad"
              disabled={loading}
            />
            {errors.ciudad && <div className="error">{errors.ciudad}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="estado_dir">Estado / Departamento</label>
            <input
              type="text"
              id="estado_dir"
              name="estado_dir"
              value={formData.estado_dir}
              onChange={handleChange}
              placeholder="Estado o departamento"
              disabled={loading}
            />
            {errors.estado_dir && <div className="error">{errors.estado_dir}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="codigo_postal">Código Postal</label>
            <input
              type="text"
              id="codigo_postal"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleChange}
              placeholder="Código postal"
              disabled={loading}
            />
            {errors.codigo_postal && <div className="error">{errors.codigo_postal}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmar Contraseña</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              disabled={loading}
            />
            {errors.password_confirmation && <div className="error">{errors.password_confirmation}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}
