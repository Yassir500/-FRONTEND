import React from 'react'

export const Nosotros = () => {
  const valores = [
    { icon: '⭐', title: 'Calidad', desc: 'Productos de la más alta calidad' },
    { icon: '🚀', title: 'Innovación', desc: 'Siempre a la vanguardia' },
    { icon: '🤝', title: 'Confianza', desc: 'Compromiso con nuestros clientes' },
    { icon: '🌱', title: 'Sostenibilidad', desc: 'Compromiso con el medio ambiente' }
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📖 Sobre Nosotros</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
          En DSS404 TATSU, nos dedicamos a ofrecer los mejores productos con la mejor calidad y servicio.
        </p>
      </div>

      {/* Misión y Visión */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
          <h2>Misión</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
            Proporcionar productos de calidad a precios accesibles, garantizando la satisfacción de nuestros clientes.
          </p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>👁️</div>
          <h2>Visión</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
            Ser la tienda en línea líder en Latinoamérica, reconocida por nuestra excelencia en servicio.
          </p>
        </div>
      </div>

      {/* Valores */}
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Nuestros Valores</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {valores.map(valor => (
          <div key={valor.title} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>{valor.icon}</div>
            <h3>{valor.title}</h3>
            <p style={{ color: '#7f8c8d' }}>{valor.desc}</p>
          </div>
        ))}
      </div>

      {/* Equipo */}
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Nuestro Equipo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>👤</div>
            <h3>Miembro #{i}</h3>
            <p style={{ color: '#7f8c8d' }}>Cargo del equipo</p>
          </div>
        ))}
      </div>
    </div>
  )
}