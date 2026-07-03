import React, { useState, useEffect, useCallback } from 'react'
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
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import { cilSave, cilReload, cilTruck, cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { createDelivery, getUsers, getMedicines, getBeneficiariesByMedicine } from '../../services/api'
import HelpButton from '../common/HelpButton'
import '../../css/entregas/DeliveryRegister.css'

const DELIVERY_TYPES = [
  { label: 'A Domicilio', value: 'HomeDelivery' },
  { label: 'Centro de Salud', value: 'HealthCenter' },
  { label: 'Jornada Comunitaria', value: 'Community' },
  { label: 'Retiro en Sede', value: 'Pickup' },
]

const DELIVERY_STATUSES = [
  { label: 'Programada', value: 'Scheduled' },
  { label: 'En Camino', value: 'OnTheWay' },
  { label: 'Entregada', value: 'Delivered' },
  { label: 'Cancelada', value: 'Cancelled' },
  { label: 'Pendiente', value: 'Pending' },
]

const INITIAL_FORM = {
  medicine_id: '',
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

  const [users, setUsers] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loadingCatalogs, setLoadingCatalogs] = useState(true)

  // Beneficiarios
  const [beneficiariesCount, setBeneficiariesCount] = useState(0)
  const [beneficiariesList, setBeneficiariesList] = useState([])
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false)
  const [showBeneficiariesModal, setShowBeneficiariesModal] = useState(false)

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true)
      try {
        const [userRes, medRes] = await Promise.all([
          getUsers(),
          getMedicines(),
        ])
        const userList = userRes?.message?.users || []
        const medList = medRes?.message?.medicines || []
        setUsers(userList.filter(u => u.status === 'Active'))
        setMedicines(medList)
      } catch (err) {
        console.error('Error cargando catálogos:', err)
        setAlert({ show: true, message: 'Error al cargar catálogos.', type: 'danger' })
      } finally {
        setLoadingCatalogs(false)
      }
    }
    fetchCatalogs()
  }, [])

  const fetchBeneficiariesForMedicine = useCallback(async (medicineId) => {
    if (!medicineId) {
      setBeneficiariesCount(0)
      setBeneficiariesList([])
      return
    }
    setLoadingBeneficiaries(true)
    try {
      const response = await getBeneficiariesByMedicine(medicineId)
      const beneficiaries = response?.message?.beneficiaries || []
      setBeneficiariesList(beneficiaries)
      setBeneficiariesCount(beneficiaries.length)
    } catch (err) {
      console.error('Error obteniendo beneficiarios:', err)
      setBeneficiariesCount(0)
      setBeneficiariesList([])
    } finally {
      setLoadingBeneficiaries(false)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'medicine_id') {
      fetchBeneficiariesForMedicine(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert({ show: false, message: '', type: '' })

    if (!form.medicine_id) {
      setAlert({ show: true, message: 'Seleccione un medicamento a entregar.', type: 'danger' })
      return
    }
    if (!form.delivery_user_id) {
      setAlert({ show: true, message: 'Seleccione un responsable de entrega.', type: 'danger' })
      return
    }
    if (!form.delivery_date) {
      setAlert({ show: true, message: 'Indique la fecha de entrega.', type: 'danger' })
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        medicine_id: form.medicine_id,
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
      setAlert({ show: true, message: 'Entrega registrada exitosamente.', type: 'success' })
      setForm({ ...INITIAL_FORM })
      setBeneficiariesCount(0)
      setBeneficiariesList([])
    } catch (err) {
      console.error('Error registrando entrega:', err)
      setAlert({ show: true, message: err.message || 'Error al registrar la entrega.', type: 'danger' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM })
    setAlert({ show: false, message: '', type: '' })
    setBeneficiariesCount(0)
    setBeneficiariesList([])
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
                <p><strong>¿Qué hace esta pantalla?</strong><br />
                  Programa la entrega de un medicamento. Al seleccionar un medicamento, se muestra cuántos beneficiarios lo necesitan.</p>
                <h6>🧪 Ejemplo de formulario</h6>
                <div className="card p-3 mb-3 bg-light">
                  <div className="row g-2 small">
                    <div className="col-md-6"><span className="fw-bold">Medicamento *</span><br />Amoxicilina 500mg</div>
                    <div className="col-md-6"><span className="fw-bold">Responsable *</span><br />Carlos Mendoza</div>
                    <div className="col-12 mt-2">
                      <span className="fw-bold">Beneficiarios que lo requieren</span><br />
                      <span className="badge bg-info">10 beneficiarios seleccionados</span> <button className="btn btn-sm btn-outline-info">Ver listado</button>
                    </div>
                    <div className="col-md-6 mt-3"><span className="fw-bold">Fecha Entrega *</span><br />15/10/2025</div>
                    <div className="col-md-6 mt-3"><span className="fw-bold">Tipo de Entrega</span><br />A Domicilio</div>
                  </div>
                </div>
                <h6>📋 Validaciones y uso</h6>
                <ol>
                  <li><strong>Medicamento *:</strong> Seleccione del catálogo.</li>
                  <li><strong>Responsable *:</strong> Usuario activo que realizará la entrega.</li>
                  <li><strong>Beneficiarios:</strong> Vea el listado de beneficiarios que necesitan este medicamento.</li>
                  <li><strong>Fecha de Entrega *:</strong> Día programado.</li>
                  <li><strong>Tipo de Entrega:</strong> Modalidad logística.</li>
                  <li><strong>Estado:</strong> Programada por defecto. Al cambiar a Entregada, el inventario se actualizará.</li>
                </ol>
              </div>
            </HelpButton>
          </h5>
        </CCardHeader>
        <CCardBody>
          {alert.show && (
            <CAlert color={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })} className="mb-4">
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
              {/* Información de la Entrega */}
              <div className="form-section">
                <h6 className="section-title">
                  <CIcon icon={cilTruck} className="icon me-2" />
                  Información de la Entrega
                </h6>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="medicine_id" className="register-form-label">Medicamento a Entregar *</CFormLabel>
                      <CFormSelect id="medicine_id" name="medicine_id" value={form.medicine_id} onChange={handleChange} required>
                        <option value="">Seleccione un medicamento</option>
                        {medicines.map(med => (
                          <option key={med.id} value={med.id}>{med.commercial_name} ({med.generic_name})</option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_user_id" className="register-form-label">Responsable de Entrega *</CFormLabel>
                      <CFormSelect id="delivery_user_id" name="delivery_user_id" value={form.delivery_user_id} onChange={handleChange} required>
                        <option value="">Seleccione responsable</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.first_name} {user.last_name} {user.position ? ` — ${user.position}` : ''}</option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>

                {/* Sección de Beneficiarios que requieren el medicamento */}
                {form.medicine_id && (
                  <div className="mb-4 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {loadingBeneficiaries ? (
                          <>
                            <CSpinner size="sm" color="primary" className="me-2" />
                            <span>Cargando beneficiarios...</span>
                          </>
                        ) : (
                          <span>
                            <CIcon icon={cilPeople} className="me-2" />
                            <strong>{beneficiariesCount} beneficiario(s) seleccionado(s)</strong> requieren este medicamento
                          </span>
                        )}
                      </div>
                      {!loadingBeneficiaries && beneficiariesCount > 0 && (
                        <CButton color="outline-info" size="sm" onClick={() => setShowBeneficiariesModal(true)}>
                          Ver listado
                        </CButton>
                      )}
                    </div>
                  </div>
                )}
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
                      <CFormLabel htmlFor="delivery_date" className="register-form-label">Fecha Entrega *</CFormLabel>
                      <CFormInput type="date" id="delivery_date" name="delivery_date" value={form.delivery_date} onChange={handleChange} required />
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_type" className="register-form-label">Tipo de Entrega</CFormLabel>
                      <CFormSelect id="delivery_type" name="delivery_type" value={form.delivery_type} onChange={handleChange}>
                        {DELIVERY_TYPES.map(dt => (<option key={dt.value} value={dt.value}>{dt.label}</option>))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="status" className="register-form-label">Estado</CFormLabel>
                      <CFormSelect id="status" name="status" value={form.status} onChange={handleChange}>
                        {DELIVERY_STATUSES.map(ds => (<option key={ds.value} value={ds.value}>{ds.label}</option>))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="delivery_point" className="register-form-label">Punto de Entrega</CFormLabel>
                      <CFormInput type="text" id="delivery_point" name="delivery_point" placeholder="Dirección o lugar específico" value={form.delivery_point} onChange={handleChange} />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="witness_receptor" className="register-form-label">Testigo/Receptor</CFormLabel>
                      <CFormInput type="text" id="witness_receptor" name="witness_receptor" placeholder="Nombre del testigo o receptor" value={form.witness_receptor} onChange={handleChange} />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="next_estimated_delivery" className="register-form-label">Próxima Entrega Estimada</CFormLabel>
                      <CFormInput type="date" id="next_estimated_delivery" name="next_estimated_delivery" value={form.next_estimated_delivery} onChange={handleChange} />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="digital_signature" className="register-form-label">Firma Digital/Comprobante</CFormLabel>
                      <CFormInput type="text" id="digital_signature" name="digital_signature" placeholder="Código o referencia de firma" value={form.digital_signature} onChange={handleChange} />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="observations" className="register-form-label">Observaciones</CFormLabel>
                      <CFormTextarea id="observations" name="observations" rows="3" placeholder="Observaciones de la entrega..." value={form.observations} onChange={handleChange} />
                    </div>
                  </CCol>
                </CRow>
              </div>

              <div className="d-flex gap-2 btn-group-responsive mt-4">
                <CButton color="primary" type="submit" className="register-btn-primary" disabled={submitting}>
                  {submitting ? <><CSpinner size="sm" className="me-2" /> Registrando...</> : <><CIcon icon={cilSave} className="me-2" /> Registrar Entrega</>}
                </CButton>
                <CButton color="secondary" type="reset" className="register-btn-secondary" disabled={submitting}>
                  <CIcon icon={cilReload} className="me-2" /> Limpiar Formulario
                </CButton>
              </div>
            </CForm>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de listado de beneficiarios */}
      <CModal visible={showBeneficiariesModal} onClose={() => setShowBeneficiariesModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPeople} className="me-2" />
            Beneficiarios que requieren este medicamento
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {beneficiariesList.length === 0 ? (
            <p className="text-muted">No hay beneficiarios registrados para este medicamento.</p>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Cédula</CTableHeaderCell>
                  <CTableHeaderCell>Nombre Completo</CTableHeaderCell>
                  <CTableHeaderCell>Comunidad</CTableHeaderCell>
                  <CTableHeaderCell>Prioridad</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {beneficiariesList.map(benef => (
                  <CTableRow key={benef.id}>
                    <CTableDataCell>{benef.identification_number || '—'}</CTableDataCell>
                    <CTableDataCell>{benef.first_name} {benef.last_name}</CTableDataCell>
                    <CTableDataCell>{benef.community_name || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={benef.priority_level === 'High' ? 'danger' : benef.priority_level === 'Medium' ? 'warning' : 'success'}>
                        {benef.priority_level === 'High' ? 'ALTA' : benef.priority_level === 'Medium' ? 'MEDIA' : 'BAJA'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{benef.phone_personal || '—'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowBeneficiariesModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default DeliveryRegister