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
  CButton,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CAlert,
} from '@coreui/react';
import {
  cilMedicalCross,
  cilSave,
  cilReload,
  cilFactory,
  cilNotes,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  getPharmaceuticalForms,
  getLaboratories,
  getMedicineCategories,
  createMedicine,
} from 'src/services/api';
import '../../css/medicamentos/Medicamentos.css';

const MedicamentoRegistrar = () => {
  // Estado del formulario
  const [formValues, setFormValues] = useState({
    nationalCode: '',
    commercialName: '',
    genericName: '',
    activePrinciple: '',
    concentration: '',
    pharmaceuticalFormId: '',
    administrationRoute: '',
    laboratoryId: '',
    categoryId: '',
    sanitaryRegistration: '',
    requiresPrescription: 'false',
    storageConditions: '',
    storageTemperature: '',
    unitMeasure: '',
    unitsPerPresentation: '1',
    status: 'ACTIVO',
  });

  // Catálogos
  const [pharmaceuticalForms, setPharmaceuticalForms] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [errorCatalogs, setErrorCatalogs] = useState('');

  // Estados de envío
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Carga de catálogos
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [formsRes, labsRes, catsRes] = await Promise.all([
          getPharmaceuticalForms(),
          getLaboratories(),
          getMedicineCategories(),
        ]);
        setPharmaceuticalForms(formsRes?.message?.forms || []);
        setLaboratories(labsRes?.message?.laboratories || []);
        setCategories(catsRes?.message?.categories || []);
      } catch (err) {
        console.error('Error cargando catálogos:', err);
        setErrorCatalogs('No se pudieron cargar los catálogos necesarios.');
      } finally {
        setLoadingCatalogs(false);
      }
    };
    loadCatalogs();
  }, []);

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', type: '' });
    setSubmitting(true);

    // Construir payload para el backend
    const payload = {
      commercial_name: formValues.commercialName,
      generic_name: formValues.genericName || null,
      active_principle: formValues.activePrinciple || null,
      concentration: formValues.concentration || null,
      pharmaceutical_form_id: formValues.pharmaceuticalFormId,
      administration_route: formValues.administrationRoute || null,
      laboratory_id: formValues.laboratoryId,
      category_id: formValues.categoryId,
      national_code: formValues.nationalCode || null,
      sanitary_registration: formValues.sanitaryRegistration || null,
      requires_prescription: formValues.requiresPrescription === 'true',
      storage_conditions: formValues.storageConditions || null,
      storage_temperature: formValues.storageTemperature || null,
      unit_measure: formValues.unitMeasure || null,
      units_per_presentation: parseInt(formValues.unitsPerPresentation) || 1,
    };

    // Validación básica
    if (!payload.commercial_name || !payload.pharmaceutical_form_id || !payload.laboratory_id || !payload.category_id) {
      setAlert({
        show: true,
        message: 'Complete los campos obligatorios: nombre comercial, forma farmacéutica, laboratorio y categoría.',
        type: 'danger',
      });
      setSubmitting(false);
      return;
    }

    try {
      await createMedicine(payload);
      setAlert({
        show: true,
        message: 'Medicamento registrado exitosamente',
        type: 'success',
      });
      // Limpiar formulario
      setFormValues({
        nationalCode: '',
        commercialName: '',
        genericName: '',
        activePrinciple: '',
        concentration: '',
        pharmaceuticalFormId: '',
        administrationRoute: '',
        laboratoryId: '',
        categoryId: '',
        sanitaryRegistration: '',
        requiresPrescription: 'false',
        storageConditions: '',
        storageTemperature: '',
        unitMeasure: '',
        unitsPerPresentation: '1',
        status: 'ACTIVO',
      });
    } catch (err) {
      console.error('Error registrando medicamento:', err);
      setAlert({
        show: true,
        message: err.message || 'Error al registrar medicamento',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' });
    setFormValues({
      nationalCode: '',
      commercialName: '',
      genericName: '',
      activePrinciple: '',
      concentration: '',
      pharmaceuticalFormId: '',
      administrationRoute: '',
      laboratoryId: '',
      categoryId: '',
      sanitaryRegistration: '',
      requiresPrescription: 'false',
      storageConditions: '',
      storageTemperature: '',
      unitMeasure: '',
      unitsPerPresentation: '1',
      status: 'ACTIVO',
    });
  };

  if (loadingCatalogs) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p className="mt-3">Cargando catálogos...</p>
      </div>
    );
  }

  if (errorCatalogs) {
    return (
      <div className="medicamento-register-container">
        <CAlert color="danger">{errorCatalogs}</CAlert>
      </div>
    );
  }

  return (
    <div className="medicamento-register-container">
      <CCard className="medicamento-register-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilMedicalCross} className="me-2" />
            Registrar Nuevo Medicamento
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <CAlert color={alert.type} dismissible>
              {alert.message}
            </CAlert>
          )}

          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Información Básica */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilMedicalCross} className="icon me-2" />
                Información Básica
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="nationalCode">Código Nacional</CFormLabel>
                    <CFormInput
                      type="text"
                      id="nationalCode"
                      name="nationalCode"
                      value={formValues.nationalCode}
                      onChange={handleChange}
                      placeholder="Código nacional del medicamento"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="commercialName" className="required-field">
                      Nombre Comercial *
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="commercialName"
                      name="commercialName"
                      value={formValues.commercialName}
                      onChange={handleChange}
                      placeholder="Nombre comercial"
                      required
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="genericName">Nombre Genérico</CFormLabel>
                    <CFormInput
                      type="text"
                      id="genericName"
                      name="genericName"
                      value={formValues.genericName}
                      onChange={handleChange}
                      placeholder="Nombre genérico (principio activo)"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="activePrinciple">Principio Activo</CFormLabel>
                    <CFormInput
                      type="text"
                      id="activePrinciple"
                      name="activePrinciple"
                      value={formValues.activePrinciple}
                      onChange={handleChange}
                      placeholder="Principio activo principal"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="concentration">Concentración</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="text"
                        id="concentration"
                        name="concentration"
                        value={formValues.concentration}
                        onChange={handleChange}
                        placeholder="500"
                      />
                      <CInputGroupText>mg/mL</CInputGroupText>
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="pharmaceuticalFormId" className="required-field">
                      Forma Farmacéutica *
                    </CFormLabel>
                    <CFormSelect
                      id="pharmaceuticalFormId"
                      name="pharmaceuticalFormId"
                      value={formValues.pharmaceuticalFormId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {pharmaceuticalForms.map((form) => (
                        <option key={form.id} value={form.id}>
                          {form.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="administrationRoute">Vía de Administración</CFormLabel>
                    <CFormInput
                      type="text"
                      id="administrationRoute"
                      name="administrationRoute"
                      value={formValues.administrationRoute}
                      onChange={handleChange}
                      placeholder="Ej: Oral, Intravenosa"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Fabricante */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilFactory} className="icon me-2" />
                Información del Fabricante
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="laboratoryId" className="required-field">
                      Laboratorio *
                    </CFormLabel>
                    <CFormSelect
                      id="laboratoryId"
                      name="laboratoryId"
                      value={formValues.laboratoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar laboratorio</option>
                      {laboratories.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="sanitaryRegistration">Registro Sanitario</CFormLabel>
                    <CFormInput
                      type="text"
                      id="sanitaryRegistration"
                      name="sanitaryRegistration"
                      value={formValues.sanitaryRegistration}
                      onChange={handleChange}
                      placeholder="Número de registro sanitario"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Categorización */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilNotes} className="icon me-2" />
                Categorización
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="categoryId" className="required-field">
                      Categoría *
                    </CFormLabel>
                    <CFormSelect
                      id="categoryId"
                      name="categoryId"
                      value={formValues.categoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="requiresPrescription">Requiere Receta</CFormLabel>
                    <CFormSelect
                      id="requiresPrescription"
                      name="requiresPrescription"
                      value={formValues.requiresPrescription}
                      onChange={handleChange}
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Almacenamiento */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilNotes} className="icon me-2" />
                Almacenamiento
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="storageConditions">Condiciones de Almacenamiento</CFormLabel>
                    <CFormTextarea
                      id="storageConditions"
                      name="storageConditions"
                      value={formValues.storageConditions}
                      onChange={handleChange}
                      placeholder="Ej: Mantener entre 2°C y 8°C, proteger de la luz..."
                      rows="3"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="storageTemperature">Temperatura de Almacenamiento</CFormLabel>
                    <CFormInput
                      type="text"
                      id="storageTemperature"
                      name="storageTemperature"
                      value={formValues.storageTemperature}
                      onChange={handleChange}
                      placeholder="Ej: 2°C - 8°C (Refrigerado)"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Presentación */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilNotes} className="icon me-2" />
                Presentación
              </h6>
              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="unitMeasure">Unidad de Medida</CFormLabel>
                    <CFormInput
                      type="text"
                      id="unitMeasure"
                      name="unitMeasure"
                      value={formValues.unitMeasure}
                      onChange={handleChange}
                      placeholder="Ej: mg, mL, tabletas"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="unitsPerPresentation">Unidades por Presentación</CFormLabel>
                    <CFormInput
                      type="number"
                      id="unitsPerPresentation"
                      name="unitsPerPresentation"
                      value={formValues.unitsPerPresentation}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="status">Estado</CFormLabel>
                    <CFormSelect
                      id="status"
                      name="status"
                      value={formValues.status}
                      onChange={handleChange}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                      <option value="DESCONTINUADO">Descontinuado</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Botones */}
            <div className="d-flex gap-2 btn-group-responsive mt-4">
              <CButton color="primary" type="submit" disabled={submitting} className="register-btn-primary">
                {submitting ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Registrar Medicamento
                  </>
                )}
              </CButton>
              <CButton color="secondary" type="reset" className="register-btn-secondary">
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

export default MedicamentoRegistrar;