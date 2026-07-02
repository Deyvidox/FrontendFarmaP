import React, { useState, useEffect, useRef } from 'react'
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
  CCol
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { clearToken } from '../../services/api'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [profileModal, setProfileModal] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const defaultUser = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    identification_number: '',
    date_of_birth: '',
    phone: '',
    address: '',
    avatar: ''
  }

  const [user, setUser] = useState(defaultUser)

  useEffect(() => {
    const userStr = localStorage.getItem('FarmaPatriaUser')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        setUser({ ...defaultUser, ...parsed })
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleLogout = () => {
    clearToken()
    localStorage.removeItem('FarmaPatriaUser')
    navigate('/login')
  }

  const handleSaveProfile = () => {
    localStorage.setItem('FarmaPatriaUser', JSON.stringify(user))
    setIsEditing(false)
  }

  const handleOpenProfile = () => {
    setIsEditing(false)
    setProfileModal(true)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar color="secondary" textColor="white" size="md" src={user.avatar || undefined}>
            {!user.avatar && <CIcon icon={cilUser} />}
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
      <CModal visible={profileModal} onClose={() => setProfileModal(false)} size="lg">
        <CModalHeader onClose={() => setProfileModal(false)}>
          <CModalTitle>Perfil de Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="usernameInput">Usuario (No editable)</CFormLabel>
                <CFormInput 
                  type="text" 
                  id="usernameInput" 
                  value={user.username || ''} 
                  readOnly={true}
                  disabled={true}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="idInput">Cédula / Identificación (No editable)</CFormLabel>
                <CFormInput 
                  type="text" 
                  id="idInput" 
                  value={user.identification_number || ''} 
                  readOnly={true}
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
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="dobInput">Fecha de Nacimiento</CFormLabel>
                <CFormInput 
                  type="date" 
                  id="dobInput" 
                  value={user.date_of_birth || ''} 
                  onChange={(e) => setUser({...user, date_of_birth: e.target.value})}
                  readOnly={!isEditing}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setProfileModal(false)}>
            Cerrar
          </CButton>
          {!isEditing ? (
            <CButton color="primary" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </CButton>
          ) : (
            <CButton color="success" className="text-white" onClick={handleSaveProfile}>
              Guardar Cambios
            </CButton>
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
