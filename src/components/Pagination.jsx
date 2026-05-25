import React from 'react'

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(lastPage, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (lastPage <= 1) return null

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '30px',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 14px',
          backgroundColor: currentPage === 1 ? '#e9ecef' : '#3498db',
          color: currentPage === 1 ? '#adb5bd' : 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '14px'
        }}
      >
        ← Anterior
      </button>

      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{
              padding: '8px 14px',
              backgroundColor: '#f1f3f5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && <span style={{ padding: '0 4px' }}>...</span>}
        </>
      )}

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 14px',
            backgroundColor: currentPage === page ? '#2c3e50' : '#f1f3f5',
            color: currentPage === page ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: currentPage === page ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}
        >
          {page}
        </button>
      ))}

      {getPageNumbers()[getPageNumbers().length - 1] < lastPage && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < lastPage - 1 && (
            <span style={{ padding: '0 4px' }}>...</span>
          )}
          <button
            onClick={() => onPageChange(lastPage)}
            style={{
              padding: '8px 14px',
              backgroundColor: '#f1f3f5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {lastPage}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        style={{
          padding: '8px 14px',
          backgroundColor: currentPage === lastPage ? '#e9ecef' : '#3498db',
          color: currentPage === lastPage ? '#adb5bd' : 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: currentPage === lastPage ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '14px'
        }}
      >
        Siguiente →
      </button>
    </div>
  )
}

export default Pagination