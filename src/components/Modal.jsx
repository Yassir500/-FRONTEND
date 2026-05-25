import React, { useEffect } from 'react'

export const Modal = ({ isOpen, title, children, onConfirm, onClose, isLoading = false, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

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
      zIndex: 1500
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h3>
        <div style={{ marginBottom: '24px', color: '#666' }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
            className="btn"
            style={{ backgroundColor: '#6c757d', color: 'white' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn btn-danger"
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}