import React, { useState, useEffect } from 'react'
import {
  CCard, CCardHeader, CCardBody, CForm, CRow, CCol,
  CFormInput, CFormLabel, CFormSelect, CButton, CFormTextarea,
  CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CBadge, CAlert
} from '@coreui/react'
import { cilSave, cilReload, cilTruck, cilClipboard, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  createDelivery, getUsers,
  getProviderRequests, getDonations,
  getProviderRequestById, getDonationById,
  getBeneficiariesByMedicine
} from '../../services/api'
import HelpButton from '../common/HelpButton'
import ToastNotification from '../common/ToastNotification'
import '../../css/entregas/DeliveryRegister.css'

const DELIVERY_TYPES = [
  { label: 'Retiro en Sede (Ventanilla)', value: 'Pickup Point' },
  { label: 'A Domicilio', value: 'Home Delivery' },
  { label: 'Centro de Salud / Hospital', value: 'Health Center' },
]

const DELIVERY_STATUSES = [
  { label: 'Programada', value: 'Scheduled' },
  { label: 'En Camino', value: 'In Transit' },
  { label: 'Entregada', value: 'Delivered' },
]

const todayStr = new Date().toISOString().split('T')[0]

const INITIAL_FORM = {
  source_type: '',
  source_id: '',
  delivery_user_id: '',
  delivery_date: todayStr,
  delivery_type: 'Pickup Point',
  delivery_point: 'Sede Principal FarmaPatria',
  digital_signature: '',
  observations: '',
  status: 'Scheduled',
}

