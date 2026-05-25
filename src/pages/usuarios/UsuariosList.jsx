import React, { useState, useEffect } from 'react'
import { usuarioService } from '../../services/usuarioService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Toast } from '../../components/Toast'
import { Modal } from '../../components/Modal'
import Pagination from '../../components/Pagination'

export const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nombre: null })
  const [restoreModal, setRestoreModal] = useState({ show: false, id: null, nombre: null })
  
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [adminFormData, setAdminFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    password_confirmation: '',
    telefono: '',
    calle: '',
    ciudad: '',
    estado_dir: '',
    codigo_postal: ''
  })
  const [adminFormErrors, setAdminFormErrors] = useState({})
  const [savingAdmin, setSavingAdmin] = useState(false)
  
  const [editModal, setEditModal] = useState({ show: false, id: null, user: null })
  const [editFormData, setEditFormData] = useState({})
  const [editErrors, setEditErrors] = useState({})
  
  const [disableModal, setDisableModal] = useState({ show: false, id: null, nombre: null, estado: null })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage] = useState(15)

  useEffect(() => {
    fetchUsuarios()
  }, [currentPage])

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const filters = { page: currentPage, per_page: perPage }
      const response = await usuarioService.getAll(filters)
      
      let usuariosData = []
      let meta = {}
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        usuariosData = response.data.data
        meta = response.data.meta || {}
      } else if (response.data && Array.isArray(response.data)) {
        usuariosData = response.data
        meta = response.meta || {}
      } else if (Array.isArray(response)) {
        usuariosData = response
      }
      
      setUsuarios(usuariosData)
      setCurrentPage(meta.current_page || currentPage)
      setLastPage(meta.last_page || 1)
      setTotal(meta.total || usuariosData.length)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      showToast(error.message || 'Error al cargar usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target
    setAdminFormData(prev => ({ ...prev, [name]: value }))
    if (adminFormErrors[name]) {
      setAdminFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateAdminForm = () => {
    const errors = {}
    if (!adminFormData.nombre.trim()) errors.nombre = 'El nombre es requerido'
    if (!adminFormData.apellido.trim()) errors.apellido = 'El apellido es requerido'
    if (!adminFormData.email.trim()) errors.email = 'El email es requerido'
    if (!adminFormData.password) errors.password = 'La contraseña es requerida'
    if (adminFormData.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres'
    if (adminFormData.password !== adminFormData.password_confirmation) {
      errors.password_confirmation = 'Las contraseñas no coinciden'
    }
    return errors
  }

  const handleRegisterAdmin = async () => {
    const errors = validateAdminForm()
    if (Object.keys(errors).length > 0) {
      setAdminFormErrors(errors)
      return
    }

    setSavingAdmin(true)
    try {
      await usuarioService.create({
        nombre: adminFormData.nombre,
        apellido: adminFormData.apellido,
        email: adminFormData.email,
        password: adminFormData.password,
        password_confirmation: adminFormData.password_confirmation,
        rol: 3,
        estado: 1,
        telefono: adminFormData.telefono || '',
        calle: adminFormData.calle || '',
        ciudad: adminFormData.ciudad || '',
        estado_dir: adminFormData.estado_dir || '',
        codigo_postal: adminFormData.codigo_postal || ''
      })
      
      showToast('Administrador registrado exitosamente', 'success')
      setShowAdminForm(false)
      setAdminFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        password_confirmation: '',
        telefono: '',
        calle: '',
        ciudad: '',
        estado_dir: '',
        codigo_postal: ''
      })
      fetchUsuarios()
    } catch (error) {
      if (error.errors) {
        setAdminFormErrors(error.errors)
      } else {
        showToast(error.message || 'Error al registrar administrador', 'error')
      }
    } finally {
      setSavingAdmin(false)
    }
  }

  const openEditModal = (usuario) => {
    setEditModal({ show: true, id: usuario.id, user: usuario })
    setEditFormData({
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      telefono: usuario.telefono || '',
      calle: usuario.calle || '',
      ciudad: usuario.ciudad || '',
      estado_dir: usuario.estado_dir || '',
      codigo_postal: usuario.codigo_postal || ''
    })
    setEditErrors({})
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
    if (editErrors[name]) {
      setEditErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleEditSubmit = async () => {
    try {
      await usuarioService.update(editModal.id, editFormData)
      showToast('Usuario actualizado correctamente', 'success')
      setEditModal({ show: false, id: null, user: null })
      fetchUsuarios()
    } catch (error) {
      if (error.errors) {
        setEditErrors(error.errors)
      } else {
        showToast(error.message || 'Error al actualizar usuario', 'error')
      }
    }
  }

  const toggleUserStatus = async () => {
    try {
      const nuevoEstado = disableModal.estado === 1 ? 0 : 1
      await usuarioService.update(disableModal.id, { estado: nuevoEstado })
      showToast(nuevoEstado === 1 ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente', 'success')
      setDisableModal({ show: false, id: null, nombre: null, estado: null })
      fetchUsuarios()
    } catch (error) {
      showToast(error.message || 'Error al cambiar estado del usuario', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await usuarioService.delete(deleteModal.id)
      showToast('Usuario eliminado correctamente', 'success')
      setDeleteModal({ show: false, id: null, nombre: null })
      fetchUsuarios()
    } catch (error) {
      showToast(error.message || 'Error al eliminar usuario', 'error')
    }
  }

  const handleRestore = async () => {
    try {
      await usuarioService.restore(restoreModal.id)
      showToast('Usuario restaurado correctamente', 'success')
      setRestoreModal({ show: false, id: null, nombre: null })
      fetchUsuarios()
    } catch (error) {
      showToast(error.message || 'Error al restaurar usuario', 'error')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page)
    }
  }

  const getRolInfo = (rol) => {
    switch(rol) {
      case 3: return { bg: '#fdecea', color: '#e74c3c', text: '👑 Administrador' }
      case 2: return { bg: '#e8f4f8', color: '#3498db', text: '👥 Personal' }
      default: return { bg: '#e8f8f5', color: '#27ae60', text: '👤 Cliente' }
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 style={{ margin: 0 }}>👥 Usuarios</h1>
          <p style={{ color: '#7f8c8d', marginTop: '5px' }}>
            Mostrando {usuarios.length} de {total} usuario(s) - Página {currentPage} de {lastPage}
          </p>
        </div>
        <button
          onClick={() => setShowAdminForm(true)}
          className="btn btn-danger"
          style={{ backgroundColor: '#e74c3c' }}
        >
          👑 + Registrar Administrador
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: 'white', 
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>👥</div>
          <h2 style={{ color: '#2c3e50' }}>No hay usuarios registrados</h2>
          <p style={{ color: '#7f8c8d' }}>Los usuarios aparecerán aquí cuando se registren</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => {
                  const rolInfo = getRolInfo(usuario.rol)
                  const isSuperAdmin = usuario.email === 'admin@tienda.com'
                  const isDeleted = usuario.deleted_at !== null
                  const isAdmin = usuario.rol === 3
                  const isClient = usuario.rol === 1
                  
                  return (
                    <tr key={usuario.id} style={{ opacity: isDeleted ? 0.6 : 1 }}>
                      <td>#{usuario.id}</td>
                      <td style={{ minWidth: '180px' }}>
                        <strong>{usuario.nombre} {usuario.apellido}</strong>
                        {isDeleted && (
                          <div style={{ fontSize: '11px', color: '#e74c3c', marginTop: '2px' }}>
                            🗑️ Eliminado
                          </div>
                        )}
                      </td>
                      <td>{usuario.email}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          backgroundColor: rolInfo.bg,
                          color: rolInfo.color,
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          {rolInfo.text}
                          {isSuperAdmin && <span style={{ marginLeft: '4px' }}>🔒</span>}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: usuario.estado === 1 ? '#e8f8f5' : '#fdecea',
                          color: usuario.estado === 1 ? '#27ae60' : '#e74c3c',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          {usuario.estado === 1 ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                      </td>
                      <td>
                        {isDeleted ? (
                          <button
                            onClick={() => setRestoreModal({ 
                              show: true, 
                              id: usuario.id, 
                              nombre: `${usuario.nombre} ${usuario.apellido}` 
                            })}
                            className="btn btn-success btn-sm"
                            style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            ↩️ Restaurar
                          </button>
                        ) : (
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {isAdmin && !isSuperAdmin && (
                              <>
                                <button
                                  onClick={() => openEditModal(usuario)}
                                  className="btn btn-warning btn-sm"
                                  style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  onClick={() => setDisableModal({ 
                                    show: true, 
                                    id: usuario.id, 
                                    nombre: `${usuario.nombre} ${usuario.apellido}`,
                                    estado: usuario.estado
                                  })}
                                  className="btn btn-info btn-sm"
                                  style={{ backgroundColor: usuario.estado === 1 ? '#e74c3c' : '#27ae60', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                  {usuario.estado === 1 ? '🔴 Desactivar' : '🟢 Activar'}
                                </button>
                              </>
                            )}
                            {isClient && !isSuperAdmin && (
                              <span style={{ fontSize: '12px', color: '#95a5a6', padding: '5px 10px' }}>
                                📋 Solo lectura
                              </span>
                            )}
                            {isSuperAdmin && (
                              <span style={{ fontSize: '12px', color: '#95a5a6', padding: '5px 10px' }}>
                                🔒 Super Admin
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modal para registrar administrador */}
      <Modal
        isOpen={showAdminForm}
        title="👑 Registrar Nuevo Administrador"
        onClose={() => {
          setShowAdminForm(false)
          setAdminFormErrors({})
          setAdminFormData({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            password_confirmation: '',
            telefono: '',
            calle: '',
            ciudad: '',
            estado_dir: '',
            codigo_postal: ''
          })
        }}
        onConfirm={handleRegisterAdmin}
        confirmText="Registrar Administrador"
        isLoading={savingAdmin}
      >
        <div>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={adminFormData.nombre}
              onChange={handleAdminFormChange}
              placeholder="Nombre del administrador"
              disabled={savingAdmin}
            />
            {adminFormErrors.nombre && <div className="error">{adminFormErrors.nombre}</div>}
          </div>

          <div className="form-group">
            <label>Apellido *</label>
            <input
              type="text"
              name="apellido"
              value={adminFormData.apellido}
              onChange={handleAdminFormChange}
              placeholder="Apellido del administrador"
              disabled={savingAdmin}
            />
            {adminFormErrors.apellido && <div className="error">{adminFormErrors.apellido}</div>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={adminFormData.email}
              onChange={handleAdminFormChange}
              placeholder="admin@ejemplo.com"
              disabled={savingAdmin}
            />
            {adminFormErrors.email && <div className="error">{adminFormErrors.email}</div>}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={adminFormData.telefono}
              onChange={handleAdminFormChange}
              placeholder="Teléfono de contacto"
              disabled={savingAdmin}
            />
          </div>

          <div className="form-group">
            <label>Dirección (Calle)</label>
            <input
              type="text"
              name="calle"
              value={adminFormData.calle}
              onChange={handleAdminFormChange}
              placeholder="Calle y número"
              disabled={savingAdmin}
            />
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={adminFormData.ciudad}
              onChange={handleAdminFormChange}
              placeholder="Ciudad"
              disabled={savingAdmin}
            />
          </div>

          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              name="codigo_postal"
              value={adminFormData.codigo_postal}
              onChange={handleAdminFormChange}
              placeholder="Código postal"
              disabled={savingAdmin}
            />
          </div>

          <div className="form-group">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              value={adminFormData.password}
              onChange={handleAdminFormChange}
              placeholder="Mínimo 6 caracteres"
              disabled={savingAdmin}
            />
            {adminFormErrors.password && <div className="error">{adminFormErrors.password}</div>}
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña *</label>
            <input
              type="password"
              name="password_confirmation"
              value={adminFormData.password_confirmation}
              onChange={handleAdminFormChange}
              placeholder="Confirmar contraseña"
              disabled={savingAdmin}
            />
            {adminFormErrors.password_confirmation && <div className="error">{adminFormErrors.password_confirmation}</div>}
          </div>

          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#fdecea', 
            borderRadius: '8px',
            fontSize: '12px',
            color: '#e74c3c'
          }}>
            ⚠️ El usuario será creado con rol de Administrador (acceso total al sistema)
          </div>
        </div>
      </Modal>

      {/* Modal para editar usuario */}
      <Modal
        isOpen={editModal.show}
        title="✏️ Editar Administrador"
        onConfirm={handleEditSubmit}
        onClose={() => setEditModal({ show: false, id: null, user: null })}
        confirmText="Guardar Cambios"
      >
        <div>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={editFormData.nombre || ''}
              onChange={handleEditChange}
            />
            {editErrors.nombre && <div className="error">{editErrors.nombre}</div>}
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={editFormData.apellido || ''}
              onChange={handleEditChange}
            />
            {editErrors.apellido && <div className="error">{editErrors.apellido}</div>}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={editFormData.telefono || ''}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label>Dirección (Calle)</label>
            <input
              type="text"
              name="calle"
              value={editFormData.calle || ''}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={editFormData.ciudad || ''}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              name="codigo_postal"
              value={editFormData.codigo_postal || ''}
              onChange={handleEditChange}
            />
          </div>
        </div>
      </Modal>

      {/* Modal para desactivar/activar usuario */}
      <Modal
        isOpen={disableModal.show}
        title={disableModal.estado === 1 ? "🔴 Desactivar Usuario" : "🟢 Activar Usuario"}
        onConfirm={toggleUserStatus}
        onClose={() => setDisableModal({ show: false, id: null, nombre: null, estado: null })}
        confirmText={disableModal.estado === 1 ? "Desactivar" : "Activar"}
      >
        ¿Estás seguro de {disableModal.estado === 1 ? 'desactivar' : 'activar'} al usuario <strong>"{disableModal.nombre}"</strong>?
        <br />
        <span style={{ color: disableModal.estado === 1 ? '#e74c3c' : '#27ae60', fontSize: '12px' }}>
          {disableModal.estado === 1 
            ? 'El usuario no podrá iniciar sesión hasta que sea activado nuevamente.' 
            : 'El usuario volverá a tener acceso al sistema.'}
        </span>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal 
        isOpen={deleteModal.show} 
        title="🗑️ Eliminar usuario permanentemente" 
        onConfirm={handleDelete} 
        onClose={() => setDeleteModal({ show: false, id: null, nombre: null })} 
        confirmText="Eliminar"
      >
        ¿Estás seguro de eliminar permanentemente al usuario <strong>"{deleteModal.nombre}"</strong>?
        <br />
        <span style={{ color: '#e74c3c', fontSize: '12px' }}>
          Esta acción no se puede deshacer.
        </span>
      </Modal>

      {/* Modal de confirmación de restauración */}
      <Modal 
        isOpen={restoreModal.show} 
        title="↩️ Restaurar usuario" 
        onConfirm={handleRestore} 
        onClose={() => setRestoreModal({ show: false, id: null, nombre: null })} 
        confirmText="Restaurar"
      >
        ¿Estás seguro de restaurar al usuario <strong>"{restoreModal.nombre}"</strong>?
        <br />
        <span style={{ color: '#27ae60', fontSize: '12px' }}>
          El usuario volverá a tener acceso al sistema.
        </span>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}