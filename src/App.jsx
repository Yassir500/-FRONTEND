import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'

// Layouts
import { AdminLayout } from './layouts/AdminLayout'
import { ClientLayout } from './layouts/ClientLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Auth Pages
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NotFound } from './pages/NotFound'

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard'
import { ProductosList } from './pages/productos/ProductosList'
import { ProductoForm } from './pages/productos/ProductoForm'
import { PedidosList } from './pages/pedidos/PedidosList'
import { PedidoDetalle } from './pages/pedidos/PedidoDetalle'
import { CategoriasList } from './pages/categorias/CategoriasList'
import { UsuariosList } from './pages/usuarios/UsuariosList'
import { AdminReportes } from './pages/admin/Reportes'
import { AdminConfiguracion } from './pages/admin/Configuracion'

// Client Pages
import { Carrito } from './pages/client/Carrito'
import { MisPedidos } from './pages/client/MisPedidos'
import { PedidoForm } from './pages/pedidos/PedidoForm'
import { Nosotros } from './pages/client/Nosotros'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><AuthLayout /></PublicRoute>}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/register" element={<PublicRoute><AuthLayout /></PublicRoute>}>
              <Route index element={<Register />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="productos/crear" element={<ProductoForm />} />
              <Route path="productos/editar/:id" element={<ProductoForm />} />
              <Route path="pedidos" element={<PedidosList />} />
              <Route path="pedidos/:id" element={<PedidoDetalle />} />
              <Route path="categorias" element={<CategoriasList />} />
              <Route path="usuarios" element={<UsuariosList />} />
              <Route path="reportes" element={<AdminReportes />} />
              <Route path="configuracion" element={<AdminConfiguracion />} />
            </Route>

            {/* Client Routes */}
            <Route path="/" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/productos" />} />
              <Route path="productos" element={<ProductosList />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="mis-pedidos" element={<MisPedidos />} />
              <Route path="pedidos/crear" element={<PedidoForm />} />
              <Route path="pedidos/:id" element={<PedidoDetalle />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