const DeliveryRegister = () => {
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const [submitting, setSubmitting] = useState(false)

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type })
    setTimeout(() => setToast({ show: true, message, type }), 20)
  }

  // Catálogos iniciales
  const [users, setUsers] = useState([])
  const [providerRequests, setProviderRequests] = useState([])
  const [donations, setDonations] = useState([])
  const [loadingCatalogs, setLoadingCatalogs] = useState(true)

  // Datos del origen seleccionado
  const [sourceData, setSourceData] = useState(null)
  const [sourceMedicines, setSourceMedicines] = useState([])
  const [loadingSource, setLoadingSource] = useState(false)

  // Medicamento seleccionado → Beneficiarios (se muestran TODOS automáticamente)
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [selectedMedicineName, setSelectedMedicineName] = useState('')
  const [linkedBeneficiaries, setLinkedBeneficiaries] = useState([])
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false)

  // Items de entrega (medicamento + cantidad + lista de beneficiarios)
  const [deliveryItems, setDeliveryItems] = useState([])
  const [itemQuantity, setItemQuantity] = useState('')

  /* ═══ CARGA INICIAL ═══ */
  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true)
      try {
        const [userRes, prRes, donRes] = await Promise.all([
          getUsers(),
          getProviderRequests().catch(() => null),
          getDonations().catch(() => null)
        ])
        setUsers((userRes?.message?.users || []).filter(u => u.status === 'Active'))
        setProviderRequests(prRes?.message?.providerRequests || [])
        setDonations(donRes?.message?.donations || [])
      } catch (err) {
        console.error('Error cargando catálogos:', err)
        showToast('Error al cargar catálogos.', 'danger')
      } finally {
        setLoadingCatalogs(false)
      }
    }
    fetchCatalogs()
  }, [])

  /* ═══ CAMBIO DE TIPO DE ORIGEN ═══ */
  const handleSourceTypeChange = (sourceType) => {
    setForm(prev => ({ ...prev, source_type: sourceType, source_id: '' }))
    setSourceData(null)
    setSourceMedicines([])
    setDeliveryItems([])
    resetMedicineSelection()
  }

  const resetMedicineSelection = () => {
    setSelectedMedicineId('')
    setSelectedMedicineName('')
    setLinkedBeneficiaries([])
    setItemQuantity('')
  }

  /* ═══ SELECCIÓN DE SOLICITUD O DONACIÓN ═══ */
  const handleSourceSelect = async (sourceId) => {
    setForm(prev => ({ ...prev, source_id: sourceId }))
    setDeliveryItems([])
    setSourceMedicines([])
    resetMedicineSelection()

    if (!sourceId) {
      setSourceData(null)
      return
    }

    setLoadingSource(true)
    try {
      if (form.source_type === 'solicitud') {
        const res = await getProviderRequestById(sourceId)
        const sol = res?.message?.providerRequest
        if (sol) {
          setSourceData({
            type: 'solicitud',
            code: `SOL-${sol.id.substring(0, 8).toUpperCase()}`,
            label: sol.provider_name || 'Proveedor',
            detail: `${sol.department || ''} — ${sol.responsible_name || ''}`,
            date: sol.request_date,
            status: sol.status,
          })
          const meds = (sol.medicines || []).map(m => ({
            id: m.medicine_id,
            name: m.medicine_name || m.commercial_name || 'Medicamento',
            available_qty: parseInt(m.requested_quantity) || 0,
            detail: `Solicitado: ${m.requested_quantity || 0} uds.`,
          }))
          setSourceMedicines(meds)
        }
      } else if (form.source_type === 'donacion') {
        const res = await getDonationById(sourceId)
        const don = res?.message?.donation
        if (don) {
          setSourceData({
            type: 'donacion',
            code: `DON-${don.id.substring(0, 8).toUpperCase()}`,
            label: don.donor_name || 'Donante',
            detail: don.rif_cedula || '',
            date: don.reception_date,
            status: don.status,
          })
          const meds = (don.lots || []).map(l => ({
            id: l.medicine_id,
            name: l.medicine_name || 'Medicamento',
            available_qty: parseInt(l.total_units) || 0,
            lot_number: l.lot_number,
            expiration_date: l.expiration_date,
            detail: `Lote: ${l.lot_number || '—'} — ${l.total_units || 0} uds. — Vence: ${l.expiration_date ? new Date(l.expiration_date).toLocaleDateString('es-VE') : '—'}`,
          }))
          setSourceMedicines(meds)
        }
      }
    } catch (err) {
      console.error('Error cargando detalle del origen:', err)
      showToast('Error al cargar detalle del origen seleccionado', 'danger')
    } finally {
      setLoadingSource(false)
    }
  }

  /* ═══ SELECCIÓN DE MEDICAMENTO → CARGA AUTOMÁTICA DE TODOS LOS BENEFICIARIOS ═══ */
  const handleMedicineSelect = async (medicineId) => {
    setSelectedMedicineId(medicineId)
    setLinkedBeneficiaries([])
    setItemQuantity('')

    if (!medicineId) {
      setSelectedMedicineName('')
      return
    }

    const med = sourceMedicines.find(m => m.id === medicineId)
    setSelectedMedicineName(med?.name || 'Medicamento')

    setLoadingBeneficiaries(true)
    try {
      const res = await getBeneficiariesByMedicine(medicineId)
      const bens = res?.message?.beneficiaries || []
      setLinkedBeneficiaries(bens)
      if (bens.length === 0) {
        showToast('No hay beneficiarios con este medicamento recetado en su ficha clínica.', 'warning')
      }
    } catch (err) {
      console.error('Error cargando beneficiarios por medicamento:', err)
      showToast('Error al buscar beneficiarios para este medicamento', 'danger')
    } finally {
      setLoadingBeneficiaries(false)
    }
  }

  /* ═══ AGREGAR ITEM (medicamento + cantidad + todos los beneficiarios vinculados) ═══ */
  const addDeliveryItem = () => {
    if (!selectedMedicineId || !itemQuantity || parseInt(itemQuantity) <= 0) {
      showToast('Seleccione un medicamento e indique la cantidad (> 0)', 'warning')
      return
    }

    const med = sourceMedicines.find(m => m.id === selectedMedicineId)
    if (!med) {
      showToast('Medicamento no encontrado en el origen', 'danger')
      return
    }

    if (deliveryItems.some(it => it.medicine_id === selectedMedicineId)) {
      showToast('Este medicamento ya está en la lista de entrega', 'warning')
      return
    }

    const qty = parseInt(itemQuantity)
    if (qty > med.available_qty) {
      showToast(`La cantidad (${qty}) excede lo disponible en el origen (${med.available_qty} uds.)`, 'danger')
      return
    }

    setDeliveryItems(prev => [...prev, {
      id: Date.now(),
      medicine_id: selectedMedicineId,
      medicine_name: med.name,
      quantity: qty,
      available_qty: med.available_qty,
      lot_number: med.lot_number || '—',
      beneficiaries: [...linkedBeneficiaries],
      beneficiaries_count: linkedBeneficiaries.length,
    }])

    // Limpiar selección para agregar otro medicamento si desea
    resetMedicineSelection()
  }

  const removeDeliveryItem = (id) => {
    setDeliveryItems(prev => prev.filter(it => it.id !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  /* ═══ SUBMIT ═══ */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.source_type || !form.source_id) {
      showToast('Seleccione el origen (Solicitud o Donación)', 'danger')
      return
    }
    if (!form.delivery_user_id) {
      showToast('Seleccione un responsable de entrega', 'danger')
      return
    }
    if (deliveryItems.length === 0) {
      showToast('Agregue al menos un medicamento a la entrega', 'danger')
      return
    }
    if (form.delivery_date < todayStr) {
      showToast('La fecha de entrega no puede ser anterior a hoy', 'danger')
      return
    }

    // Construir la lista de nombres de todos los beneficiarios de todos los items
    const allBeneficiaries = []
    deliveryItems.forEach(it => {
      it.beneficiaries.forEach(b => {
        const fullName = `${b.first_name} ${b.last_name}`
        if (!allBeneficiaries.includes(fullName)) {
          allBeneficiaries.push(fullName)
        }
      })
    })
    const witnessReceptor = allBeneficiaries.length > 0
      ? allBeneficiaries.join(', ')
      : 'Beneficiarios vinculados'

    try {
      setSubmitting(true)

      const payload = {
        request_id: form.source_type === 'solicitud' ? form.source_id : null,
        donation_id: form.source_type === 'donacion' ? form.source_id : null,
        delivery_user_id: form.delivery_user_id,
        delivery_date: form.delivery_date,
        delivery_type: form.delivery_type,
        delivery_point: form.delivery_point || 'Sede FarmaPatria',
        witness_receptor: witnessReceptor,
        digital_signature: form.digital_signature || null,
        observations: form.observations || null,
        status: form.status,
        items: deliveryItems.map(it => ({
          medicine_id: it.medicine_id,
          delivered_quantity: it.quantity,
        }))
      }

      const res = await createDelivery(payload)
      showToast(res?.message?.text || 'Entrega registrada exitosamente ✅', 'success')
      handleReset()
    } catch (err) {
      console.error('Error registrando entrega:', err)
      showToast(err.message || 'Error al registrar entrega', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM })
    setSourceData(null)
    setSourceMedicines([])
    setDeliveryItems([])
    resetMedicineSelection()
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-VE') : '—'

  return (
    <div className="delivery-register-container">
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilTruck} className="me-2" />
            Registrar Nueva Entrega
            <HelpButton title="Ayuda – Nueva Entrega">
              <div>
                <p><strong>Paso 1:</strong> Seleccione de dónde proviene la medicina (Solicitud Aprobada o Donación Recibida).</p>
                <p><strong>Paso 2:</strong> Seleccione un medicamento del origen. El sistema mostrará automáticamente <strong>todos</strong> los beneficiarios que tienen ese medicamento recetado en su ficha clínica.</p>
                <p><strong>Paso 3:</strong> Indique la cantidad total a entregar y agregue. La entrega cubrirá a todos los beneficiarios vinculados.</p>
                <p><strong>Paso 4:</strong> Complete los datos logísticos y confirme la entrega.</p>
                <p>La entrega quedará vinculada al código de origen (SOL-xxx o DON-xxx) para total trazabilidad.</p>
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

          {loadingCatalogs ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2 text-body-secondary">Cargando catálogos...</p>
            </div>
          ) : (
            <CForm onSubmit={handleSubmit} onReset={handleReset}>

              {/* ═══ SECCIÓN 1: ORIGEN DE LA ENTREGA ═══ */}
              <div className="mb-4 p-3 border rounded">
                <h6 className="fw-bold text-primary mb-3">
                  <CIcon icon={cilClipboard} className="me-2" />
                  1. Origen de la Entrega
                </h6>
                <CRow className="mb-3">
                  <CCol md={4}>
                    <CFormLabel className="fw-semibold">¿De dónde proviene? *</CFormLabel>
                    <CFormSelect
                      value={form.source_type}
                      onChange={(e) => handleSourceTypeChange(e.target.value)}
                    >
                      <option value="">— Seleccione tipo de origen —</option>
                      <option value="solicitud">📋 Solicitud Aprobada</option>
                      <option value="donacion">🎁 Donación Recibida</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={8}>
                    {form.source_type === 'solicitud' && (
                      <div>
                        <CFormLabel className="fw-semibold">Seleccionar Solicitud *</CFormLabel>
                        <CFormSelect
                          value={form.source_id}
                          onChange={(e) => handleSourceSelect(e.target.value)}
                        >
                          <option value="">— Seleccione una solicitud —</option>
                          {providerRequests
                            .filter(r => ['APROBADA', 'COMPLETADA', 'APROBADA_INTERNA'].includes(r.status))
                            .map(r => (
                              <option key={r.id} value={r.id}>
                                SOL-{r.id.substring(0, 8).toUpperCase()} — {r.provider_name} — {r.total_units || 0} uds. — {r.status}
                              </option>
                            ))}
                        </CFormSelect>
                      </div>
                    )}
                    {form.source_type === 'donacion' && (
                      <div>
                        <CFormLabel className="fw-semibold">Seleccionar Donación *</CFormLabel>
                        <CFormSelect
                          value={form.source_id}
                          onChange={(e) => handleSourceSelect(e.target.value)}
                        >
                          <option value="">— Seleccione una donación —</option>
                          {donations
                            .filter(d => ['Received', 'Accepted', 'Inspected'].includes(d.status))
                            .map(d => (
                              <option key={d.id} value={d.id}>
                                DON-{d.id.substring(0, 8).toUpperCase()} — {d.donor_name} — {formatDate(d.reception_date)} — {d.status}
                              </option>
                            ))}
                        </CFormSelect>
                      </div>
                    )}
                  </CCol>
                </CRow>

                {loadingSource && (
                  <div className="text-center py-3">
                    <CSpinner size="sm" color="primary" />
                    <span className="ms-2 text-body-secondary">Cargando detalle del origen...</span>
                  </div>
                )}

                {sourceData && !loadingSource && (
                  <CAlert color={sourceData.type === 'solicitud' ? 'info' : 'success'} className="py-2 px-3 mb-0">
                    <div className="row g-2 small">
                      <div className="col-md-3">
                        <strong>Código:</strong>{' '}
                        <CBadge color={sourceData.type === 'solicitud' ? 'primary' : 'success'}>
                          {sourceData.code}
                        </CBadge>
                      </div>
                      <div className="col-md-3">
                        <strong>{sourceData.type === 'solicitud' ? 'Proveedor:' : 'Donante:'}</strong>{' '}
                        {sourceData.label}
                      </div>
                      <div className="col-md-3">
                        <strong>Detalle:</strong> {sourceData.detail || '—'}
                      </div>
                      <div className="col-md-3">
                        <strong>Fecha:</strong> {formatDate(sourceData.date)} — <strong>Estado:</strong> {sourceData.status}
                      </div>
                    </div>
                    {sourceMedicines.length > 0 && (
                      <div className="mt-2 small">
                        <strong>Medicamentos en este origen:</strong> {sourceMedicines.length} — Total: {sourceMedicines.reduce((s, m) => s + m.available_qty, 0)} uds.
                      </div>
                    )}
                  </CAlert>
                )}
              </div>

              {/* ═══ SECCIÓN 2: MEDICAMENTO → BENEFICIARIOS AUTOMÁTICOS ═══ */}
              <div className="mb-4 p-3 border rounded">
                <h6 className="fw-bold text-primary mb-3">
                  <CIcon icon={cilUser} className="me-2" />
                  2. Medicamento y Beneficiarios Vinculados
                </h6>

                {sourceMedicines.length === 0 && form.source_id && !loadingSource ? (
                  <CAlert color="warning" className="py-2">
                    No se encontraron medicamentos en el origen seleccionado.
                  </CAlert>
                ) : null}

                <CRow className="mb-3 g-2 align-items-end">
                  {/* Selector de Medicamento del Origen */}
                  <CCol md={6}>
                    <CFormLabel className="fw-semibold">Medicamento del Origen *</CFormLabel>
                    <CFormSelect
                      value={selectedMedicineId}
                      onChange={(e) => handleMedicineSelect(e.target.value)}
                      disabled={sourceMedicines.length === 0}
                    >
                      <option value="">— Seleccione medicamento —</option>
                      {sourceMedicines.map((m, idx) => (
                        <option key={`${m.id}-${idx}`} value={m.id}>
                          {m.name} — {m.detail}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  {/* Cantidad */}
                  <CCol md={3}>
                    <CFormLabel className="fw-semibold">Cantidad a entregar</CFormLabel>
                    <CFormInput
                      type="number"
                      min="1"
                      max={sourceMedicines.find(m => m.id === selectedMedicineId)?.available_qty || 99999}
                      placeholder="Cant. total"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      disabled={!selectedMedicineId}
                    />
                  </CCol>

                  {/* Botón Agregar */}
                  <CCol md={3}>
                    <CButton
                      color="primary"
                      onClick={addDeliveryItem}
                      className="w-100"
                      disabled={!selectedMedicineId || !itemQuantity || linkedBeneficiaries.length === 0}
                    >
                      + Agregar a la Entrega
                    </CButton>
                  </CCol>
                </CRow>

                {/* ── Lista automática de beneficiarios vinculados ── */}
                {loadingBeneficiaries && (
                  <div className="text-center py-3">
                    <CSpinner size="sm" color="primary" />
                    <span className="ms-2 text-body-secondary">Buscando beneficiarios con receta de este medicamento...</span>
                  </div>
                )}

                {!loadingBeneficiaries && selectedMedicineId && linkedBeneficiaries.length > 0 && (
                  <div className="mt-2">
                    <CAlert color="info" className="py-2 px-3 mb-2">
                      <strong>📋 {linkedBeneficiaries.length} beneficiario(s)</strong> tienen recetado <strong>{selectedMedicineName}</strong> en su ficha clínica.
                      Esta entrega los cubrirá a todos.
                    </CAlert>
                    <CTable hover bordered responsive small className="mb-0">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Nombre Completo</CTableHeaderCell>
                          <CTableHeaderCell>Cédula</CTableHeaderCell>
                          <CTableHeaderCell>Teléfono</CTableHeaderCell>
                          <CTableHeaderCell>Dirección</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {linkedBeneficiaries.map((ben, idx) => (
                          <CTableRow key={ben.id}>
                            <CTableDataCell>{idx + 1}</CTableDataCell>
                            <CTableDataCell className="fw-semibold">
                              {ben.first_name} {ben.last_name}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CBadge color="secondary">{ben.identification_number || 'S/N'}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>{ben.phone_personal || ben.phone || '—'}</CTableDataCell>
                            <CTableDataCell className="text-body-secondary">{ben.detailed_address || '—'}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}

                {!loadingBeneficiaries && selectedMedicineId && linkedBeneficiaries.length === 0 && (
                  <CAlert color="warning" className="py-2 mt-2">
                    No hay beneficiarios con este medicamento recetado en su ficha clínica.
                  </CAlert>
                )}

                {/* ── Tabla de items ya agregados ── */}
                {deliveryItems.length > 0 && (
                  <div className="mt-4">
                    <h6 className="fw-semibold">
                      ✅ Medicamentos en esta Entrega
                      <CBadge color="primary" className="ms-2">
                        {deliveryItems.length} medicamento(s) — {deliveryItems.reduce((s, i) => s + i.quantity, 0)} uds.
                      </CBadge>
                    </h6>
                    <CTable hover bordered responsive small>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Medicamento</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Lote</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Cantidad</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Beneficiarios</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Quitar</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {deliveryItems.map(it => (
                          <CTableRow key={it.id}>
                            <CTableDataCell>{it.medicine_name}</CTableDataCell>
                            <CTableDataCell className="text-center">{it.lot_number}</CTableDataCell>
                            <CTableDataCell className="text-center fw-bold">{it.quantity} uds.</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color="info">{it.beneficiaries_count} persona(s)</CBadge>
                              <div className="small text-body-secondary mt-1">
                                {it.beneficiaries.map(b => `${b.first_name} ${b.last_name}`).join(', ')}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButton color="danger" size="sm" onClick={() => removeDeliveryItem(it.id)}>✕</CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}

                {deliveryItems.length === 0 && form.source_id && !loadingSource && !selectedMedicineId && (
                  <div className="alert alert-secondary text-center py-2 mt-3">
                    Seleccione un medicamento del origen para ver los beneficiarios vinculados y agregar a la entrega.
                  </div>
                )}
              </div>

              {/* ═══ SECCIÓN 3: DATOS DEL DESPACHO ═══ */}
              <div className="mb-4 p-3 border rounded">
                <h6 className="fw-bold text-primary mb-3">
                  <CIcon icon={cilTruck} className="me-2" />
                  3. Datos del Despacho
                </h6>
                <CRow>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Responsable de Entrega *</CFormLabel>
                      <CFormSelect name="delivery_user_id" value={form.delivery_user_id} onChange={handleChange} required>
                        <option value="">Seleccione responsable</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.first_name} {u.last_name} {u.position ? ` — ${u.position}` : ''}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Fecha de Entrega *</CFormLabel>
                      <CFormInput
                        type="date"
                        name="delivery_date"
                        value={form.delivery_date}
                        min={todayStr}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Tipo de Entrega</CFormLabel>
                      <CFormSelect name="delivery_type" value={form.delivery_type} onChange={handleChange}>
                        {DELIVERY_TYPES.map(dt => (<option key={dt.value} value={dt.value}>{dt.label}</option>))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Punto de Entrega</CFormLabel>
                      <CFormInput name="delivery_point" value={form.delivery_point} onChange={handleChange} placeholder="Dirección o sede" />
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Estado de la Entrega</CFormLabel>
                      <CFormSelect name="status" value={form.status} onChange={handleChange}>
                        {DELIVERY_STATUSES.map(ds => (<option key={ds.value} value={ds.value}>{ds.label}</option>))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Firma / Comprobante</CFormLabel>
                      <CFormInput name="digital_signature" value={form.digital_signature} onChange={handleChange} placeholder="Código o firma digital" />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={12}>
                    <div className="mb-3">
                      <CFormLabel className="fw-semibold">Observaciones</CFormLabel>
                      <CFormTextarea name="observations" rows="2" value={form.observations} onChange={handleChange} placeholder="Notas adicionales..." />
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* ═══ BOTONES ═══ */}
              <div className="d-flex gap-2 mt-4">
                <CButton color="primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <><CSpinner size="sm" className="me-2" /> Registrando...</>
                  ) : (
                    <><CIcon icon={cilSave} className="me-2" /> Confirmar Entrega</>
                  )}
                </CButton>
                <CButton color="secondary" type="reset" disabled={submitting}>
                  <CIcon icon={cilReload} className="me-2" /> Limpiar
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
