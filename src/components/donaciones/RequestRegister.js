import React, { useState, useEffect, useMemo } from 'react'
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
  CTableDataCell,
  CSpinner
} from '@coreui/react'
import { cilSave, cilReload, cilClipboard, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/donaciones/RequestRegister.css'
import { getProviders, getMedicines, createProviderRequest } from '../../services/api'
import HelpButton from '../common/HelpButton'
import ToastNotification from '../common/ToastNotification'

const RequestRegister = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type });
    setTimeout(() => setToast({ show: true, message, type }), 20);
  };

  // Opciones desde API
  const [proveedores, setProveedores] = useState([])
  const [medicamentosCatalogo, setMedicamentosCatalogo] = useState([])

  // Fecha de hoy para validaciones
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Estado del formulario principal
  const [formData, setFormData] = useState({
    provider_id: '',
    request_type: '',
    request_date: new Date().toISOString().split('T')[0],
    required_date: '',
    document_number: '',
    general_priority: 'MEDIA',
    general_justification: '',
    responsible_name: '',
    department: '',
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
        const [provRes, medRes] = await Promise.all([
          getProviders(),
          getMedicines().catch(() => null)
        ])
        if (provRes?.message?.providers) {
          setProveedores(provRes.message.providers)
        }
        if (medRes?.message?.medicines) {
          setMedicamentosCatalogo(medRes.message.medicines)
        }
      } catch (error) {
        console.error('Error cargando catálogos:', error)
        showToast('Error al cargar los catálogos. Verifique su conexión.', 'danger')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.provider_id) {
      showToast('Seleccione un proveedor / ente gubernamental', 'warning')
      return
    }
    if (!formData.request_type) {
      showToast('Seleccione el tipo de solicitud', 'warning')
      return
    }
    if (!formData.responsible_name.trim()) {
      showToast('Ingrese el nombre del responsable de la solicitud', 'warning')
      return
    }

    // Validar fecha requerida >= fecha solicitud
    if (formData.required_date && formData.request_date) {
      const reqDate = new Date(formData.required_date + 'T00:00:00')
      const solDate = new Date(formData.request_date + 'T00:00:00')
      if (reqDate < solDate) {
        showToast('La Fecha Requerida no puede ser anterior a la Fecha de Solicitud', 'warning')
        return
      }
    }

    if (medicamentos.length === 0) {
      showToast('Debe agregar al menos un medicamento a la solicitud', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        provider_id: formData.provider_id,
        request_type: formData.request_type,
        request_date: formData.request_date,
        required_date: formData.required_date || null,
        document_number: formData.document_number || null,
        general_priority: formData.general_priority,
        general_justification: formData.general_justification || null,
        responsible_name: formData.responsible_name,
        department: formData.department || null,
        status: 'PENDIENTE',
        observations: formData.observations || null,
        medicines: medicamentos.map(m => ({
          medicine_id: m.medicamentoId,
          quantity: parseInt(m.cantidad),
          priority: m.prioridad,
          justification: m.justificacion || null
        }))
      }

      await createProviderRequest(payload)
      showToast('Solicitud registrada exitosamente', 'success')
      handleReset()
    } catch (error) {
      showToast(error.message || 'Error al registrar la solicitud', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      provider_id: '',
      request_type: '',
      request_date: new Date().toISOString().split('T')[0],
      required_date: '',
      document_number: '',
      general_priority: 'MEDIA',
      general_justification: '',
      responsible_name: '',
      department: '',
      observations: ''
    })
    setMedicamentos([])
    setNuevoMedicamento({
      medicamentoId: '',
      cantidad: '',
      prioridad: 'MEDIA',
      justificacion: ''
    })
    setToast({ show: false, message: '', type: 'info' })
  }

  const agregarMedicamento = () => {
    if (!nuevoMedicamento.medicamentoId || !nuevoMedicamento.cantidad) {
      showToast('Seleccione un medicamento y especifique la cantidad', 'warning')
      return
    }

    const qty = parseInt(nuevoMedicamento.cantidad)
    if (isNaN(qty) || qty <= 0) {
      showToast('La cantidad debe ser mayor a 0', 'warning')
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

  const getPrioridadColor = (p) => {
    switch (p) {
      case 'CRITICA': return 'bg-danger'
      case 'URGENTE': return 'bg-danger'
      case 'ALTA': return 'bg-warning text-dark'
      case 'MEDIA': return 'bg-info text-dark'
      case 'BAJA': return 'bg-secondary'
      default: return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando formulario...</span>
      </div>
    )
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
                <p><strong>¿Qué hace esta pantalla?</strong><br />
                  Crea una solicitud formal de medicamentos dirigida a un proveedor, laboratorio o ente gubernamental.</p>
                <h6>📋 Campos principales</h6>
                <ol>
                  <li><strong>Proveedor / Ente *:</strong> Seleccione de la lista de proveedores registrados.</li>
                  <li><strong>N° de Oficio / Documento:</strong> Número de oficio o referencia del documento físico enviado (Ej: OFI-2026-001).</li>
                  <li><strong>Tipo de Solicitud *:</strong> Nueva, Renovación o Emergencia.</li>
                  <li><strong>Fechas:</strong> La Fecha Requerida no puede ser anterior a la Fecha de Solicitud.</li>
                  <li><strong>Medicamentos Solicitados *:</strong> Agregue cada medicamento con cantidad, prioridad y justificación médica.</li>
                  <li><strong>Responsable *:</strong> Persona que autoriza la solicitud.</li>
                </ol>
                <p><strong>⚠️ Importante:</strong> La solicitud se crea en estado PENDIENTE. Los cambios de estado se gestionan desde la lista de solicitudes.</p>
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
                Proveedor / Ente Gubernamental
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="provider_id" className="register-form-label">
                      Proveedor / Ente *
                    </CFormLabel>
                    <CFormSelect
                      id="provider_id"
                      name="provider_id"
                      className="register-form-select"
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
                <CCol md={3}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="request_type" className="register-form-label">
                      Tipo de Solicitud *
                    </CFormLabel>
                    <CFormSelect
                      id="request_type"
                      name="request_type"
                      className="register-form-select"
                      value={formData.request_type}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="RUTINARIA">Rutinaria</option>
                      <option value="EMERGENCIA">Emergencia</option>
                      <option value="REPOSICION">Reposición</option>
                      <option value="PROYECTO">Proyecto</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="document_number" className="register-form-label">
                      N° de Oficio / Documento
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="document_number"
                      name="document_number"
                      className="register-form-input"
                      placeholder="Ej: OFI-2026-001"
                      value={formData.document_number}
                      onChange={handleInputChange}
                    />
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
                <CCol md={3}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="request_date" className="register-form-label">
                      Fecha de Solicitud *
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
                <CCol md={3}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="required_date" className="register-form-label">
                      Fecha Requerida
                    </CFormLabel>
                    <CFormInput
                      type="date"
                      id="required_date"
                      name="required_date"
                      className="register-form-input"
                      min={formData.request_date || todayStr}
                      value={formData.required_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </CCol>
                <CCol md={3}>
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
                      <option value="CRITICA">Crítica</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={3}>
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
                    <CFormLabel htmlFor="responsible_name" className="register-form-label">
                      Responsable de la Solicitud *
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="responsible_name"
                      name="responsible_name"
                      className="register-form-input"
                      placeholder="Nombre del responsable"
                      value={formData.responsible_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="general_justification" className="register-form-label">
                      Justificación Institucional
                    </CFormLabel>
                    <CFormTextarea
                      id="general_justification"
                      name="general_justification"
                      className="register-form-input"
                      rows="2"
                      placeholder="Justifique la necesidad de estos medicamentos..."
                      value={formData.general_justification}
                      onChange={handleInputChange}
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="observations" className="register-form-label">
                      Observaciones
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

            {/* Medicamentos Solicitados */}
            <div className="form-section">
              <h6 className="section-title">
                <CIcon icon={cilClipboard} className="icon me-2" />
                Medicamentos Solicitados
                <span className="badge bg-primary ms-2">
                  {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} | Total: {calcularTotalMedicamentos()} unidades
                </span>
              </h6>

              {/* Formulario para agregar medicamento */}
              <div className="border rounded p-3 mb-4" style={{ borderColor: 'var(--cui-border-color)' }}>
                <h6>Agregar Medicamento</h6>
                <CRow className="g-3">
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="register-form-label">Medicamento *</CFormLabel>
                      <CFormSelect
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
                  <CCol md={2}>
                    <div className="mb-3">
                      <CFormLabel className="register-form-label">Cantidad *</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="Ej: 100"
                        min="1"
                        value={nuevoMedicamento.cantidad}
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, cantidad: e.target.value })}
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel className="register-form-label">Prioridad</CFormLabel>
                      <CFormSelect
                        value={nuevoMedicamento.prioridad}
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, prioridad: e.target.value })}
                      >
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                        <option value="URGENTE">Urgente</option>
                        <option value="CRITICA">Crítica</option>
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel className="register-form-label">Justificación Médica</CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Motivo específico..."
                        value={nuevoMedicamento.justificacion}
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, justificacion: e.target.value })}
                      />
                    </div>
                  </CCol>
                  <CCol md={12} className="text-end">
                    <CButton color="primary" onClick={agregarMedicamento}>
                      <CIcon icon={cilPlus} className="me-1" /> Agregar Medicamento
                    </CButton>
                  </CCol>
                </CRow>
              </div>

              {/* Tabla de medicamentos agregados */}
              {medicamentos.length > 0 ? (
                <CTable hover bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Medicamento</CTableHeaderCell>
                      <CTableHeaderCell>Principio Activo</CTableHeaderCell>
                      <CTableHeaderCell>Concentración</CTableHeaderCell>
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
                        <CTableDataCell>
                          <span className="badge bg-primary">{med.cantidad}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className={`badge ${getPrioridadColor(med.prioridad)}`}>
                            {med.prioridad}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <small>{med.justificacion || 'Sin justificación específica'}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" size="sm" onClick={() => eliminarMedicamento(med.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="alert alert-info text-center">
                  No hay medicamentos agregados a la solicitud. Use el formulario arriba para agregar medicamentos.
                </div>
              )}
            </div>

            <div className="d-flex gap-2 btn-group-responsive mt-4">
              <CButton color="primary" type="submit" className="register-btn-primary" disabled={submitting || medicamentos.length === 0}>
                {submitting ? <><CSpinner size="sm" className="me-2" /> Registrando...</> : <><CIcon icon={cilSave} className="me-2" /> Registrar Solicitud</>}
              </CButton>
              <CButton color="secondary" type="button" onClick={handleReset} className="register-btn-secondary">
                <CIcon icon={cilReload} className="me-2" /> Limpiar Todo
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default RequestRegister
