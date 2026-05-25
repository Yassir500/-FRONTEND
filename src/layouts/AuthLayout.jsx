import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        margin: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '48px' }}>🏪</div>
          <h1 style={{ color: 'white', margin: '10px 0 0' }}>DSS404 TATSU</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Tu tienda en línea</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}