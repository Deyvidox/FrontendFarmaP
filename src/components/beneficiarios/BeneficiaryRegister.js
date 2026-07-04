import React, { useState, useEffect } from 'react';
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
  CModalFooter,
  CBadge
} from '@coreui/react';
import { cilUser, cilSave, cilReload, cilCalendar, cilHome, cilPhone, cilEnvelopeClosed, cilPlus, cilMedicalCross, cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { createBeneficiary, getCommunities, createCommunity, updateCommunity, deleteCommunity, getMedicines, addBeneficiaryDisease, saveBeneficiaryMedicines } from 'src/services/api';
import '../../css/beneficiarios/Beneficiaries.css';
import HelpButton from '../common/HelpButton';
import ToastNotification from '../common/ToastNotification';

const BeneficiaryRegister = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type });
    setTimeout(() => setToast({ show: true, message, type }), 20);
  };
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
    profesion: '',
    nivel_prioridad: 'Medium',
    observaciones: '',
  });

  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityModalView, setCommunityModalView] = useState('list'); // 'list', 'create', 'edit'
  const [editingCommunityId, setEditingCommunityId] = useState(null);
  const [communityForm, setCommunityForm] = useState({ name: '', municipality: '', parish: '', state_region: '' });
  const [savingCommunity, setSavingCommunity] = useState(false);

  const [enfermedades, setEnfermedades] = useState([]);
  const [nuevaEnfermedad, setNuevaEnfermedad] = useState('');
  const [estadoEnfermedad, setEstadoEnfermedad] = useState('ESTABLE');
  const [obsEnfermedad, setObsEnfermedad] = useState('');

  const [medicinesCatalog, setMedicinesCatalog] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [dosisInput, setDosisInput] = useState('');

  const openCommunityModal = () => {
    setCommunityModalView('list');
    setShowCommunityModal(true);
  };

  const handleCommunityChange = (e) => {
    setCommunityForm({ ...communityForm, [e.target.name]: e.target.value });
  };

  const handleSaveCommunity = async () => {
    if (!communityForm.name) return;
    setSavingCommunity(true);
    try {
      if (communityModalView === 'create') {
        const response = await createCommunity({
          name: communityForm.name,
          municipality: communityForm.municipality,
          parish: communityForm.parish,
          state_region: communityForm.state_region
        });
        if (response?.message?.id) {
          setFormValues(prev => ({ ...prev, comunidad_id: response.message.id }));
        }
        showToast('Comunidad añadida exitosamente', 'success');
      } else if (communityModalView === 'edit') {
        await updateCommunity(editingCommunityId, {
          name: communityForm.name,
          municipality: communityForm.municipality,
          parish: communityForm.parish,
          state_region: communityForm.state_region
        });
        showToast('Comunidad actualizada exitosamente', 'success');
      }

      const commResponse = await getCommunities();
      setComunidades(commResponse?.message?.communities || []);
      setCommunityModalView('list');
    } catch (err) {
      console.error(err);
      showToast('Error guardando comunidad: ' + (err.message || 'Error desconocido'), 'danger');
    } finally {
      setSavingCommunity(false);
    }
  };

  const handleEditCommunity = (com) => {
    setCommunityForm({
      name: com.name || com.ComNombre || '',
      municipality: com.municipality || com.ComMunicipio || '',
      parish: com.parish || '',
      state_region: com.state_region || ''
    });
    setEditingCommunityId(com.id);
    setCommunityModalView('edit');
  };

  const handleDeleteCommunity = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta comunidad?")) return;
    try {
      await deleteCommunity(id);
      const commResponse = await getCommunities();
      setComunidades(commResponse?.message?.communities || []);
      showToast('Comunidad eliminada exitosamente', 'success');
      if (formValues.comunidad_id === id) {
        setFormValues(prev => ({ ...prev, comunidad_id: '' }));
      }
    } catch (err) {
      console.error(err);
      showToast('Error eliminando comunidad: ' + (err.message || 'Error desconocido'), 'danger');
    }
  };

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [commRes, medRes] = await Promise.all([
          getCommunities(),
          getMedicines(),
        ]);
        setComunidades(commRes?.message?.communities || []);
        setMedicinesCatalog(medRes?.message?.medicines || []);
      } catch (err) {
        console.error('Error cargando catálogos:', err);
      }
    };
    fetchCatalogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'personas_dependientes' ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    // Cédula
    if (!/^[VEJ]-\d{6,8}$/.test(formValues.cedula)) {
      errors.push('La cédula debe comenzar con V-, E- o J- seguido de 6 a 8 dígitos (ej: V-12345678)');
    }

    // Nombres y apellidos (ya tienen required en el form, pero validamos longitud)
    if (formValues.nombres.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    if (formValues.apellidos.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    // Fecha nacimiento
    if (!formValues.fecha_nacimiento) {
      errors.push('La fecha de nacimiento es obligatoria');
    }

    // Género
    if (!formValues.genero) {
      errors.push('El género es obligatorio');
    }

    // Comunidad
    if (!formValues.comunidad_id) {
      errors.push('La comunidad es obligatoria');
    }

    // Teléfono
    if (!/^(?:\+58|0)\s?\d{3}\s?\d{7}$/.test(formValues.telefono_personal)) {
      errors.push('El teléfono debe tener formato +58 412 1234567 o 0412 1234567');
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.push('El email no es válido');
    }

    // Prioridad
    if (!formValues.nivel_prioridad) {
      errors.push('La prioridad es obligatoria');
    }

    // Teléfono de emergencia (opcional, pero si se ingresa debe ser válido)
    if (formValues.telefono_emergencia && !/^(?:\+58|0)\s?\d{3}\s?\d{7}$/.test(formValues.telefono_emergencia)) {
      errors.push('El teléfono de emergencia debe tener formato +58 412 1234567 o 0412 1234567');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ show: false, message: '', type: 'info' });

    const errors = validateForm();
    if (errors.length > 0) {
      showToast(errors.join('. '), 'danger');
      return;
    }

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
        occupation: formValues.profesion || null,
        priority_level: formValues.nivel_prioridad,
      };

      const res = await createBeneficiary(requestData);

      const newId = res?.message?.beneficiary?.id || res?.message?.id;

      for (const enf of enfermedades) {
        try {
          await addBeneficiaryDisease(newId, {
            disease_id: enf.nombre,
            current_status: enf.estado || null,
            observations: enf.observaciones || null,
          });
        } catch (diseaseErr) {
          console.error('Error guardando enfermedad:', diseaseErr);
        }
      }

      if (medicamentos.length > 0) {
        try {
          await saveBeneficiaryMedicines(newId, {
            medicines: medicamentos.map(m => ({
              medicine_id: m.medicine_id,
              dosage_instructions: m.dosis || ''
            }))
          });
        } catch (medErr) {
          console.error('Error guardando medicamentos:', medErr);
        }
      }

      showToast('Beneficiario registrado exitosamente.', 'success');

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
        profesion: '',
        nivel_prioridad: 'Medium',
        observaciones: '',
      });
      setEnfermedades([]);
      setMedicamentos([]);
    } catch (err) {
      console.error('Error registrando beneficiario:', err);
      showToast(err.message || 'Error al registrar beneficiario', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setToast({ show: false, message: '', type: 'info' });
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
      profesion: '',
      nivel_prioridad: 'Medium',
      observaciones: '',
    });
    setEnfermedades([]);
    setMedicamentos([]);
    setNuevaEnfermedad('');
    setEstadoEnfermedad('ESTABLE');
    setObsEnfermedad('');
    setSelectedMedId('');
    setDosisInput('');
  };

  const handleAddEnfermedad = () => {
    if (!nuevaEnfermedad.trim()) return;
    setEnfermedades([...enfermedades, {
      nombre: nuevaEnfermedad.trim(),
      estado: estadoEnfermedad,
      observaciones: obsEnfermedad.trim()
    }]);
    setNuevaEnfermedad('');
    setEstadoEnfermedad('ESTABLE');
    setObsEnfermedad('');
  };

  const handleRemoveEnfermedad = (index) => {
    setEnfermedades(enfermedades.filter((_, i) => i !== index));
  };

  const handleAddMedicamento = () => {
    if (!selectedMedId) return;
    if (medicamentos.find(m => m.medicine_id === selectedMedId)) return;
    const medObj = medicinesCatalog.find(m => m.id === selectedMedId);
    setMedicamentos([...medicamentos, {
      medicine_id: medObj.id,
      nombre_comercial: medObj.commercial_name,
      nombre_generico: medObj.generic_name,
      dosis: dosisInput.trim()
    }]);
    setSelectedMedId('');
    setDosisInput('');
  };

  const handleRemoveMedicamento = (medicineId) => {
    setMedicamentos(medicamentos.filter(m => m.medicine_id !== medicineId));
  };


  return (
    <div className="beneficiary-register-container">
      <CCard className="beneficiary-register-card">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Registrar Beneficiario
            <HelpButton title="Manual de Usuario – Registrar Beneficiario">
              <div>
                <p><strong>¿Qué hace esta pantalla?</strong><br />
                  Permite dar de alta un nuevo beneficiario en el sistema, registrando sus datos personales, ubicación, contacto de emergencia, información socioeconómica, enfermedades y medicamentos requeridos.</p>
                <h6>🧪 Ejemplo de formulario completo</h6>
                <div style={{ background: '#f8f9fa', color: '#212529', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: '1 1 45%' }}><strong>Cédula *</strong><br />V-12345678</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Nombres *</strong><br />María Elena</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Apellidos *</strong><br />Gómez Rodríguez</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Fecha de Nacimiento *</strong><br />15/08/1965</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Género *</strong><br />Femenino</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Personas Dependientes</strong><br />2</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Teléfono Personal *</strong><br />+58 412 1234567</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Email *</strong><br />maria.gomez@ejemplo.com</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Comunidad *</strong><br />Barrio 23 de Enero (Libertador)</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Dirección Detallada</strong><br />Calle 5, casa 23, cerca del ambulatorio</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Nombre Contacto Emergencia</strong><br />Pedro Gómez</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Teléfono de Emergencia</strong><br />+58 412 9876543</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Profesión/Trabajo</strong><br />Docente jubilada</div>
                    <div style={{ flex: '1 1 45%' }}><strong>Nivel de Prioridad *</strong><br /><span style={{ background: '#ffc107', color: '#000', padding: '2px 8px', borderRadius: '4px' }}>Media</span></div>
                    <div style={{ flex: '1 1 100%' }}><strong>Observaciones</strong><br />Paciente con hipertensión controlada. Requiere supervisión mensual.</div>
                  </div>
                  <hr />
                  <p><strong>Enfermedades:</strong></p>
                  <ul>
                    <li>Hipertensión Esencial – Estado: <span style={{ color: 'red' }}>CRÍTICO</span> – Obs: "Toma Losartán 50mg diario"</li>
                    <li>Diabetes tipo 2 – Estado: Estable</li>
                  </ul>
                  <p><strong>Medicamentos Requeridos:</strong></p>
                  <ul>
                    <li>Losartán 50mg – 1 tableta cada 24 horas</li>
                    <li>Metformina 850mg – 1 tableta cada 12 horas</li>
                  </ul>
                </div>
                <h6>📋 Validaciones y uso</h6>
                <ol>
                  <li><strong>Cédula * (obligatorio):</strong> Formato V-12345678 o E-12345678 o J-12345678. Debe comenzar con V-, E- o J- seguido de 6 a 8 dígitos.</li>
                  <li><strong>Nombres / Apellidos * (obligatorio):</strong> Solo letras y acentos. Entre 2 y 40 caracteres cada uno.</li>
                  <li><strong>Fecha de Nacimiento *:</strong> Debe ser mayor de 18 años (se valida automáticamente).</li>
                  <li><strong>Género *:</strong> Seleccionar de la lista (Masculino, Femenino, Otro).</li>
                  <li><strong>Personas Dependientes:</strong> Número entero (0-20).</li>
                  <li><strong>Teléfono Personal *:</strong> Formato +58 412 1234567 o 0412-1234567.</li>
                  <li><strong>Email *:</strong> Debe ser un correo válido (ej: usuario@dominio.com).</li>
                  <li><strong>Comunidad * (obligatorio):</strong> Seleccione de la lista desplegable.</li>
                  <li><strong>Dirección Detallada:</strong> Texto libre.</li>
                  <li><strong>Contacto de Emergencia:</strong> Opcional, pero si se ingresa nombre, el teléfono de emergencia debe ser válido.</li>
                  <li><strong>Teléfono de Emergencia:</strong> Mismo formato que teléfono personal.</li>
                  <li><strong>Profesión/Trabajo:</strong> Texto libre.</li>
                  <li><strong>Nivel de Prioridad * (obligatorio):</strong> Alta, Media o Baja.</li>
                  <li><strong>Observaciones:</strong> Máximo 500 caracteres.</li>
                  <li><strong>Enfermedades:</strong> Agregue una a una. La enfermedad se escribe como texto libre.</li>
                  <li><strong>Medicamentos Requeridos:</strong> Seleccione medicamento del catálogo y escriba la dosificación.</li>
                </ol>
                <p><strong>⚠️ Al guardar:</strong> Todos los campos marcados con * deben estar llenos y cumplir las validaciones. Si hay errores, se mostrarán en rojo debajo del campo.</p>
              </div>
            </HelpButton>
          </h5>
        </CCardHeader>
        <CCardBody>
          <ToastNotification
            show={toast.show}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, show: false }))}
          />

          <CForm onSubmit={handleSubmit} onReset={handleReset}>
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

            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilPhone} className="icon me-2" />
                Contacto y Ubicación
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenTelefonoPersonal" className="register-form-label required-field">
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
                    <CFormLabel htmlFor="BenEmail" className="register-form-label required-field">
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
                      <CButton type="button" color="primary" variant="outline" onClick={openCommunityModal} title="Gestionar comunidades">
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

            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilHome} className="icon me-2" />
                Información Socioeconómica
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="BenProfesion" className="register-form-label">
                      Profesión/Trabajo
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenProfesion"
                      name="profesion"
                      className="register-form-input"
                      value={formValues.profesion}
                      onChange={handleChange}
                      placeholder="Ej: Docente, Comerciante, Jubilado..."
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
                      <option value="High">Alta</option>
                      <option value="Medium">Media</option>
                      <option value="Low">Baja</option>
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

            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilMedicalCross} className="icon me-2" />
                Enfermedades
              </h6>
              <CRow className="align-items-end mb-3">
                <CCol md={4}>
                  <div className="mb-2">
                    <CFormLabel htmlFor="BenNuevaEnfermedad" className="register-form-label">Enfermedad</CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenNuevaEnfermedad"
                      className="register-form-input"
                      placeholder="Ej: Hipertensión, Diabetes..."
                      value={nuevaEnfermedad}
                      onChange={(e) => setNuevaEnfermedad(e.target.value)}
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-2">
                    <CFormLabel htmlFor="BenEstadoEnfermedad" className="register-form-label">Estado</CFormLabel>
                    <CFormSelect id="BenEstadoEnfermedad" className="register-form-select" value={estadoEnfermedad} onChange={(e) => setEstadoEnfermedad(e.target.value)}>
                      <option value="ESTABLE">Estable</option>
                      <option value="MODERADO">Moderado</option>
                      <option value="GRAVE">Grave</option>
                      <option value="CRÍTICO">Crítico</option>
                      <option value="CONTROLADO">Controlado</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-2">
                    <CFormLabel htmlFor="BenObsEnfermedad" className="register-form-label">Observaciones</CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenObsEnfermedad"
                      className="register-form-input"
                      placeholder="Detalles (opcional)"
                      value={obsEnfermedad}
                      onChange={(e) => setObsEnfermedad(e.target.value)}
                    />
                  </div>
                </CCol>
                <CCol md={2}>
                  <div className="mb-2">
                    <CButton color="success" className="w-100 text-white" type="button" onClick={handleAddEnfermedad}>
                      <CIcon icon={cilPlus} className="me-1" /> Agregar
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              {enfermedades.length > 0 && (
                <div className="mb-3">
                  {enfermedades.map((enf, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border">
                      <div>
                        <span className="fw-bold">{enf.nombre}</span>
                        <CBadge color={enf.estado === 'CRÍTICO' ? 'danger' : enf.estado === 'GRAVE' ? 'warning' : enf.estado === 'MODERADO' ? 'info' : 'success'} className="ms-2">{enf.estado}</CBadge>
                        {enf.observaciones && <small className="text-muted ms-2">— {enf.observaciones}</small>}
                      </div>
                      <CButton color="danger" variant="ghost" size="sm" type="button" onClick={() => handleRemoveEnfermedad(i)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilMedicalCross} className="icon me-2" />
                Medicamentos Requeridos
              </h6>
              <CRow className="align-items-end mb-3">
                <CCol md={5}>
                  <div className="mb-2">
                    <CFormLabel htmlFor="BenSelectMedicamento" className="register-form-label">Medicamento</CFormLabel>
                    <CFormSelect id="BenSelectMedicamento" className="register-form-select" value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)}>
                      <option value="">Seleccione medicamento...</option>
                      {medicinesCatalog.map(m => (
                        <option key={m.id} value={m.id}>{m.commercial_name} ({m.generic_name})</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={5}>
                  <div className="mb-2">
                    <CFormLabel htmlFor="BenDosis" className="register-form-label">Dosificación</CFormLabel>
                    <CFormInput
                      type="text"
                      id="BenDosis"
                      className="register-form-input"
                      placeholder="Ej: 1 tableta cada 8 horas"
                      value={dosisInput}
                      onChange={(e) => setDosisInput(e.target.value)}
                    />
                  </div>
                </CCol>
                <CCol md={2}>
                  <div className="mb-2">
                    <CButton color="success" className="w-100 text-white" type="button" onClick={handleAddMedicamento}>
                      <CIcon icon={cilPlus} className="me-1" /> Agregar
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              {medicamentos.length > 0 && (
                <div className="mb-3">
                  {medicamentos.map((med) => (
                    <div key={med.medicine_id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border">
                      <div>
                        <span className="fw-bold">{med.nombre_comercial}</span>
                        <small className="text-muted ms-2">({med.nombre_generico})</small>
                        {med.dosis && <span className="text-primary ms-2">— {med.dosis}</span>}
                      </div>
                      <CButton color="danger" variant="ghost" size="sm" type="button" onClick={() => handleRemoveMedicamento(med.medicine_id)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex gap-2 btn-group-responsive">
              <CButton
                color="primary"
                type="submit"
                className="register-btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Registrando...' : (<><CIcon icon={cilSave} className="me-2" /> Registrar Beneficiario</>)}
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

      <CModal visible={showCommunityModal} onClose={() => setShowCommunityModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Gestionar Comunidades</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {communityModalView === 'list' && (
            <div>
              <div className="d-flex justify-content-end mb-3">
                <CButton color="success" className="text-white" onClick={() => {
                  setCommunityForm({ name: '', municipality: '', parish: '', state_region: '' });
                  setCommunityModalView('create');
                }}>
                  <CIcon icon={cilPlus} className="me-2" /> Agregar Comunidad
                </CButton>
              </div>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-hover table-striped border">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Municipio</th>
                      <th>Parroquia</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comunidades.length === 0 ? (
                      <tr><td colSpan="4" className="text-center">No hay comunidades registradas</td></tr>
                    ) : (
                      comunidades.map(com => (
                        <tr key={com.id}>
                          <td>{com.name || com.ComNombre}</td>
                          <td>{com.municipality || com.ComMunicipio}</td>
                          <td>{com.parish || '-'}</td>
                          <td className="text-center">
                            <CButton color="info" variant="ghost" size="sm" onClick={() => handleEditCommunity(com)} title="Editar">
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton color="danger" variant="ghost" size="sm" onClick={() => handleDeleteCommunity(com.id)} title="Eliminar">
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(communityModalView === 'create' || communityModalView === 'edit') && (
            <div>
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
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          {communityModalView === 'list' ? (
            <CButton color="secondary" onClick={() => setShowCommunityModal(false)}>Cerrar</CButton>
          ) : (
            <>
              <CButton color="secondary" onClick={() => setCommunityModalView('list')}>Cancelar</CButton>
              <CButton color="primary" onClick={handleSaveCommunity} disabled={savingCommunity}>
                {savingCommunity ? 'Guardando...' : 'Guardar'}
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default BeneficiaryRegister;