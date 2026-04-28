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
import { createBeneficiary } from 'src/services/api';
import '../../css/beneficiarios/Beneficiaries.css';

const BeneficiaryRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    genero: '',
    comunidad_id: '',
    direccion_detallada: '',
    telefono_personal: '',
    email: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    personas_dependientes: 0,
    ingresos_mensuales: '',
    nivel_prioridad: 'MEDIA',
    observaciones: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'personas_dependientes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', type: '' });
    setSubmitting(true);

    try {
      await createBeneficiary(formValues);
      setAlert({
        show: true,
        message: 'Beneficiario registrado exitosamente',
        type: 'success',
      });
      setFormValues({
        cedula: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        genero: '',
        comunidad_id: '',
        direccion_detallada: '',
        telefono_personal: '',
        email: '',
        contacto_emergencia: '',
        telefono_emergencia: '',
        personas_dependientes: 0,
        ingresos_mensuales: '',
        nivel_prioridad: 'MEDIA',
        observaciones: '',
      });
    } catch (err) {
      console.error('Error registrando beneficiario:', err);
      setAlert({ show: true, message: err.message || 'Error al registrar beneficiario', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' });
    setFormValues({
      cedula: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      genero: '',
      comunidad_id: '',
      direccion_detallada: '',
      telefono_personal: '',
      email: '',
      contacto_emergencia: '',
      telefono_emergencia: '',
      personas_dependientes: 0,
      ingresos_mensuales: '',
      nivel_prioridad: 'MEDIA',
      observaciones: '',
    });
  };

  // Datos quemados para comunidades (de Cat_Comunidad)
  const comunidades = [
    { id: '00000000-0000-0000-0000-000000000001', ComNombre: 'Tariba', ComMunicipio: 'Cardenas' },
    { id: '00000000-0000-0000-0000-000000000002', ComNombre: 'Palmira', ComMunicipio: 'Guasimos' },
    { id: '00000000-0000-0000-0000-000000000003', ComNombre: 'San Cristobal', ComMunicipio: 'San Cristobal' },
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
                      name="cedula"
                      className="register-form-input"
                      placeholder="V-12345678"
                      value={formValues.cedula}
                      onChange={handleChange}
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
                      name="fecha_nacimiento"
                      className="register-form-input"
                      value={formValues.fecha_nacimiento}
                      onChange={handleChange}
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
                      name="nombres"
                      className="register-form-input"
                      placeholder="Ingrese los nombres"
                      value={formValues.nombres}
                      onChange={handleChange}
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
                      name="apellidos"
                      className="register-form-input"
                      placeholder="Ingrese los apellidos"
                      value={formValues.apellidos}
                      onChange={handleChange}
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
                    <CFormSelect id="BenGenero" name="genero" className="register-form-select" value={formValues.genero} onChange={handleChange} required>
                      <option value="">Seleccione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
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
                      name="personas_dependientes"
                      className="register-form-input"
                      min="0"
                      value={formValues.personas_dependientes}
                      onChange={handleChange}
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
                      name="telefono_personal"
                      className="register-form-input"
                      value={formValues.telefono_personal}
                      onChange={handleChange}
                      placeholder="+58 412 1234567"
                      required
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
                      name="email"
                      className="register-form-input"
                      value={formValues.email}
                      onChange={handleChange}
                      placeholder="beneficiario@ejemplo.com"
                      required
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
                    <CFormSelect id="ComunidadID" name="comunidad_id" className="register-form-select" value={formValues.comunidad_id} onChange={handleChange} required>
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
                      name="direccion_detallada"
                      className="register-form-input"
                      rows="2"
                      value={formValues.direccion_detallada}
                      onChange={handleChange}
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
                      name="contacto_emergencia"
                      className="register-form-input"
                      value={formValues.contacto_emergencia}
                      onChange={handleChange}
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
                      name="telefono_emergencia"
                      className="register-form-input"
                      value={formValues.telefono_emergencia}
                      onChange={handleChange}
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
                      name="ingresos_mensuales"
                      className="register-form-input"
                      min="0"
                      step="0.01"
                      value={formValues.ingresos_mensuales}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenNivelPrioridad" className="register-form-label required-field">
                      Nivel de Prioridad
                    </CFormLabel>
                    <CFormSelect id="BenNivelPrioridad" name="nivel_prioridad" className="register-form-select" value={formValues.nivel_prioridad} onChange={handleChange} required>
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
                      name="observaciones"
                      className="register-form-input"
                      rows="3"
                      value={formValues.observaciones}
                      onChange={handleChange}
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