import React, { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { ErrorAlert } from '../components/ErrorAlert'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validateEmail = useCallback((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }, [])

  const validatePassword = useCallback((value) => {
    return value.length >= 6
  }, [])

  const handleEmailChange = useCallback((e) => {
    const value = e.target.value
    setEmail(value)
    
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
    }
  }, [validateEmail])

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value
    setPassword(value)
    
    if (value && !validatePassword(value)) {
      setErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres' }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.password
        return newErrors
      })
    }
  }, [validatePassword])

  const formatApiError = (error) => {
    if (!error) return 'Error al iniciar sesión'
    if (typeof error === 'string') return error
    if (error.message) return error.message
    if (error.errors) return Object.values(error.errors).flat().join(', ')
    if (error.data?.message) return error.data.message
    return JSON.stringify(error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    if (!email || !validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }))
      return
    }

    if (!password || !validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres' }))
      return
    }

    setLoading(true)

    try {
      const data = await authService.login(email, password)
      
      // Guardar usuario en el contexto
      login(data.usuario, data.token)
      
      // REDIRECCIÓN SEGÚN ROL 
      const usuario = data.usuario
      const isAdmin = usuario?.rol === 3 || usuario?.rol === 'admin' || usuario?.is_admin === 1
      
      if (isAdmin) {
        navigate('/admin/dashboard')
      } else {
        navigate('/productos')
      }
    } catch (error) {
      setApiError(formatApiError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Iniciar Sesión</h1>

        <ErrorAlert error={apiError} onClose={() => setApiError(null)} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
