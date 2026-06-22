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
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import { cilUser, cilSave, cilReload, cilCalendar, cilHome, cilPhone, cilEnvelopeClosed, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { createBeneficiary, getCommunities, createCommunity } from 'src/services/api';
import '../../css/beneficiarios/Beneficiaries.css';
import { useEffect } from 'react';

const BeneficiaryRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [comunidades, setComunidades] = useState([]);
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

  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityForm, setCommunityForm] = useState({ name: '', municipality: '', parish: '', state_region: '' });
  const [savingCommunity, setSavingCommunity] = useState(false);

  const handleCommunityChange = (e) => {
    setCommunityForm({ ...communityForm, [e.target.name]: e.target.value });
  };

  const handleCreateCommunity = async () => {
    if (!communityForm.name) return;
    setSavingCommunity(true);
    try {
      const response = await createCommunity({
         name: communityForm.name,
         municipality: communityForm.municipality,
         parish: communityForm.parish,
         state_region: communityForm.state_region
      });
      // reload communities
      const commResponse = await getCommunities();
      const updatedComms = commResponse?.message?.communities || [];
      setComunidades(updatedComms);
      
      // select the newly created community if it has an ID returned
      if (response?.message?.id) {
         setFormValues(prev => ({ ...prev, comunidad_id: response.message.id }));
      }
      setShowCommunityModal(false);
      setCommunityForm({ name: '', municipality: '', parish: '', state_region: '' });
      setAlert({ show: true, message: 'Comunidad añadida exitosamente', type: 'success' });
    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: 'Error creando comunidad: ' + (err.message || 'Error desconocido'), type: 'danger' });
      setShowCommunityModal(false);
    } finally {
      setSavingCommunity(false);
    }
  };

  useEffect(() => {
    const loadComunidades = async () => {
      try {
        const response = await getCommunities();
        setComunidades(response?.message?.communities || []);
      } catch (err) {
        console.error('Error cargando comunidades:', err);
      }
    };
    loadComunidades();
  }, []);

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
      const requestData = {
        first_name: formValues.nombres,
        last_name: formValues.apellidos,
        identification_number: formValues.cedula || null,
        birth_date: formValues.fecha_nacimiento || null,
        gender: formValues.genero || null,
        community_id: formValues.comunidad_id || null,
        detailed_address: formValues.direccion_detallada || null,
        phone_personal: formValues.telefono_personal || null,
        email: formValues.email || null,
        emergency_contact: formValues.contacto_emergencia || null,
        emergency_phone: formValues.telefono_emergencia || null,
        dependents: formValues.personas_dependientes ? parseInt(formValues.personas_dependientes) : 0,
        monthly_income: formValues.ingresos_mensuales ? parseFloat(formValues.ingresos_mensuales) : null,
        priority_level: formValues.nivel_prioridad === 'ALTA' ? 'High' : (formValues.nivel_prioridad === 'BAJA' ? 'Low' : 'Medium'),
      };

      await createBeneficiary(requestData);
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
                    <div className="d-flex gap-2">
                      <CFormSelect id="ComunidadID" name="comunidad_id" className="register-form-select" value={formValues.comunidad_id} onChange={handleChange} required>
                        <option value="">Seleccione una comunidad</option>
                        {comunidades.map((comunidad) => (
                          <option key={comunidad.id} value={comunidad.id}>
                            {comunidad.name || comunidad.ComNombre} - {comunidad.municipality || comunidad.ComMunicipio || 'N/A'}
                          </option>
                        ))}
                      </CFormSelect>
                      <CButton type="button" color="primary" variant="outline" onClick={() => setShowCommunityModal(true)} title="Añadir nueva comunidad">
                        <CIcon icon={cilPlus} />
                      </CButton>
                    </div>
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

      {/* Modal para Crear Comunidad */}
      <CModal visible={showCommunityModal} onClose={() => setShowCommunityModal(false)}>
        <CModalHeader>
          <CModalTitle>Agregar Nueva Comunidad</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Nombre de la Comunidad <span className="text-danger">*</span></CFormLabel>
            <CFormInput 
              name="name" 
              value={communityForm.name} 
              onChange={handleCommunityChange} 
              placeholder="Ej. Los Pinos"
              required 
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Municipio</CFormLabel>
            <CFormInput 
              name="municipality" 
              value={communityForm.municipality} 
              onChange={handleCommunityChange} 
              placeholder="Ej. Sucre" 
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Parroquia</CFormLabel>
            <CFormInput 
              name="parish" 
              value={communityForm.parish} 
              onChange={handleCommunityChange} 
              placeholder="Ej. Petare" 
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Estado / Región</CFormLabel>
            <CFormInput 
              name="state_region" 
              value={communityForm.state_region} 
              onChange={handleCommunityChange} 
              placeholder="Ej. Táchira" 
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCommunityModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleCreateCommunity} disabled={!communityForm.name || savingCommunity}>
            {savingCommunity ? 'Guardando...' : 'Guardar Comunidad'}
          </CButton>
        </CModalFooter>
      </CModal>

    </div>
  );
};

export default BeneficiaryRegister;