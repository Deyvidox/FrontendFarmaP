import React, { useEffect, useState } from 'react'
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
import { cilUser, cilLockLocked, cilContact, cilBuilding, cilPhone, cilBadge, cilSave, cilReload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { registerUser, getRoles } from 'src/services/api';
import HelpButton from '../common/HelpButton';
import '../../css/users/UserRegister.css'

const UserRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [formValues, setFormValues] = useState({
    usu_nombre: '',
    usu_correo: '',
    password: '',
    rol_id: '',
    usu_cedula: '',
    usu_apellidos: '',
    usu_telefono: '',
    usu_cargo: '',
    usu_departamento: '',
    usu_estado: 'ACTIVO',
  })

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await getRoles()
        setRoles(response?.message?.roles || [])
      } catch (err) {
        console.error('Error cargando roles:', err)
        setAlert({ show: true, message: err.message || 'No se pudieron cargar los roles', type: 'danger' })
      } finally {
        setLoadingRoles(false)
      }
    }

    loadRoles()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert({ show: false, message: '', type: '' })

    try {
      await registerUser({
        first_name: formValues.usu_nombre,
        last_name: formValues.usu_apellidos || null,
        username: formValues.usu_correo.split('@')[0],
        email: formValues.usu_correo,
        password: formValues.password,
        role_id: formValues.rol_id,
        identification_number: formValues.usu_cedula || null,
        phone: formValues.usu_telefono || null,
        status: formValues.usu_estado === 'ACTIVO' ? 'Active' : (formValues.usu_estado === 'INACTIVO' ? 'Inactive' : 'Suspended'),
      })
      setAlert({ show: true, message: 'Usuario registrado exitosamente', type: 'success' })
      setFormValues({
        usu_nombre: '',
        usu_correo: '',
        password: '',
        rol_id: '',
        usu_cedula: '',
        usu_apellidos: '',
        usu_telefono: '',
        usu_cargo: '',
        usu_departamento: '',
        usu_estado: 'ACTIVO',
      })
    } catch (err) {
      console.error('Error registrando usuario:', err)
      setAlert({ show: true, message: err.message || 'Error al registrar usuario', type: 'danger' })
    }
  }

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' })
    setFormValues({
      usu_nombre: '',
      usu_correo: '',
      password: '',
      rol_id: '',
      usu_cedula: '',
      usu_apellidos: '',
      usu_telefono: '',
      usu_cargo: '',
      usu_departamento: '',
      usu_estado: 'ACTIVO',
    })
  }

  return (
    <div className="user-register-container">
      <CCard className="user-register-card">
        <CCardHeader>
          <h5 className="mb-0 d-flex align-items-center">
            <CIcon icon={cilUser} className="me-2" />
            Registrar Usuario
            <HelpButton title="Manual de Usuario – Registrar Usuario">
              <div>
                <p>Este formulario crea una cuenta de acceso. Sigue los pasos.</p>
                <h6>Formulario de registro</h6>
                <div className="card p-3 mb-3 bg-light">
                  <div className="row g-2">
                    <div className="col-md-6"><small className="fw-bold">(1) Cédula/RIF</small><br/><small className="text-muted">V-12345678</small></div>
                    <div className="col-md-6"><small className="fw-bold">(2) Nombres</small><br/><small className="text-muted">Ingrese los nombres</small></div>
                    <div className="col-md-6"><small className="fw-bold">(3) Apellidos</small><br/><small className="text-muted">Ingrese los apellidos</small></div>
                    <div className="col-md-6"><small className="fw-bold">(4) Email</small><br/><small className="text-muted">usuario@donaciones.com</small></div>
                    <div className="col-md-6"><small className="fw-bold">(5) Teléfono</small><br/><small className="text-muted">+58 412 1234567</small></div>
                    <div className="col-md-6"><small className="fw-bold">(6) Cargo</small><br/><small className="text-muted">Cargo del usuario</small></div>
                    <div className="col-12"><small className="fw-bold">(7) Rol</small><br/><small className="text-muted">Seleccione un rol</small></div>
                    <div className="col-md-6"><small className="fw-bold">(8) Departamento</small><br/><small className="text-muted">Departamento</small></div>
                    <div className="col-md-6"><small className="fw-bold">(9) Estado</small><br/><small className="text-muted">Activo</small></div>
                    <div className="col-12"><small className="fw-bold">(10) Contraseña</small><br/><small className="text-muted">Ingrese contraseña</small></div>
                  </div>
                </div>
                <ol>
                  <li><strong>Cédula/RIF:</strong> Obligatorio. Debe comenzar con V- o J- según persona natural o jurídica. Ej: V-12345678.</li>
                  <li><strong>Nombres:</strong> Nombre real del usuario. Sin caracteres especiales.</li>
                  <li><strong>Apellidos:</strong> Igual, sin tildes para evitar problemas de búsqueda.</li>
                  <li><strong>Email:</strong> Correo válido. Será usado para iniciar sesión.</li>
                  <li><strong>Teléfono:</strong> Formato +58 412 1234567. Útil para notificaciones.</li>
                  <li><strong>Cargo:</strong> Puesto del usuario (ej. Farmacéutico).</li>
                  <li><strong>Rol:</strong> Selecciona de la lista. Define los permisos. Si no ves opciones, recarga o contacta al administrador.</li>
                  <li><strong>Departamento:</strong> Área de trabajo.</li>
                  <li><strong>Estado:</strong> Por defecto Activo. Se puede cambiar luego.</li>
                  <li><strong>Contraseña:</strong> Mínimo 8 caracteres. Se recomienda combinar letras y números.</li>
                </ol>
                <p className="text-muted"><em>Nota: Tras guardar, el usuario podrá iniciar sesión inmediatamente.</em></p>
              </div>
            </HelpButton>
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
                      name="usu_cedula"
                      className="register-form-input"
                      value={formValues.usu_cedula}
                      onChange={handleChange}
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
                      name="usu_nombre"
                      className="register-form-input"
                      value={formValues.usu_nombre}
                      onChange={handleChange}
                      placeholder="Ingrese los nombres"
                      required
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
                      name="usu_apellidos"
                      className="register-form-input"
                      value={formValues.usu_apellidos}
                      onChange={handleChange}
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
                      name="usu_correo"
                      className="register-form-input"
                      value={formValues.usu_correo}
                      onChange={handleChange}
                      placeholder="usuario@donaciones.com"
                      required
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
                      name="usu_telefono"
                      className="register-form-input"
                      value={formValues.usu_telefono}
                      onChange={handleChange}
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
                      name="usu_cargo"
                      className="register-form-input"
                      value={formValues.usu_cargo}
                      onChange={handleChange}
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
                    <CFormSelect
                      id="RolNombre"
                      name="rol_id"
                      className="register-form-select"
                      value={formValues.rol_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      {loadingRoles ? (
                        <option value="">Cargando roles...</option>
                      ) : (
                        roles.map((role) => {
                          let displayName = role.name;
                          if (role.name === 'Administrator') displayName = 'Administrador';
                          else if (role.name === 'Warehouse Manager' || role.name === 'Pharmacist') displayName = 'Farmacéutico';
                          else if (role.name === 'Social Worker' || role.name === 'Assistant') displayName = 'Asistente';
                          else if (role.name === 'Donor') displayName = 'Donante';
                          else if (role.name === 'Coordinator') displayName = 'Coordinador';
                          
                          return (
                            <option key={role.id} value={role.id}>
                              {displayName}
                            </option>
                          )
                        })
                      )}
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
                      name="usu_departamento"
                      className="register-form-input"
                      value={formValues.usu_departamento}
                      onChange={handleChange}
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
                    <CFormSelect
                      id="UsuEstado"
                      name="usu_estado"
                      className="register-form-select"
                      value={formValues.usu_estado}
                      onChange={handleChange}
                    >
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
                      value={formValues.password}
                      onChange={handleChange}
                      placeholder="Ingrese contraseña"
                      required
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