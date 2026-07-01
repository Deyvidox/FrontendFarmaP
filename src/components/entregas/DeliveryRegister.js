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
  CAlert,
  CSpinner
} from '@coreui/react'
import { cilSave, cilReload, cilTruck } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { createDelivery, getRequests, getUsers, getMedicines } from '../../services/api'
import HelpButton from '../common/HelpButton'
import '../../css/entregas/DeliveryRegister.css'

// Mapeo tipos de entrega: label visible → valor que espera la API
const DELIVERY_TYPES = [
  { label: 'A Domicilio',          value: 'HomeDelivery' },
  { label: 'Centro de Salud',      value: 'HealthCenter' },
  { label: 'Jornada Comunitaria',  value: 'Community' },
  { label: 'Retiro en Sede',       value: 'Pickup' },
]

// Mapeo estados: label visible → valor que espera la API
const DELIVERY_STATUSES = [
  { label: 'Programada',  value: 'Scheduled' },
  { label: 'En Camino',   value: 'OnTheWay' },
  { label: 'Entregada',   value: 'Delivered' },
  { label: 'Cancelada',   value: 'Cancelled' },
  { label: 'Pendiente',   value: 'Pending' },
]

const INITIAL_FORM = {
  supply_request_id: '',
  delivery_user_id: '',
  delivery_date: '',
  delivery_type: 'HomeDelivery',
  delivery_point: '',
  witness_receptor: '',
  next_estimated_delivery: '',
  digital_signature: '',
  observations: '',
  status: 'Scheduled',
}

