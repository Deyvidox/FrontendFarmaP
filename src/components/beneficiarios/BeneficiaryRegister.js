import React, { useState } from 'react';
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
  CFormTextarea,
  CButton,
  CAlert
} from '@coreui/react';
import { cilUser, cilSave, cilReload, cilCalendar, cilHome, cilPhone, cilEnvelopeClosed } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/beneficiarios/Beneficiaries.css';

const BeneficiaryRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario de beneficiario enviado');
    
    setAlert({
      show: true,
      message: 'Beneficiario registrado exitosamente',
      type: 'success'
    });
  };

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' });
  };

  // Datos quemados para comunidades (de Cat_Comunidad)
  const comunidades = [
    { id: 1, ComNombre: 'Tariba', ComMunicipio: 'Cardenas' },
    { id: 2, ComNombre: 'Palmira', ComMunicipio: 'Guasimos' },
    { id: 3, ComNombre: 'San Cristobal', ComMunicipio: 'San Cristobal' },
  ];

  return (
    <div className="beneficiary-register-container">
      <CCard className="beneficiary-register-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Registrar Beneficiario
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <CAlert color={alert.type} className="beneficiary-alert">
              {alert.message}
            </CAlert>
          )}
          
          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Información Personal */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon me-2" />
                Información Personal
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenCedula" className="register-form-label required-field">
                      Cédula
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenCedula"
                      name="BenCedula"
                      className="register-form-input"
                      placeholder="V-12345678"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenFechaNacimiento" className="register-form-label required-field">
                      Fecha de Nacimiento
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="BenFechaNacimiento"
                      name="BenFechaNacimiento"
                      className="register-form-input"
                      required
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenNombres" className="register-form-label required-field">
                      Nombres
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenNombres"
                      name="BenNombres"
                      className="register-form-input"
                      placeholder="Ingrese los nombres"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenApellidos" className="register-form-label required-field">
                      Apellidos
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenApellidos"
                      name="BenApellidos"
                      className="register-form-input"
                      placeholder="Ingrese los apellidos"
                      required
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenGenero" className="register-form-label required-field">
                      Género
                    </CFormLabel>
                    <CFormSelect id="BenGenero" name="BenGenero" className="register-form-select" required>
                      <option value="">Seleccione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenPersonasDependientes" className="register-form-label">
                      Personas Dependientes
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      id="BenPersonasDependientes"
                      name="BenPersonasDependientes"
                      className="register-form-input"
                      min="0"
                      defaultValue="0"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Información de Contacto y Ubicación */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilPhone} className="icon me-2" />
                Contacto y Ubicación
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenTelefonoPersonal" className="register-form-label">
                      Teléfono Personal
                    </CFormLabel>
                    <CFormInput
                      type="tel"
                      id="BenTelefonoPersonal"
                      name="BenTelefonoPersonal"
                      className="register-form-input"
                      placeholder="+58 412 1234567"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenEmail" className="register-form-label">
                      Email
                    </CFormLabel>
                    <CFormInput
                      type="email"
                      id="BenEmail"
                      name="BenEmail"
                      className="register-form-input"
                      placeholder="beneficiario@ejemplo.com"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="ComunidadID" className="register-form-label required-field">
                      Comunidad
                    </CFormLabel>
                    <CFormSelect id="ComunidadID" name="ComunidadID" className="register-form-select" required>
                      <option value="">Seleccione una comunidad</option>
                      {comunidades.map((comunidad) => (
                        <option key={comunidad.id} value={comunidad.id}>
                          {comunidad.ComNombre} - {comunidad.ComMunicipio}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenDireccionDetallada" className="register-form-label">
                      Dirección Detallada
                    </CFormLabel>
                    <CFormTextarea
                      id="BenDireccionDetallada"
                      name="BenDireccionDetallada"
                      className="register-form-input"
                      rows="2"
                      placeholder="Calle, casa, referencia..."
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Información de Emergencia */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilPhone} className="icon me-2" />
                Contacto de Emergencia
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenContactoEmergencia" className="register-form-label">
                      Nombre de Contacto
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenContactoEmergencia"
                      name="BenContactoEmergencia"
                      className="register-form-input"
                      placeholder="Nombre completo del contacto"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenTelefonoEmergencia" className="register-form-label">
                      Teléfono de Emergencia
                    </CFormLabel>
                    <CFormInput
                      type="tel"
                      id="BenTelefonoEmergencia"
                      name="BenTelefonoEmergencia"
                      className="register-form-input"
                      placeholder="+58 412 9876543"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Información Socioeconómica */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilHome} className="icon me-2" />
                Información Socioeconómica
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenIngresosMensuales" className="register-form-label">
                      Ingresos Mensuales (Bs)
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      id="BenIngresosMensuales"
                      name="BenIngresosMensuales"
                      className="register-form-input"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenNivelPrioridad" className="register-form-label required-field">
                      Nivel de Prioridad
                    </CFormLabel>
                    <CFormSelect id="BenNivelPrioridad" name="BenNivelPrioridad" className="register-form-select" required>
                      <option value="">Seleccione prioridad</option>
                      <option value="ALTA">Alta</option>
                      <option value="MEDIA">Media</option>
                      <option value="BAJA">Baja</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenObservaciones" className="register-form-label">
                      Observaciones
                    </CFormLabel>
                    <CFormTextarea
                      id="BenObservaciones"
                      name="BenObservaciones"
                      className="register-form-input"
                      rows="3"
                      placeholder="Observaciones relevantes sobre el beneficiario..."
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
                Registrar Beneficiario
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
  );
};

export default BeneficiaryRegister;