import React, { useEffect } from 'react'

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✗'
      case 'warning': return '⚠'
      default: return 'ℹ'
    }
  }

  const getStyle = () => {
    switch (type) {
      case 'success': return { backgroundColor: '#27ae60' }
      case 'error': return { backgroundColor: '#e74c3c' }
      case 'warning': return { backgroundColor: '#f39c12' }
      default: return { backgroundColor: '#3498db' }
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      zIndex: 1100,
      animation: 'slideIn 0.3s ease-out',
      ...getStyle()
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{getIcon()}</span>
        <span>{message}</span>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          marginLeft: '10px',
          fontSize: '18px'
        }}>×</button>
      </div>
    </div>
  )
}