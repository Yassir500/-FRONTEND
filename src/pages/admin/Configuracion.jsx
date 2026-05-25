import React, { useState } from 'react'
import { Toast } from '../../components/Toast'

export const AdminConfiguracion = () => {
  const [toast, setToast] = useState(null)
  const [config, setConfig] = useState({
    sitioNombre: 'DSS404 TATSU',
    sitioEmail: 'info@dss404.com',
    sitioTelefono: '(55) 1234-5678',
    sitioDireccion: 'Av. Principal #123, Ciudad de México',
    envioGratisMinimo: 500,
    ivaPorcentaje: 16
  })
  const [loading, setLoading] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular guardado
    setTimeout(() => {
      showToast('Configuración guardada correctamente')
      setLoading(false)
    }, 1000)
  }

  return (
    <div>
      <h1 style={{ marginBottom: '10px' }}>⚙️ Configuración</h1>
      <p style={{ marginBottom: '30px', color: '#7f8c8d' }}>Configuración general de la tienda</p>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>🏪 Nombre del sitio</label>
            <input
              type="text"
              name="sitioNombre"
              value={config.sitioNombre}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>📧 Email de contacto</label>
            <input
              type="email"
              name="sitioEmail"
              value={config.sitioEmail}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>📞 Teléfono</label>
            <input
              type="text"
              name="sitioTelefono"
              value={config.sitioTelefono}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>📍 Dirección</label>
            <input
              type="text"
              name="sitioDireccion"
              value={config.sitioDireccion}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>🚚 Envío gratis (mínimo $)</label>
              <input
                type="number"
                name="envioGratisMinimo"
                value={config.envioGratisMinimo}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>💰 IVA (%)</label>
              <input
                type="number"
                name="ivaPorcentaje"
                value={config.ivaPorcentaje}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : '💾 Guardar cambios'}
            </button>
            <button type="button" className="btn" onClick={() => {
              setConfig({
                sitioNombre: 'DSS404 TATSU',
                sitioEmail: 'info@dss404.com',
                sitioTelefono: '(55) 1234-5678',
                sitioDireccion: 'Av. Principal #123, Ciudad de México',
                envioGratisMinimo: 500,
                ivaPorcentaje: 16
              })
            }}>
              🔄 Restablecer
            </button>
          </div>
        </form>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}