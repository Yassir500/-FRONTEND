import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <div>
        <h1 style={{ fontSize: '80px', marginBottom: 0 }}>404</h1>
        <h2>Página no encontrada</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '18px' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
