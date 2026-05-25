import React from 'react'

export const LoadingSpinner = ({ fullScreen = true }) => {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#666' }}>Cargando...</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}>
        {spinner}
      </div>
    )
  }

  return spinner
}