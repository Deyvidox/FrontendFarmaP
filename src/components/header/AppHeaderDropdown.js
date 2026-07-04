import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CBadge
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { clearToken, getUserProfile, updateUserProfile } from '../../services/api'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [profileModal, setProfileModal] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })

  const defaultUser = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    identification_number: '',
    date_of_birth: '',
    phone: '',
    address: '',
    avatar: '',
    position: '',
    department: '',
    role_name: '',
    status: '',
    created_at: '',
    last_access: ''
  }

  const [user, setUser] = useState(defaultUser)
  const [originalUser, setOriginalUser] = useState(defaultUser)

  const showAlert = (message, color = 'success') => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 4000)
  }

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getUserProfile()
      const userData = response?.message?.user
      if (userData) {
        // Get avatar from localStorage (avatar is client-side only)
        const stored = localStorage.getItem('FarmaPatriaUser')
        let avatar = ''
        if (stored) {
          try {
            avatar = JSON.parse(stored).avatar || ''
          } catch (e) { /* ignore */ }
        }
        const formatted = {
          ...defaultUser,
          ...userData,
          date_of_birth: userData.date_of_birth ? userData.date_of_birth.split('T')[0] : '',
          created_at: userData.created_at || '',
          last_access: userData.last_access || '',
          avatar
        }
        setUser(formatted)
        setOriginalUser(formatted)
      }
    } catch (err) {
      showAlert(err.message || 'Error al cargar el perfil', 'danger')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    clearToken()
    localStorage.removeItem('FarmaPatriaUser')
    navigate('/login')
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
      const response = await updateUserProfile(dataToSave)
      const updatedUser = response?.message?.user
      if (updatedUser) {
        const newUser = { ...user, ...updatedUser, date_of_birth: updatedUser.date_of_birth ? updatedUser.date_of_birth.split('T')[0] : user.date_of_birth }
        setUser(newUser)
        setOriginalUser(newUser)
        // Keep localStorage in sync for avatar and basic info
        localStorage.setItem('FarmaPatriaUser', JSON.stringify({
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          avatar: newUser.avatar
        }))
      }
      showAlert('Perfil actualizado exitosamente', 'success')
      setIsEditing(false)
    } catch (err) {
      showAlert(err.message || 'Error al guardar el perfil', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenProfile = () => {
    setIsEditing(false)
    setAlert({ show: false, message: '', color: '' })
    setProfileModal(true)
    fetchProfile()
  }

  const handleCancelEdit = () => {
    setUser(originalUser)
    setIsEditing(false)
  }

  const handleCloseProfile = () => {
    setProfileModal(false)
    setIsEditing(false)
    setAlert({ show: false, message: '', color: '' })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newUser = { ...user, avatar: reader.result }
        setUser(newUser)
        // Save avatar to localStorage immediately (avatar is client-side only)
        localStorage.setItem('FarmaPatriaUser', JSON.stringify({
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          avatar: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleString('es-VE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  const getStatusBadge = (status) => {
    const colors = { Active: 'success', Inactive: 'secondary', Suspended: 'danger' }
    const labels = { Active: 'Activo', Inactive: 'Inactivo', Suspended: 'Suspendido' }
    return <CBadge color={colors[status] || 'secondary'}>{labels[status] || status}</CBadge>
  }

  // Get stored avatar for the header display
  const getHeaderAvatar = () => {
    try {
      const stored = localStorage.getItem('FarmaPatriaUser')
      if (stored) return JSON.parse(stored).avatar || ''
    } catch { /* ignore */ }
    return ''
  }

  const headerAvatar = getHeaderAvatar()

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar color="secondary" textColor="white" size="md" src={headerAvatar || undefined}>
            {!headerAvatar && <CIcon icon={cilUser} />}
          </CAvatar>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end"> 
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Opciones</CDropdownHeader>
          <CDropdownItem as="button" onClick={handleOpenProfile}>
            <CIcon icon={cilUser} className="me-2" />
            Perfil
          </CDropdownItem>
          <CDropdownItem as="button" onClick={() => setSettingsModal(true)}>
            <CIcon icon={cilSettings} className="me-2" />
            Configuración
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem as="button" onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Cerrar Sesión
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Modal de Perfil */}
      <CModal visible={profileModal} onClose={handleCloseProfile} size="lg">
        <CModalHeader onClose={handleCloseProfile}>
          <CModalTitle>Perfil de Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {alert.show && (
            <CAlert color={alert.color} dismissible onClose={() => setAlert({ show: false, message: '', color: '' })}>
              {alert.message}
            </CAlert>
          )}

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CSpinner color="primary" />
              <span className="ms-3">Cargando perfil...</span>
            </div>
          ) : (
            <>
              <div className="d-flex flex-column align-items-center mb-4">
                <CAvatar 
                  color="secondary" 
                  textColor="white" 
                  size="xl" 
                  src={user.avatar || undefined}
                  style={{ width: '100px', height: '100px', fontSize: '3rem' }}
                  className="mb-2"
                >
                  {!user.avatar && <CIcon icon={cilUser} size="xl" />}
                </CAvatar>
                {isEditing && (
                  <>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                    />
                    <CButton 
                      color="light" 
                      size="sm"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Cambiar Foto
                    </CButton>
                  </>
                )}
                <h5 className="mt-2 mb-0">{user.first_name} {user.last_name}</h5>
                <small className="text-body-secondary">@{user.username}</small>
                {user.status && <div className="mt-1">{getStatusBadge(user.status)}</div>}
              </div>
              
              <CForm>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="firstNameInput">Nombre</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="firstNameInput" 
                      value={user.first_name || ''} 
                      onChange={(e) => setUser({...user, first_name: e.target.value})}
                      readOnly={!isEditing}
                      plainText={!isEditing}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="lastNameInput">Apellido</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="lastNameInput" 
                      value={user.last_name || ''} 
                      onChange={(e) => setUser({...user, last_name: e.target.value})}
                      readOnly={!isEditing}
                      plainText={!isEditing}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="usernameInput">Usuario</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="usernameInput" 
                      value={user.username || ''} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="idInput">Cédula / Identificación</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="idInput" 
                      value={user.identification_number || ''} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="emailInput">Correo Electrónico</CFormLabel>
                    <CFormInput 
                      type="email" 
                      id="emailInput" 
                      value={user.email || ''} 
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      readOnly={!isEditing}
                      plainText={!isEditing}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="phoneInput">Teléfono</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="phoneInput" 
                      value={user.phone || ''} 
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      readOnly={!isEditing}
                      plainText={!isEditing}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="addressInput">Dirección</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="addressInput" 
                      value={user.address || ''} 
                      onChange={(e) => setUser({...user, address: e.target.value})}
                      readOnly={!isEditing}
                      plainText={!isEditing}
                    />
                  </CCol>
                </CRow>

                <hr />
                <h6 className="text-body-secondary mb-3">Información del Cargo</h6>

                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel>Rol</CFormLabel>
                    <CFormInput 
                      type="text" 
                      value={user.role_name || '—'} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Cargo</CFormLabel>
                    <CFormInput 
                      type="text" 
                      value={user.position || '—'} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel>Departamento</CFormLabel>
                    <CFormInput 
                      type="text" 
                      value={user.department || '—'} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Fecha de Registro</CFormLabel>
                    <CFormInput 
                      type="text" 
                      value={formatDate(user.created_at)} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Último Acceso</CFormLabel>
                    <CFormInput 
                      type="text" 
                      value={formatDateTime(user.last_access)} 
                      readOnly={true}
                      plainText={true}
                      disabled={true}
                    />
                  </CCol>
                </CRow>
              </CForm>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          {isEditing ? (
            <>
              <CButton color="secondary" onClick={handleCancelEdit} disabled={saving}>
                Cancelar
              </CButton>
              <CButton color="success" className="text-white" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <><CSpinner size="sm" className="me-2" />Guardando...</> : 'Guardar Cambios'}
              </CButton>
            </>
          ) : (
            <>
              <CButton color="secondary" onClick={handleCloseProfile}>
                Cerrar
              </CButton>
              <CButton color="primary" onClick={() => setIsEditing(true)} disabled={loading}>
                Editar Perfil
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>

      {/* Modal de Configuración */}
      <CModal visible={settingsModal} onClose={() => setSettingsModal(false)}>
        <CModalHeader onClose={() => setSettingsModal(false)}>
          <CModalTitle>Configuración</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Opciones básicas de configuración del sistema.</p>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Idioma</CFormLabel>
              <select className="form-select">
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
            <div className="mb-3">
              <CFormSwitch label="Recibir notificaciones por correo" id="notifSwitch" defaultChecked />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSettingsModal(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={() => setSettingsModal(false)}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown
