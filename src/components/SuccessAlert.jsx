import React from 'react'

export const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="alert alert-success" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