const DeliveryRegister = () => {
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const [submitting, setSubmitting] = useState(false)

  // Catálogos
  const [requests, setRequests] = useState([])
  const [users, setUsers] = useState([])
  const [medicines, setMedicines] = useState([])
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [loadingCatalogs, setLoadingCatalogs] = useState(true)

  // Cargar solicitudes, usuarios y medicamentos
  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true)
      try {
        const [reqRes, userRes, medRes] = await Promise.all([
          getRequests(),
          getUsers(),
          getMedicines(),
        ])
        // Extraer arrays de la respuesta del backend
        const reqList = reqRes?.message?.requests || []
        const userList = userRes?.message?.users || []
        const medList = medRes?.message?.medicines || []
        setRequests(reqList)
        setUsers(userList.filter(u => u.status === 'Active'))
        setMedicines(medList)
      } catch (err) {
        console.error('Error cargando catálogos:', err)
        setAlert({
          show: true,
          message: 'Error al cargar catálogos. Verifique la conexión al servidor.',
          type: 'danger',
        })
      } finally {
        setLoadingCatalogs(false)
      }
    }
    fetchCatalogs()
  }, [])

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert({ show: false, message: '', type: '' })

    // Validaciones mínimas
    if (!form.supply_request_id) {
      setAlert({ show: true, message: 'Debe seleccionar una solicitud asociada.', type: 'danger' })
      return
    }
    if (!form.delivery_user_id) {
      setAlert({ show: true, message: 'Debe seleccionar un responsable de entrega.', type: 'danger' })
      return
    }
    if (!form.delivery_date) {
      setAlert({ show: true, message: 'Debe indicar la fecha de entrega.', type: 'danger' })
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        supply_request_id: form.supply_request_id,
        delivery_user_id: form.delivery_user_id,
        delivery_date: form.delivery_date,
        delivery_type: form.delivery_type,
        delivery_point: form.delivery_point || null,
        witness_receptor: form.witness_receptor || null,
        next_estimated_delivery: form.next_estimated_delivery || null,
        digital_signature: form.digital_signature || null,
        observations: form.observations || null,
        status: form.status,
      }

      await createDelivery(payload)

      setAlert({
        show: true,
        message: 'Entrega registrada exitosamente.',
        type: 'success',
      })

      // Limpiar formulario
      setForm({ ...INITIAL_FORM })
    } catch (err) {
      console.error('Error registrando entrega:', err)
      setAlert({
        show: true,
        message: err.message || 'Error al registrar la entrega.',
        type: 'danger',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM })
    setAlert({ show: false, message: '', type: '' })
  }

  return (
    <div className="delivery-register-container">
      <CCard className="delivery-register-card">
        <CCardHeader>
          <h5 className="mb-0 d-flex align-items-center">
            <CIcon icon={cilTruck} className="me-2" />
            Registrar Nueva Entrega
            <HelpButton title="Manual de Usuario – Registrar Nueva Entrega">
              <div>
                <p>Programa una nueva entrega logística de medicamentos.</p>
                <h6>Formulario de Entrega</h6>
                <div className="card p-3 mb-3 bg-light">
                  <div className="row g-2 small">
                    <div className="col-md-6"><span className="fw-bold">(1) Solicitud Asociada *</span><br/>Seleccione...</div>
                    <div className="col-md-6"><span className="fw-bold">(2) Responsable *</span><br/>Repartidor asignado</div>
                    <div className="col-md-6"><span className="fw-bold">(3) Fecha Estimada *</span><br/>15-10-2023</div>
                    <div className="col-md-6"><span className="fw-bold">(4) Tipo de Entrega</span><br/>A Domicilio / Jornada</div>
                    <div className="col-md-6"><span className="fw-bold">(5) Punto de Entrega</span><br/>Dirección específica</div>
                    <div className="col-md-6"><span className="fw-bold">(6) Testigo</span><br/>Opcional (Ej: Familiar)</div>
                  </div>
                </div>
                <ol>
                  <li><strong>Solicitud Asociada:</strong> Elige la petición previa del beneficiario (Vincula los medicamentos).</li>
                  <li><strong>Responsable:</strong> Personal que realizará el traslado.</li>
                  <li><strong>Fecha Estimada:</strong> Cuándo se espera concretar.</li>
                  <li><strong>Tipo de Entrega:</strong> Modalidad logística (A Domicilio, Retiro en Sede, Jornada comunitaria).</li>
                  <li><strong>Punto de Entrega:</strong> Dirección exacta donde se entregará.</li>
                  <li><strong>Testigo:</strong> Persona que recibe si el beneficiario no puede.</li>
                </ol>
                <p className="text-muted"><em>Al guardar, la entrega cambiará al estado inicial seleccionado (ej: Programada).</em></p>
              </div>
            </HelpButton>
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <CAlert
              color={alert.type}
              dismissible
              onClose={() => setAlert({ show: false, message: '', type: '' })}
              className="mb-4"
            >
              {alert.message}
            </CAlert>
          )}

          {loadingCatalogs ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2 text-muted">Cargando datos...</p>
            </div>
          ) : (
            <CForm onSubmit={handleSubmit} onReset={handleReset}>
              {/* Información de la Solicitud */}
              <div className="form-section">
                <h6 className="section-title">
                  <CIcon icon={cilTruck} className="icon me-2" />
                  Información de la Solicitud
                </h6>
                <CRow>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="medicine_id" className="register-form-label">
                        Medicamento a Entregar *
                      </CFormLabel>
                      <CFormSelect
                        id="medicine_id"
                        value={selectedMedicineId}
                        onChange={(e) => {
                          setSelectedMedicineId(e.target.value);
                          setForm(prev => ({ ...prev, supply_request_id: '' }));
                        }}
                        required
                      >
                        <option value="">Seleccione un medicamento</option>
                        {medicines.map((med) => (
                          <option key={med.id} value={med.id}>
                            {med.commercial_name} ({med.generic_name})
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="supply_request_id" className="register-form-label">
                        Beneficiario que lo requiere *
                      </CFormLabel>
                      <CFormSelect
                        id="supply_request_id"
                        name="supply_request_id"
                        className="register-form-select"
                        value={form.supply_request_id}
                        onChange={handleChange}
                        required
                        disabled={!selectedMedicineId}
                      >
                        <option value="">
                          {!selectedMedicineId 
                            ? 'Seleccione primero un medicamento' 
                            : requests.filter(r => r.medicine_id === selectedMedicineId).length === 0 
                            ? 'Nadie requiere este medicamento' 
                            : 'Seleccione beneficiario'}
                        </option>
                        {requests
                          .filter(r => r.medicine_id === selectedMedicineId)
                          .map((req) => (
                            <option key={req.id} value={req.id}>
                              {req.beneficiary_name} — (Ref: {req.id.substring(0, 8).toUpperCase()})
                            </option>
                          ))
                        }
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_user_id" className="register-form-label">
                        Responsable de Entrega *
                      </CFormLabel>
                      <CFormSelect
                        id="delivery_user_id"
                        name="delivery_user_id"
                        className="register-form-select"
                        value={form.delivery_user_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione responsable</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name} {user.last_name}
                            {user.position ? ` — ${user.position}` : ''}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Detalles de la Entrega */}
              <div className="form-section">
                <h6 className="section-title">
                  <CIcon icon={cilTruck} className="icon me-2" />
                  Detalles de la Entrega
                </h6>
                <CRow>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_date" className="register-form-label">
                        Fecha Entrega *
                      </CFormLabel>
                      <CFormInput
                        type="date"
                        id="delivery_date"
                        name="delivery_date"
                        className="register-form-input"
                        value={form.delivery_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_type" className="register-form-label">
                        Tipo de Entrega
                      </CFormLabel>
                      <CFormSelect
                        id="delivery_type"
                        name="delivery_type"
                        className="register-form-select"
                        value={form.delivery_type}
                        onChange={handleChange}
                      >
                        {DELIVERY_TYPES.map((dt) => (
                          <option key={dt.value} value={dt.value}>
                            {dt.label}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="status" className="register-form-label">
                        Estado
                      </CFormLabel>
                      <CFormSelect
                        id="status"
                        name="status"
                        className="register-form-select"
                        value={form.status}
                        onChange={handleChange}
                      >
                        {DELIVERY_STATUSES.map((ds) => (
                          <option key={ds.value} value={ds.value}>
                            {ds.label}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_point" className="register-form-label">
                        Punto de Entrega
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        id="delivery_point"
                        name="delivery_point"
                        className="register-form-input"
                        placeholder="Dirección o lugar específico"
                        value={form.delivery_point}
                        onChange={handleChange}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="witness_receptor" className="register-form-label">
                        Testigo/Receptor
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        id="witness_receptor"
                        name="witness_receptor"
                        className="register-form-input"
                        placeholder="Nombre del testigo o receptor"
                        value={form.witness_receptor}
                        onChange={handleChange}
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="next_estimated_delivery" className="register-form-label">
                        Próxima Entrega Estimada
                      </CFormLabel>
                      <CFormInput
                        type="date"
                        id="next_estimated_delivery"
                        name="next_estimated_delivery"
                        className="register-form-input"
                        value={form.next_estimated_delivery}
                        onChange={handleChange}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="digital_signature" className="register-form-label">
                        Firma Digital/Comprobante
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        id="digital_signature"
                        name="digital_signature"
                        className="register-form-input"
                        placeholder="Código o referencia de firma"
                        value={form.digital_signature}
                        onChange={handleChange}
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
                        rows="3"
                        placeholder="Observaciones de la entrega..."
                        value={form.observations}
                        onChange={handleChange}
                      />
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Sección informativa de Medicamentos */}
              <div className="form-section">
                <h6 className="section-title">
                  <CIcon icon={cilTruck} className="icon me-2" />
                  Medicamentos a Entregar
                </h6>
                <div className="alert alert-info mb-3">
                  <small>Los medicamentos se seleccionarán en el siguiente paso después de registrar la entrega básica.</small>
                </div>
              </div>

              <div className="d-flex gap-2 btn-group-responsive">
                <CButton
                  color="primary"
                  type="submit"
                  className="register-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Registrar Entrega
                    </>
                  )}
                </CButton>
                <CButton
                  color="secondary"
                  type="reset"
                  className="register-btn-secondary"
                  disabled={submitting}
                >
                  <CIcon icon={cilReload} className="me-2" />
                  Limpiar Formulario
                </CButton>
              </div>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DeliveryRegister