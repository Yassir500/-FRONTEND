import React, { createContext, useState, useEffect, useCallback } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((producto, cantidad = 1) => {
    // ✅ Validar que el producto tenga stock
    if (!producto.stock || producto.stock <= 0) {
      console.warn(`No se puede agregar "${producto.nombre}" porque no tiene stock`)
      return false
    }
    
    // ✅ Validar que la cantidad no exceda el stock
    if (cantidad > producto.stock) {
      console.warn(`No se puede agregar ${cantidad} unidades de "${producto.nombre}". Stock disponible: ${producto.stock}`)
      return false
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === producto.id)
      
      if (existingItem) {
        // Validar que la nueva cantidad no exceda el stock
        const nuevaCantidad = existingItem.cantidad + cantidad
        if (nuevaCantidad > producto.stock) {
          console.warn(`No se puede agregar. Stock máximo: ${producto.stock}`)
          return prevCart
        }
        
        return prevCart.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        )
      }
      
      return [...prevCart, { ...producto, cantidad }]
    })
    return true
  }, [])

  const removeFromCart = useCallback((productoId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productoId))
  }, [])

  const updateQuantity = useCallback((productoId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productoId)
      return
    }
    
    setCart(prevCart => {
      const producto = prevCart.find(item => item.id === productoId)
      if (producto && producto.stock && cantidad > producto.stock) {
        console.warn(`Stock máximo para "${producto.nombre}": ${producto.stock}`)
        return prevCart
      }
      
      return prevCart.map(item =>
        item.id === productoId ? { ...item, cantidad } : item
      )
    })
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.cantidad, 0)
  }, [cart])

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}