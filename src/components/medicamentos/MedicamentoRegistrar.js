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
  CButton,
  CFormTextarea,
  CInputGroup,
  CInputGroupText
} from '@coreui/react'
import { 
  cilMedicalCross, 
  cilSave, 
  cilReload,
  cilFactory,
  cilNotes,
  cilCalendar,
  cilUser
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/medicamentos/Medicamentos.css'

const MedicamentoRegistrar = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Medicamento registrado (simulado)')
    
    setAlert({
      show: true,
      message: 'Medicamento registrado exitosamente',
      type: 'success'
    })
  }

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' })
  }

  // Datos quemados para selects
  const formasFarmaceuticas = [
    'Tableta', 'Cápsula', 'Jarabe', 'Inyectable', 'Crema', 'Ungüento', 
    'Supositorio', 'Gotas', 'Suspensión', 'Polvo', 'Inhalador'
  ]

  const categoriasMedicamentos = [
    'Analgésico', 'Antibiótico', 'Antihipertensivo', 'Antidiabético',
    'Antialérgico', 'Antiinflamatorio', 'Psiquiátrico', 'Cardiovascular',
    'Gastrointestinal', 'Dermatológico', 'Oftalmológico', 'Oncológico'
  ]

  const laboratorios = [
    'Pfizer', 'Roche', 'Novartis', 'Merck', 'GSK', 'Sanofi',
    'AstraZeneca', 'Bayer', 'Abbott', 'Johnson & Johnson'
  ]

  const viasAdministracion = [
    'Oral', 'Intravenosa', 'Intramuscular', 'Subcutánea', 'Tópica',
    'Rectal', 'Vaginal', 'Oftálmica', 'Ótica', 'Nasal', 'Inhalatoria'
  ]

  const unidadesMedida = [
    'mg', 'g', 'mL', 'L', 'unidad', 'frasco', 'ampolla', 'jeringa'
  ]

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
            <div className={`alert alert-${alert.type} mb-4`}>
              {alert.message}
            </div>
          )}
          
          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Información Básica */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon me-2" />
                Información Básica
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedCodigoNacional" className="register-form-label">
                      Código Nacional
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="MedCodigoNacional"
                      name="MedCodigoNacional"
                      className="register-form-input"
                      placeholder="Código nacional del medicamento"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedNombreComercial" className="register-form-label">
                      Nombre Comercial
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="MedNombreComercial"
                      name="MedNombreComercial"
                      className="register-form-input"
                      placeholder="Nombre comercial del medicamento"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedNombreGenerico" className="register-form-label">
                      Nombre Genérico
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="MedNombreGenerico"
                      name="MedNombreGenerico"
                      className="register-form-input"
                      placeholder="Nombre genérico (principio activo)"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedPrincipioActivo" className="register-form-label">
                      Principio Activo
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="MedPrincipioActivo"
                      name="MedPrincipioActivo"
                      className="register-form-input"
                      placeholder="Principio activo principal"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedConcentracion" className="register-form-label">
                      Concentración
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="text"
                        id="MedConcentracion"
                        name="MedConcentracion"
                        className="register-form-input"
                        placeholder="500"
                      />
                      <CInputGroupText className="register-form-input">
                        mg/mL
                      </CInputGroupText>
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="FormaFarmaceuticaID" className="register-form-label">
                      Forma Farmacéutica
                    </CFormLabel>
                    <CFormSelect id="FormaFarmaceuticaID" name="FormaFarmaceuticaID" className="register-form-select">
                      <option value="">Seleccionar forma</option>
                      {formasFarmaceuticas.map((forma, index) => (
                        <option key={index} value={forma}>{forma}</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedViaAdministracion" className="register-form-label">
                      Vía de Administración
                    </CFormLabel>
                    <CFormSelect id="MedViaAdministracion" name="MedViaAdministracion" className="register-form-select">
                      <option value="">Seleccionar vía</option>
                      {viasAdministracion.map((via, index) => (
                        <option key={index} value={via}>{via}</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Información del Fabricante */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilFactory} className="icon me-2" />
                Información del Fabricante
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="LaboratorioID" className="register-form-label">
                      Laboratorio
                    </CFormLabel>
                    <CFormSelect id="LaboratorioID" name="LaboratorioID" className="register-form-select">
                      <option value="">Seleccionar laboratorio</option>
                      {laboratorios.map((lab, index) => (
                        <option key={index} value={lab}>{lab}</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedRegistroSanitario" className="register-form-label">
                      Registro Sanitario
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="MedRegistroSanitario"
                      name="MedRegistroSanitario"
                      className="register-form-input"
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
                    <CFormLabel htmlFor="CategoriaMedicamentoID" className="register-form-label">
                      Categoría
                    </CFormLabel>
                    <CFormSelect id="CategoriaMedicamentoID" name="CategoriaMedicamentoID" className="register-form-select">
                      <option value="">Seleccionar categoría</option>
                      {categoriasMedicamentos.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedRequiereReceta" className="register-form-label">
                      Requiere Receta
                    </CFormLabel>
                    <CFormSelect id="MedRequiereReceta" name="MedRequiereReceta" className="register-form-select">
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
                <CIcon icon={cilUser} className="icon me-2" />
                Almacenamiento
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedCondicionesAlmacenamiento" className="register-form-label">
                      Condiciones de Almacenamiento
                    </CFormLabel>
                    <CFormTextarea
                      id="MedCondicionesAlmacenamiento"
                      name="MedCondicionesAlmacenamiento"
                      className="register-form-input"
                      placeholder="Ej: Mantener entre 2°C y 8°C, proteger de la luz..."
                      rows="3"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedTemperaturaAlmacenamiento" className="register-form-label">
                      Temperatura de Almacenamiento
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="MedTemperaturaAlmacenamiento"
                      name="MedTemperaturaAlmacenamiento"
                      className="register-form-input"
                      placeholder="Ej: 2°C - 8°C (Refrigerado)"
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Presentación */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilUser} className="icon me-2" />
                Presentación
              </h6>
              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedUnidadMedida" className="register-form-label">
                      Unidad de Medida
                    </CFormLabel>
                    <CFormSelect id="MedUnidadMedida" name="MedUnidadMedida" className="register-form-select">
                      <option value="">Seleccionar unidad</option>
                      {unidadesMedida.map((unidad, index) => (
                        <option key={index} value={unidad}>{unidad}</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedCantidadPorPresentacion" className="register-form-label">
                      Cantidad por Presentación
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      id="MedCantidadPorPresentacion"
                      name="MedCantidadPorPresentacion"
                      className="register-form-input"
                      placeholder="Ej: 30"
                      min="1"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="MedEstado" className="register-form-label">
                      Estado
                    </CFormLabel>
                    <CFormSelect id="MedEstado" name="MedEstado" className="register-form-select">
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
              <CButton 
                color="primary" 
                type="submit"
                className="register-btn-primary"
              >
                <CIcon icon={cilSave} className="me-2" />
                Registrar Medicamento
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

export default MedicamentoRegistrar