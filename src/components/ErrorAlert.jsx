import React from 'react'

export const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null

  let message = ''
  
  if (typeof error === 'string') {
    message = error
  } else if (error.message) {
    message = error.message
  } else if (error.errors) {
    message = Object.values(error.errors).flat().join(', ')
  } else if (error.data?.message) {
    message = error.data.message
  } else if (typeof error === 'object') {
    message = JSON.stringify(error)
  }

  return (
    <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
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
