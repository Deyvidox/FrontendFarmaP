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
  CFormTextarea
} from '@coreui/react'
import { cilSave, cilReload, cilTruck } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/entregas/DeliveryRegister.css'

const DeliveryRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulario de entrega enviado')
    
    setAlert({
      show: true,
      message: 'Entrega registrada exitosamente',
      type: 'success'
    })
  }

  const handleReset = () => {
    setAlert({ show: false, message: '', type: '' })
  }

  return (
    <div className="delivery-register-container">
      <CCard className="delivery-register-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilTruck} className="me-2" />
            Registrar Nueva Entrega
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-4`}>
              {alert.message}
            </div>
          )}
          
          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Información de la Solicitud */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilTruck} className="icon me-2" />
                Información de la Solicitud
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="SolicitudID" className="register-form-label">
                      Solicitud Asociada *
                    </CFormLabel>
                    <CFormSelect id="SolicitudID" name="SolicitudID" className="register-form-select">
                      <option value="">Seleccione solicitud</option>
                      <option value="1">SOL-2024-001 - María González</option>
                      <option value="2">SOL-2024-002 - José Rodríguez</option>
                      <option value="3">SOL-2024-003 - Ana Martínez</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="UsuarioEntregaID" className="register-form-label">
                      Responsable de Entrega *
                    </CFormLabel>
                    <CFormSelect id="UsuarioEntregaID" name="UsuarioEntregaID" className="register-form-select">
                      <option value="">Seleccione responsable</option>
                      <option value="1">Carlos López - Coordinador</option>
                      <option value="2">Ana García - Voluntaria</option>
                      <option value="3">Pedro Martínez - Conductor</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Información de la Entrega */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilTruck} className="icon me-2" />
                Detalles de la Entrega
              </h6>
              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntFechaEntrega" className="register-form-label">
                      Fecha Entrega *
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="EntFechaEntrega"
                      name="EntFechaEntrega"
                      className="register-form-input"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntTipoEntrega" className="register-form-label">
                      Tipo de Entrega
                    </CFormLabel>
                    <CFormSelect id="EntTipoEntrega" name="EntTipoEntrega" className="register-form-select">
                      <option value="DOMICILIO">A Domicilio</option>
                      <option value="CENTRO_SALUD">Centro de Salud</option>
                      <option value="JORNADA">Jornada Comunitaria</option>
                      <option value="RETIRO">Retiro en Sede</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntEstado" className="register-form-label">
                      Estado
                    </CFormLabel>
                    <CFormSelect id="EntEstado" name="EntEstado" className="register-form-select">
                      <option value="PROGRAMADA">Programada</option>
                      <option value="EN_CAMINO">En Camino</option>
                      <option value="ENTREGADA">Entregada</option>
                      <option value="CANCELADA">Cancelada</option>
                      <option value="PENDIENTE">Pendiente</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntPuntoEntrega" className="register-form-label">
                      Punto de Entrega
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="EntPuntoEntrega"
                      name="EntPuntoEntrega"
                      className="register-form-input"
                      placeholder="Dirección o lugar específico"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntTestigoEntrega" className="register-form-label">
                      Testigo/Receptor
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="EntTestigoEntrega"
                      name="EntTestigoEntrega"
                      className="register-form-input"
                      placeholder="Nombre del testigo o receptor"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntProximaEntregaEstimada" className="register-form-label">
                      Próxima Entrega Estimada
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="EntProximaEntregaEstimada"
                      name="EntProximaEntregaEstimada"
                      className="register-form-input"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntFirmaDigital" className="register-form-label">
                      Firma Digital/Comprobante
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="EntFirmaDigital"
                      name="EntFirmaDigital"
                      className="register-form-input"
                      placeholder="Código o referencia de firma"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="EntObservaciones" className="register-form-label">
                      Observaciones
                    </CFormLabel>
                    <CFormTextarea
                      id="EntObservaciones"
                      name="EntObservaciones"
                      className="register-form-input"
                      rows="3"
                      placeholder="Observaciones de la entrega..."
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Sección de Medicamentos a Entregar */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilTruck} className="icon me-2" />
                Medicamentos a Entregar
              </h6>
              <div className="alert alert-info mb-3">
                <small>Los medicamentos se seleccionarán en el siguiente paso después de registrar la entrega básica.</small>
              </div>
              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel className="register-form-label">
                      Lista de Lotes Disponibles
                    </CFormLabel>
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Ejemplo: Lote #LOT-001 - Paracetamol 500mg (50 unidades disponibles)<br/>
                        Ejemplo: Lote #LOT-002 - Metformina 850mg (30 unidades disponibles)
                      </small>
                    </div>
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
                Registrar Entrega
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

export default DeliveryRegister