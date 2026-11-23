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
import { cilSave, cilReload, cilGift, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/donaciones/DonationRegister.css'
import {
    getDonors,
    getDonationTypes,
    getUsers,
    createDonation,
    getMedicines
} from '../../services/api'
import HelpButton from '../common/HelpButton'
import ToastNotification from '../common/ToastNotification'

const DonationRegister = () => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const showToast = (message, type = 'info') => {
        setToast({ show: false, message: '', type });
        setTimeout(() => setToast({ show: true, message, type }), 20);
    };

    // Listas para selects
    const [donors, setDonors] = useState([])
    const [donationTypes, setDonationTypes] = useState([])
    const [users, setUsers] = useState([])
    const [medicinesCatalog, setMedicinesCatalog] = useState([])

    // Fecha mínima: primer día del mes actual
    const dateMinReception = useMemo(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
    }, [])
    // Fecha máxima: hoy
    const dateMaxReception = useMemo(() => new Date().toISOString().split('T')[0], [])
    // Fecha mínima para vencimiento: mañana
    const dateMinExpiration = useMemo(() => {
        const d = new Date()
        d.setDate(d.getDate() + 1)
        return d.toISOString().split('T')[0]
    }, [])

    // Formulario principal — solo campos esenciales
    const [form, setForm] = useState({
        donor_id: '',
        donation_type_id: '',
        receiver_user_id: '',
        reception_date: new Date().toISOString().split('T')[0],
        document_number: '',
        observations: '',
        status: 'Received'
    })

    // Medicamentos agregados a la donación
    const [medicines, setMedicines] = useState([])
    const [newMedicine, setNewMedicine] = useState({
        medicine_id: '',
        quantity: '',
        lot_number: '',
        expiration_date: ''
    })

    // Carga inicial de datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donorsRes, donationTypesRes, usersRes, medicinesRes] = await Promise.all([
                    getDonors(),
                    getDonationTypes().catch(() => null),
                    getUsers().catch(() => null),
                    getMedicines().catch(() => null)
                ])

                if (donorsRes?.message?.donors) setDonors(donorsRes.message.donors)

                if (donationTypesRes?.message?.donationTypes) {
                    const allTypes = donationTypesRes.message.donationTypes
                    const soloMedicamento = allTypes.filter(
                        tipo => tipo.name && tipo.name.toLowerCase().includes('medicamento')
                    )
                    setDonationTypes(soloMedicamento)
                }

                if (usersRes?.message?.users) setUsers(usersRes.message.users)
                if (medicinesRes?.message?.medicines) setMedicinesCatalog(medicinesRes.message.medicines)
            } catch (error) {
                console.error('Error cargando datos:', error)
                showToast('Error al cargar catálogos.', 'danger')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleNewMedicineChange = (e) => {
        const { name, value } = e.target
        setNewMedicine(prev => ({ ...prev, [name]: value }))
    }

    const addMedicine = () => {
        if (!newMedicine.medicine_id || !newMedicine.quantity || !newMedicine.lot_number || !newMedicine.expiration_date) {
            showToast('Complete todos los campos del medicamento (medicamento, cantidad, lote y fecha de vencimiento)', 'warning')
            return
        }

        const qty = parseInt(newMedicine.quantity)
        if (isNaN(qty) || qty <= 0) {
            showToast('La cantidad debe ser mayor a 0', 'warning')
            return
        }

        // Validar que la fecha de vencimiento sea posterior a hoy
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const expDate = new Date(newMedicine.expiration_date + 'T00:00:00')
        if (expDate <= today) {
            showToast('La fecha de vencimiento debe ser posterior a hoy', 'warning')
            return
        }

        const selectedMed = medicinesCatalog.find(m => m.id === newMedicine.medicine_id)
        if (!selectedMed) return

        // Evitar duplicados de lote
        if (medicines.some(m => m.lot_number === newMedicine.lot_number)) {
            showToast('Ya existe un medicamento con ese número de lote en esta donación', 'warning')
            return
        }

        setMedicines(prev => [...prev, {
            id: Date.now(),
            medicine_id: newMedicine.medicine_id,
            commercial_name: selectedMed.commercial_name,
            generic_name: selectedMed.generic_name,
            quantity: qty,
            lot_number: newMedicine.lot_number,
            expiration_date: newMedicine.expiration_date
        }])

        setNewMedicine({ medicine_id: '', quantity: '', lot_number: '', expiration_date: '' })
        setToast({ show: false, message: '', type: 'info' })
    }

    const removeMedicine = (id) => {
        setMedicines(prev => prev.filter(m => m.id !== id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.donor_id) {
            showToast('Seleccione un donante', 'warning')
            return
        }
        if (!form.donation_type_id) {
            showToast('Seleccione el tipo de donación', 'warning')
            return
        }
        if (!form.reception_date) {
            showToast('Ingrese la fecha de recepción', 'warning')
            return
        }

        // Validar fecha de recepción: mínimo primer día del mes actual, máximo hoy
        const recDate = new Date(form.reception_date + 'T00:00:00')
        const minDate = new Date(dateMinReception + 'T00:00:00')
        const maxDate = new Date(dateMaxReception + 'T00:00:00')
        if (recDate < minDate || recDate > maxDate) {
            showToast('La fecha de recepción debe estar dentro del mes actual y no ser futura', 'warning')
            return
        }

        if (medicines.length === 0) {
            showToast('Debe agregar al menos un medicamento a la donación', 'warning')
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                donor_id: form.donor_id,
                donation_type_id: form.donation_type_id,
                receiver_user_id: form.receiver_user_id || null,
                reception_date: form.reception_date,
                document_number: form.document_number || null,
                observations: form.observations || null,
                status: form.status,
                medicines: medicines.map(m => ({
                    medicine_id: m.medicine_id,
                    quantity: m.quantity,
                    lot_number: m.lot_number,
                    expiration_date: m.expiration_date
                }))
            }

            await createDonation(payload)
            showToast('Donación registrada exitosamente', 'success')
            handleReset()
        } catch (error) {
            showToast(error.message || 'Error al registrar la donación', 'danger')
        } finally {
            setSubmitting(false)
        }
    }

    const handleReset = () => {
        setForm({
            donor_id: '',
            donation_type_id: '',
            receiver_user_id: '',
            reception_date: new Date().toISOString().split('T')[0],
            document_number: '',
            observations: '',
            status: 'Received'
        })
        setMedicines([])
        setNewMedicine({ medicine_id: '', quantity: '', lot_number: '', expiration_date: '' })
        setToast({ show: false, message: '', type: 'info' })
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
        <div className="donation-register-container">
            <CCard className="donation-register-card">
                <CCardHeader>
                    <h5 className="mb-0 d-flex align-items-center">
                        <CIcon icon={cilGift} className="me-2" />
                        Registrar Nueva Donación
                        <HelpButton title="Manual de Usuario – Registrar Donación">
                            <div>
                                <p><strong>¿Qué hace esta pantalla?</strong><br />
                                    Registra una donación de medicamentos recibida por FarmaPatria. Cada donación debe incluir los medicamentos específicos con su lote y fecha de vencimiento.</p>
                                <h6>🧪 Ejemplo de formulario completo</h6>
                                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--cui-border-color)' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1 1 45%' }}><strong>Donante *</strong><br />Ministerio de Salud (G-20001234-1)</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Tipo de Donación *</strong><br />Medicamentos</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>N° Documento/Acta</strong><br />ACTA-2026-00123</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Fecha Recepción *</strong><br />22/11/2026</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Receptor</strong><br />Carlos Mendoza</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Estado</strong><br />Recibido</div>
                                    </div>
                                    <hr />
                                    <p><strong>Medicamentos donados:</strong></p>
                                    <ul>
                                        <li>Amoxicilina 500mg – Lote LOTE-A01 – Vence: 01/09/2027 – 300 unidades</li>
                                        <li>Losartán 50mg – Lote LOTE-B02 – Vence: 15/01/2028 – 500 unidades</li>
                                    </ul>
                                </div>
                                <h6>📋 Validaciones</h6>
                                <ol>
                                    <li><strong>Donante * (obligatorio):</strong> Seleccione de la lista.</li>
                                    <li><strong>Tipo de Donación *:</strong> Solo tipo Medicamentos.</li>
                                    <li><strong>Fecha de Recepción *:</strong> Debe estar dentro del mes actual (no fechas pasadas de meses anteriores ni futuras).</li>
                                    <li><strong>Medicamentos Donados *:</strong> Al menos un medicamento. Cada uno requiere: medicamento, cantidad (&gt; 0), lote y fecha de vencimiento (posterior a hoy).</li>
                                    <li><strong>N° de Lote:</strong> No puede repetirse dentro de la misma donación.</li>
                                </ol>
                                <p><strong>⚠️ Importante:</strong> Los medicamentos crean lotes en el inventario al guardar la donación.</p>
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
                        {/* Información del Donante */}
                        <div className="form-section">
                            <h6 className="section-title">
                                <CIcon icon={cilGift} className="icon me-2" />
                                Información del Donante
                            </h6>
                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="donor_id" className="register-form-label">Donante *</CFormLabel>
                                        <CFormSelect id="donor_id" name="donor_id" className="register-form-select" value={form.donor_id} onChange={handleFormChange}>
                                            <option value="">Seleccione un donante</option>
                                            {donors.map(d => (
                                                <option key={d.id} value={d.id}>{d.name} {d.rif_cedula ? `- ${d.rif_cedula}` : ''}</option>
                                            ))}
                                        </CFormSelect>
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="donation_type_id" className="register-form-label">Tipo de Donación *</CFormLabel>
                                        <CFormSelect id="donation_type_id" name="donation_type_id" className="register-form-select" value={form.donation_type_id} onChange={handleFormChange}>
                                            <option value="">Seleccione tipo</option>
                                            {donationTypes.map(dt => (
                                                <option key={dt.id} value={dt.id}>{dt.name}</option>
                                            ))}
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Información de la Donación — Solo campos esenciales */}
                        <div className="form-section">
                            <h6 className="section-title">
                                <CIcon icon={cilGift} className="icon me-2" />
                                Información de la Donación
                            </h6>
                            <CRow>
                                <CCol md={4}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="document_number" className="register-form-label">N° Documento / Acta</CFormLabel>
                                        <CFormInput type="text" id="document_number" name="document_number" className="register-form-input" placeholder="Ej: ACTA-2026-00123" value={form.document_number} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                                <CCol md={4}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="reception_date" className="register-form-label">Fecha de Recepción *</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            id="reception_date"
                                            name="reception_date"
                                            className="register-form-input"
                                            value={form.reception_date}
                                            onChange={handleFormChange}
                                            min={dateMinReception}
                                            max={dateMaxReception}
                                        />
                                    </div>
                                </CCol>
                                <CCol md={4}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="receiver_user_id" className="register-form-label">Receptor (responsable)</CFormLabel>
                                        <CFormSelect id="receiver_user_id" name="receiver_user_id" className="register-form-select" value={form.receiver_user_id} onChange={handleFormChange}>
                                            <option value="">Seleccione receptor</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.first_name} {u.last_name} {u.position ? `- ${u.position}` : ''}</option>
                                            ))}
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={4}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="status" className="register-form-label">Estado de la Donación</CFormLabel>
                                        <CFormSelect id="status" name="status" className="register-form-select" value={form.status} onChange={handleFormChange}>
                                            <option value="Received">Recibido</option>
                                            <option value="Inspected">Inspeccionado</option>
                                            <option value="Accepted">Aceptado</option>
                                            <option value="Rejected">Rechazado</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                                <CCol md={8}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="observations" className="register-form-label">Observaciones</CFormLabel>
                                        <CFormTextarea id="observations" name="observations" className="register-form-input" rows="2" placeholder="Observaciones adicionales sobre la donación..." value={form.observations} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Medicamentos Donados */}
                        <div className="form-section">
                            <h6 className="section-title">
                                <CIcon icon={cilGift} className="icon me-2" />
                                Medicamentos Donados
                                <span className="badge bg-primary ms-2">
                                    {medicines.length} medicamento{medicines.length !== 1 ? 's' : ''} | Total: {medicines.reduce((sum, m) => sum + m.quantity, 0)} unidades
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
                                                name="medicine_id"
                                                value={newMedicine.medicine_id}
                                                onChange={handleNewMedicineChange}
                                            >
                                                <option value="">Seleccione medicamento</option>
                                                {medicinesCatalog.map(med => (
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
                                                name="quantity"
                                                placeholder="Ej: 100"
                                                min="1"
                                                value={newMedicine.quantity}
                                                onChange={handleNewMedicineChange}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="mb-3">
                                            <CFormLabel className="register-form-label">N° de Lote *</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                name="lot_number"
                                                placeholder="Ej: LOTE-A01"
                                                value={newMedicine.lot_number}
                                                onChange={handleNewMedicineChange}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="mb-3">
                                            <CFormLabel className="register-form-label">Fecha de Vencimiento *</CFormLabel>
                                            <CFormInput
                                                type="date"
                                                name="expiration_date"
                                                value={newMedicine.expiration_date}
                                                onChange={handleNewMedicineChange}
                                                min={dateMinExpiration}
                                            />
                                        </div>
                                    </CCol>
                                    <CCol md={12} className="text-end">
                                        <CButton color="primary" onClick={addMedicine}>
                                            <CIcon icon={cilPlus} className="me-1" /> Agregar Medicamento
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </div>

                            {/* Tabla de medicamentos agregados */}
                            {medicines.length > 0 ? (
                                <CTable hover bordered responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Medicamento</CTableHeaderCell>
                                            <CTableHeaderCell>Cantidad</CTableHeaderCell>
                                            <CTableHeaderCell>N° de Lote</CTableHeaderCell>
                                            <CTableHeaderCell>Fecha Vencimiento</CTableHeaderCell>
                                            <CTableHeaderCell>Acciones</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {medicines.map(med => (
                                            <CTableRow key={med.id}>
                                                <CTableDataCell>{med.commercial_name}</CTableDataCell>
                                                <CTableDataCell>{med.quantity} unds</CTableDataCell>
                                                <CTableDataCell><strong>{med.lot_number}</strong></CTableDataCell>
                                                <CTableDataCell>{new Date(med.expiration_date + 'T00:00:00').toLocaleDateString('es-VE')}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton color="danger" size="sm" onClick={() => removeMedicine(med.id)}>
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            ) : (
                                <div className="alert alert-info text-center">
                                    No hay medicamentos agregados a la donación. Use el formulario arriba para agregar medicamentos.
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2 btn-group-responsive mt-4">
                            <CButton color="primary" type="submit" className="register-btn-primary" disabled={submitting}>
                                {submitting ? <><CSpinner size="sm" className="me-2" /> Registrando...</> : <><CIcon icon={cilSave} className="me-2" /> Registrar Donación</>}
                            </CButton>
                            <CButton color="secondary" type="button" onClick={handleReset} className="register-btn-secondary">
                                <CIcon icon={cilReload} className="me-2" /> Limpiar Formulario
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default DonationRegister
