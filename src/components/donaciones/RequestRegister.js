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
  CFormCheck,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react'
import { cilSave, cilReload, cilClipboard, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/donaciones/RequestRegister.css'

const RequestRegister = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [medicamentos, setMedicamentos] = useState([])
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    medicamentoId: '',
    cantidad: '',
    prioridad: 'MEDIA',
    justificacion: ''
  })

  // Datos de ejemplo
  const proveedores = [
    { id: 1, nombre: 'Laboratorio Pfizer C.A.', rif: 'J-301234567', tipo: 'FARMACEUTICA' },
    { id: 2, nombre: 'Farmacias SAAS', rif: 'J-302345678', tipo: 'DISTRIBUIDORA' },
    { id: 3, nombre: 'Distribuidora Médica Unida', rif: 'J-303456789', tipo: 'DISTRIBUIDORA' },
    { id: 4, nombre: 'Ministerio de Salud', rif: 'G-200000001', tipo: 'GOBIERNO' },
    { id: 5, nombre: 'Fundación Ayuda Médica', rif: 'J-305678901', tipo: 'ONG' }
  ]

  const tiposSolicitud = [
    { id: 'EMERGENCIA', nombre: 'Emergencia' },
    { id: 'RUTINARIA', nombre: 'Rutinaria' },
    { id: 'PROYECTO', nombre: 'Proyecto Especial' },
    { id: 'REPOSICION', nombre: 'Reposición de Stock' }
  ]

  const medicamentosCatalogo = [
    { id: 1, nombre: 'Metformina 850mg', principioActivo: 'Metformina', concentracion: '850mg', presentacion: 'Tabletas' },
    { id: 2, nombre: 'Losartán 50mg', principioActivo: 'Losartán', concentracion: '50mg', presentacion: 'Tabletas' },
    { id: 3, nombre: 'Atorvastatina 20mg', principioActivo: 'Atorvastatina', concentracion: '20mg', presentacion: 'Tabletas' },
    { id: 4, nombre: 'Insulina Glargina', principioActivo: 'Insulina Glargina', concentracion: '100 UI/ml', presentacion: 'Inyectable' },
    { id: 5, nombre: 'Salbutamol Inhalador', principioActivo: 'Salbutamol', concentracion: '100 mcg/dosis', presentacion: 'Inhalador' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (medicamentos.length === 0) {
      setAlert({
        show: true,
        message: 'Debe agregar al menos un medicamento a la solicitud',
        type: 'danger'
      })
      return
    }
    
    console.log('Solicitud a proveedor enviada')
    
    setAlert({
      show: true,
      message: 'Solicitud registrada exitosamente',
      type: 'success'
    })
  }

  const handleReset = () => {
    setMedicamentos([])
    setNuevoMedicamento({
      medicamentoId: '',
      cantidad: '',
      prioridad: 'MEDIA',
      justificacion: ''
    })
    setAlert({ show: false, message: '', type: '' })
  }

  const agregarMedicamento = () => {
    if (!nuevoMedicamento.medicamentoId || !nuevoMedicamento.cantidad) {
      setAlert({
        show: true,
        message: 'Seleccione un medicamento y especifique la cantidad',
        type: 'warning'
      })
      return
    }

    const medicamentoSeleccionado = medicamentosCatalogo.find(
      m => m.id === parseInt(nuevoMedicamento.medicamentoId)
    )

    const medicamento = {
      id: Date.now(),
      medicamentoId: nuevoMedicamento.medicamentoId,
      nombre: medicamentoSeleccionado.nombre,
      principioActivo: medicamentoSeleccionado.principioActivo,
      concentracion: medicamentoSeleccionado.concentracion,
      presentacion: medicamentoSeleccionado.presentacion,
      cantidad: nuevoMedicamento.cantidad,
      prioridad: nuevoMedicamento.prioridad,
      justificacion: nuevoMedicamento.justificacion
    }

    setMedicamentos([...medicamentos, medicamento])
    
    // Resetear formulario de medicamento
    setNuevoMedicamento({
      medicamentoId: '',
      cantidad: '',
      prioridad: 'MEDIA',
      justificacion: ''
    })
  }

  const eliminarMedicamento = (id) => {
    setMedicamentos(medicamentos.filter(m => m.id !== id))
  }

  const calcularTotalMedicamentos = () => {
    return medicamentos.reduce((total, med) => total + parseInt(med.cantidad || 0), 0)
  }

  return (
    <div className="request-register-container">
      <CCard className="request-register-card">
        <CCardHeader>
          <h5 className="mb-0">
            <CIcon icon={cilClipboard} className="me-2" />
            Solicitar Medicamentos a Proveedores
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-4`}>
              {alert.message}
            </div>
          )}
          
          <CForm onSubmit={handleSubmit} onReset={handleReset}>
            {/* Información del Proveedor */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilClipboard} className="icon me-2" />
                Información del Proveedor
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="proveedorId" className="register-form-label">
                      Proveedor/Laboratorio *
                    </CFormLabel>
                    <CFormSelect id="proveedorId" name="proveedorId" className="register-form-select" required>
                      <option value="">Seleccione proveedor</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre} - {proveedor.rif} ({proveedor.tipo})
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="tipoSolicitud" className="register-form-label">
                      Tipo de Solicitud *
                    </CFormLabel>
                    <CFormSelect id="tipoSolicitud" name="tipoSolicitud" className="register-form-select" required>
                      <option value="">Seleccione tipo</option>
                      {tiposSolicitud.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Detalles de la Solicitud */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilClipboard} className="icon me-2" />
                Detalles de la Solicitud
              </h6>
              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="fechaSolicitud" className="register-form-label">
                      Fecha de Solicitud
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="fechaSolicitud"
                      name="fechaSolicitud"
                      className="register-form-input"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="fechaRequerida" className="register-form-label">
                      Fecha Requerida
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="fechaRequerida"
                      name="fechaRequerida"
                      className="register-form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="prioridadGeneral" className="register-form-label">
                      Prioridad General
                    </CFormLabel>
                    <CFormSelect id="prioridadGeneral" name="prioridadGeneral" className="register-form-select">
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="justificacionGeneral" className="register-form-label">
                      Justificación de la Solicitud
                    </CFormLabel>
                    <CFormTextarea
                      id="justificacionGeneral"
                      name="justificacionGeneral"
                      className="register-form-input"
                      rows="3"
                      placeholder="Justifique la necesidad de estos medicamentos..."
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            {/* Medicamentos Solicitados */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilClipboard} className="icon me-2" />
                Medicamentos Solicitados
                <span className="badge bg-primary ms-2">
                  {medicamentos.length} medicamentos | Total: {calcularTotalMedicamentos()} unidades
                </span>
              </h6>
              
              {/* Formulario para agregar medicamento */}
              <div className="border rounded p-3 mb-4">
                <h6>Agregar Medicamento</h6>
                <CRow className="g-3">
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="nuevoMedicamento" className="register-form-label">
                        Medicamento *
                      </CFormLabel>
                      <CFormSelect 
                        id="nuevoMedicamento"
                        className="register-form-select"
                        value={nuevoMedicamento.medicamentoId}
                        onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, medicamentoId: e.target.value})}
                      >
                        <option value="">Seleccione medicamento</option>
                        {medicamentosCatalogo.map(med => (
                          <option key={med.id} value={med.id}>
                            {med.nombre} ({med.principioActivo} {med.concentracion})
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="cantidad" className="register-form-label">
                        Cantidad *
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        id="cantidad"
                        className="register-form-input"
                        placeholder="Ej: 100"
                        min="1"
                        value={nuevoMedicamento.cantidad}
                        onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, cantidad: e.target.value})}
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="prioridadMed" className="register-form-label">
                        Prioridad
                      </CFormLabel>
                      <CFormSelect 
                        id="prioridadMed"
                        className="register-form-select"
                        value={nuevoMedicamento.prioridad}
                        onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, prioridad: e.target.value})}
                      >
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                        <option value="CRITICA">Crítica</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={2} className="d-flex align-items-end">
                    <CButton 
                      color="primary" 
                      onClick={agregarMedicamento}
                      className="w-100"
                    >
                      <CIcon icon={cilPlus} className="me-1" />
                      Agregar
                    </CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="justificacionMed" className="register-form-label">
                        Justificación Específica
                      </CFormLabel>
                      <CFormTextarea
                        id="justificacionMed"
                        className="register-form-input"
                        rows="2"
                        placeholder="Justifique la necesidad específica de este medicamento..."
                        value={nuevoMedicamento.justificacion}
                        onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, justificacion: e.target.value})}
                      />
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Tabla de medicamentos agregados */}
              {medicamentos.length > 0 ? (
                <div className="table-responsive">
                  <CTable hover bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Medicamento</CTableHeaderCell>
                        <CTableHeaderCell>Principio Activo</CTableHeaderCell>
                        <CTableHeaderCell>Concentración</CTableHeaderCell>
                        <CTableHeaderCell>Presentación</CTableHeaderCell>
                        <CTableHeaderCell>Cantidad</CTableHeaderCell>
                        <CTableHeaderCell>Prioridad</CTableHeaderCell>
                        <CTableHeaderCell>Justificación</CTableHeaderCell>
                        <CTableHeaderCell>Acciones</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {medicamentos.map(med => (
                        <CTableRow key={med.id}>
                          <CTableDataCell>{med.nombre}</CTableDataCell>
                          <CTableDataCell>{med.principioActivo}</CTableDataCell>
                          <CTableDataCell>{med.concentracion}</CTableDataCell>
                          <CTableDataCell>{med.presentacion}</CTableDataCell>
                          <CTableDataCell>
                            <span className="badge bg-primary">{med.cantidad}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span className={`badge ${
                              med.prioridad === 'CRITICA' ? 'bg-danger' :
                              med.prioridad === 'ALTA' ? 'bg-warning' :
                              med.prioridad === 'MEDIA' ? 'bg-info' : 'bg-secondary'
                            }`}>
                              {med.prioridad}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <small>{med.justificacion || 'Sin justificación específica'}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton 
                              color="danger" 
                              size="sm"
                              onClick={() => eliminarMedicamento(med.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              ) : (
                <div className="alert alert-info text-center">
                  No hay medicamentos agregados a la solicitud. Use el formulario arriba para agregar medicamentos.
                </div>
              )}
            </div>

            {/* Información de Seguimiento */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilClipboard} className="icon me-2" />
                Información de Seguimiento
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="responsableSolicitud" className="register-form-label">
                      Responsable de la Solicitud *
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="responsableSolicitud"
                      name="responsableSolicitud"
                      className="register-form-input"
                      placeholder="Nombre del responsable"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="departamento" className="register-form-label">
                      Departamento
                    </CFormLabel>
                    <CFormSelect id="departamento" name="departamento" className="register-form-select">
                      <option value="">Seleccione departamento</option>
                      <option value="FARMACIA">Farmacia</option>
                      <option value="ALMACEN">Almacén</option>
                      <option value="ADMINISTRACION">Administración</option>
                      <option value="DIRECCION">Dirección</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="estadoSolicitud" className="register-form-label">
                      Estado Inicial
                    </CFormLabel>
                    <CFormSelect id="estadoSolicitud" name="estadoSolicitud" className="register-form-select">
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="ENVIADA">Enviada</option>
                      <option value="EN_REVISION">En Revisión</option>
                      <option value="APROBADA_INTERNA">Aprobada Internamente</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="observaciones" className="register-form-label">
                      Observaciones Finales
                    </CFormLabel>
                    <CFormTextarea
                      id="observaciones"
                      name="observaciones"
                      className="register-form-input"
                      rows="2"
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </CCol>
              </CRow>
            </div>

            <div className="d-flex gap-2 btn-group-responsive mt-4">
              <CButton 
                color="primary" 
                type="submit"
                className="register-btn-primary"
                disabled={medicamentos.length === 0}
              >
                <CIcon icon={cilSave} className="me-2" />
                Registrar Solicitud a Proveedor
              </CButton>
              <CButton 
                color="secondary" 
                type="reset"
                className="register-btn-secondary"
              >
                <CIcon icon={cilReload} className="me-2" />
                Limpiar Todo
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default RequestRegister