import React, { useState, useEffect } from 'react'
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
import { getProviders, getMedicines, createProviderRequest } from '../../services/api'
import HelpButton from '../common/HelpButton'
import ToastNotification from '../common/ToastNotification'

const RequestRegister = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type });
    setTimeout(() => setToast({ show: true, message, type }), 20);
  };
  
  // Opciones desde API
  const [proveedores, setProveedores] = useState([])
  const [medicamentosCatalogo, setMedicamentosCatalogo] = useState([])

  // Estado del formulario principal
  const [formData, setFormData] = useState({
    provider_id: '',
    request_type: '',
    request_date: new Date().toISOString().split('T')[0],
    required_date: '',
    general_priority: 'MEDIA',
    general_justification: '',
    responsible_name: '',
    department: '',
    status: 'PENDIENTE',
    observations: ''
  })

  // Estado de los medicamentos agregados
  const [medicamentos, setMedicamentos] = useState([])
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    medicamentoId: '',
    cantidad: '',
    prioridad: 'MEDIA',
    justificacion: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provRes = await getProviders()
        if (provRes?.message?.providers) {
          setProveedores(provRes.message.providers)
        }
        const medRes = await getMedicines()
        if (medRes?.message?.medicines) {
          setMedicamentosCatalogo(medRes.message.medicines)
        }
      } catch (error) {
        console.error('Error cargando catálogos:', error)
        showToast('Error al cargar los catálogos. Verifique su conexión.', 'danger')
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (medicamentos.length === 0) {
      showToast('Debe agregar al menos un medicamento a la solicitud', 'danger')
      return
    }

    try {
      const payload = {
        ...formData,
        medicines: medicamentos.map(m => ({
          medicine_id: m.medicamentoId,
          quantity: parseInt(m.cantidad),
          priority: m.prioridad,
          justification: m.justificacion
        }))
      }

      await createProviderRequest(payload)
      
      showToast('Solicitud registrada exitosamente', 'success')
      handleReset()
    } catch (error) {
      showToast(error.message || 'Error al registrar la solicitud', 'danger')
    }
  }

  const handleReset = () => {
    setFormData({
      provider_id: '',
      request_type: '',
      request_date: new Date().toISOString().split('T')[0],
      required_date: '',
      general_priority: 'MEDIA',
      general_justification: '',
      responsible_name: '',
      department: '',
      status: 'PENDIENTE',
      observations: ''
    })
    setMedicamentos([])
    setNuevoMedicamento({
      medicamentoId: '',
      cantidad: '',
      prioridad: 'MEDIA',
      justificacion: ''
    })
  }

  const agregarMedicamento = () => {
    if (!nuevoMedicamento.medicamentoId || !nuevoMedicamento.cantidad) {
      showToast('Seleccione un medicamento y especifique la cantidad', 'warning')
      return
    }

    const medicamentoSeleccionado = medicamentosCatalogo.find(
      m => m.id === nuevoMedicamento.medicamentoId
    )

    const medicamento = {
      id: Date.now(),
      medicamentoId: nuevoMedicamento.medicamentoId,
      nombre: medicamentoSeleccionado?.commercial_name || 'Desconocido',
      principioActivo: medicamentoSeleccionado?.active_principle || '',
      concentracion: medicamentoSeleccionado?.concentration || '',
      presentacion: medicamentoSeleccionado?.pharmaceutical_form || '',
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
          <h5 className="mb-0 d-flex align-items-center">
            <CIcon icon={cilClipboard} className="me-2" />
            Solicitar Medicamentos a Proveedores
            <HelpButton title="Manual de Usuario – Nueva Solicitud a Proveedor">
              <div>
                <p>Crea una nueva solicitud (orden de compra) de medicamentos a un proveedor.</p>
                <h6>Formulario de Solicitud</h6>
                <div className="card p-3 mb-3 bg-light">
                  <div className="row g-2 small">
                    <div className="col-md-6"><span className="fw-bold">(1) Proveedor *</span><br/>Seleccione...</div>
                    <div className="col-md-6"><span className="fw-bold">(2) Tipo *</span><br/>Emergencia / Rutinaria</div>
                    <div className="col-12"><span className="fw-bold">(3) Justificación / Notas</span><br/>Para campaña de vacunación...</div>
                    <div className="col-12 mt-3"><span className="fw-bold">(4) Medicamentos Solicitados</span><br/><button className="btn btn-sm border">Añadir Artículo</button></div>
                    <div className="col-md-6 mt-3"><span className="fw-bold">(5) Solicitante</span><br/>Dr. López</div>
                  </div>
                </div>
                <ol>
                  <li><strong>Proveedor:</strong> Selecciona el laboratorio/distribuidora. (Cargado de catálogos).</li>
                  <li><strong>Tipo:</strong> Define la prioridad (Emergencia o Rutinaria).</li>
                  <li><strong>Justificación:</strong> Motivo de la solicitud (Opcional pero recomendado).</li>
                  <li><strong>Medicamentos Solicitados:</strong> Agrega los ítems que requieres, indicando cantidades específicas.</li>
                  <li><strong>Solicitante:</strong> Persona o departamento que hace el requerimiento.</li>
                </ol>
                <p className="text-muted"><em>Al guardar, la solicitud quedará en estado "Pendiente" en la bandeja principal.</em></p>
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

          <CForm onSubmit={handleSubmit}>
            {/* Información del Proveedor */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilClipboard} className="icon me-2" />
                Información del Proveedor
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="provider_id" className="register-form-label">
                      Proveedor/Laboratorio *
                    </CFormLabel>
                    <CFormSelect 
                      id="provider_id" 
                      name="provider_id" 
                      className="register-form-select" 
                      required
                      value={formData.provider_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione proveedor</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor.id} value={proveedor.id}>
                          {proveedor.name} - {proveedor.rif_cedula}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="request_type" className="register-form-label">
                      Tipo de Solicitud *
                    </CFormLabel>
                    <CFormSelect 
                      id="request_type" 
                      name="request_type" 
                      className="register-form-select" 
                      required
                      value={formData.request_type}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="EMERGENCIA">Emergencia</option>
                      <option value="RUTINARIA">Rutinaria</option>
                      <option value="PROYECTO">Proyecto Especial</option>
                      <option value="REPOSICION">Reposición de Stock</option>
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
                    <CFormLabel htmlFor="request_date" className="register-form-label">
                      Fecha de Solicitud
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="request_date"
                      name="request_date"
                      className="register-form-input"
                      value={formData.request_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="required_date" className="register-form-label">
                      Fecha Requerida
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="required_date"
                      name="required_date"
                      className="register-form-input"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.required_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="general_priority" className="register-form-label">
                      Prioridad General
                    </CFormLabel>
                    <CFormSelect 
                      id="general_priority" 
                      name="general_priority" 
                      className="register-form-select"
                      value={formData.general_priority}
                      onChange={handleInputChange}
                    >
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
                    <CFormLabel htmlFor="general_justification" className="register-form-label">
                      Justificación de la Solicitud
                    </CFormLabel>
                    <CFormTextarea
                      id="general_justification"
                      name="general_justification"
                      className="register-form-input"
                      rows="3"
                      placeholder="Justifique la necesidad de estos medicamentos..."
                      value={formData.general_justification}
                      onChange={handleInputChange}
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
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, medicamentoId: e.target.value })}
                      >
                        <option value="">Seleccione medicamento</option>
                        {medicamentosCatalogo.map(med => (
                          <option key={med.id} value={med.id}>
                            {med.commercial_name} ({med.active_principle} {med.concentration})
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
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, cantidad: e.target.value })}
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
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, prioridad: e.target.value })}
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
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, justificacion: e.target.value })}
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
                            <span className={`badge ${med.prioridad === 'CRITICA' ? 'bg-danger' :
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
                    <CFormLabel htmlFor="responsible_name" className="register-form-label">
                      Responsable de la Solicitud *
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="responsible_name"
                      name="responsible_name"
                      className="register-form-input"
                      placeholder="Nombre del responsable"
                      required
                      value={formData.responsible_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="department" className="register-form-label">
                      Departamento
                    </CFormLabel>
                    <CFormSelect 
                      id="department" 
                      name="department" 
                      className="register-form-select"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
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
                    <CFormLabel htmlFor="status" className="register-form-label">
                      Estado Inicial
                    </CFormLabel>
                    <CFormSelect 
                      id="status" 
                      name="status" 
                      className="register-form-select"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="ENVIADA">Enviada</option>
                      <option value="EN_REVISION">En Revisión</option>
                      <option value="APROBADA_INTERNA">Aprobada Internamente</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="observations" className="register-form-label">
                      Observaciones Finales
                    </CFormLabel>
                    <CFormTextarea
                      id="observations"
                      name="observations"
                      className="register-form-input"
                      rows="2"
                      placeholder="Observaciones adicionales..."
                      value={formData.observations}
                      onChange={handleInputChange}
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
                type="button"
                onClick={handleReset}
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