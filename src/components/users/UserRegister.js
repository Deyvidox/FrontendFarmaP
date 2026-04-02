import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton
} from '@coreui/react'
import { cilUser, cilSave, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/users/UserRegister.css'

const UserRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Solo muestra mensaje de consola
    console.log('Formulario enviado (sin funcionalidad)')
    
    setAlert({
      show: true,
      message: 'Usuario registrado exitosamente (simulado)',
      type: 'success'
    })
  }

  const handleReset = () => {
    // Solo limpia el formulario visualmente
    setAlert({ show: false, message: '', type: '' })
  }

  return (
    <div className="user-register-container">
      <CCard className="user-register-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Registrar Usuario
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-4`}>
              {alert.message}
            </div>
          )}
          
          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Información Personal - Campos DB */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon me-2" />
                Información Personal
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuCedula" className="register-form-label">
                      Cédula/RIF
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="UsuCedula"
                      name="UsuCedula"
                      className="register-form-input"
                      placeholder="V-12345678 o J-301234567"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuNombres" className="register-form-label">
                      Nombres
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="UsuNombres"
                      name="UsuNombres"
                      className="register-form-input"
                      placeholder="Ingrese los nombres"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuApellidos" className="register-form-label">
                      Apellidos
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="UsuApellidos"
                      name="UsuApellidos"
                      className="register-form-input"
                      placeholder="Ingrese los apellidos"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuCorreo" className="register-form-label">
                      Email
                    </CFormLabel>
                    <CFormInput
                      type="email"
                      id="UsuCorreo"
                      name="UsuCorreo"
                      className="register-form-input"
                      placeholder="usuario@donaciones.com"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuTelefono" className="register-form-label">
                      Teléfono
                    </CFormLabel>
                    <CFormInput
                      type="tel"
                      id="UsuTelefono"
                      name="UsuTelefono"
                      className="register-form-input"
                      placeholder="+58 412 1234567"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuCargo" className="register-form-label">
                      Cargo
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="UsuCargo"
                      name="UsuCargo"
                      className="register-form-input"
                      placeholder="Cargo del usuario"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Información Profesional - Campos DB */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon me-2" />
                Información Profesional
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="RolNombre" className="register-form-label">
                      Rol
                    </CFormLabel>
                    <CFormSelect id="RolNombre" name="RolNombre" className="register-form-select">
                      <option value="">Seleccione un rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Farmacéutico">Farmacéutico</option>
                      <option value="Donante">Donante</option>
                      <option value="Asistente">Asistente</option>
                      <option value="Coordinador">Coordinador</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuDepartamento" className="register-form-label">
                      Departamento
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="UsuDepartamento"
                      name="UsuDepartamento"
                      className="register-form-input"
                      placeholder="Departamento"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuEstado" className="register-form-label">
                      Estado
                    </CFormLabel>
                    <CFormSelect id="UsuEstado" name="UsuEstado" className="register-form-select">
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                      <option value="SUSPENDIDO">Suspendido</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Seguridad */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon me-2" />
                Seguridad
              </h6>
              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="password" className="register-form-label">
                      Contraseña
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      name="password"
                      className="register-form-input"
                      placeholder="Ingrese contraseña"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            <div className="d-flex gap-2 btn-group-responsive">
              <CButton 
                color="primary" 
                type="submit"
                className="register-btn-primary"
              >
                <CIcon icon={cilSave} className="me-2" />
                Registrar Usuario
              </CButton>
              <CButton 
                color="secondary" 
                type="reset"
                className="register-btn-secondary"
              >
                <CIcon icon={cilReload} className="me-2" />
                Limpiar Formulario
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserRegister