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
    getDonorTypes,
    getMedicines
} from '../../services/api'
import HelpButton from '../common/HelpButton'

const DonationRegister = () => {
    const [alert, setAlert] = useState({ show: false, message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Listas para selects
    const [donors, setDonors] = useState([])
    const [donationTypes, setDonationTypes] = useState([])
    const [users, setUsers] = useState([])
    const [medicinesCatalog, setMedicinesCatalog] = useState([])

    // Formulario principal
    const [form, setForm] = useState({
        donor_id: '',
        donation_type_id: '',
        receiver_user_id: '',
        reception_date: new Date().toISOString().split('T')[0],
        documentation_date: '',
        document_number: '',
        estimated_total_value: '',
        destination_warehouse: '',
        transport_conditions: '',
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
                setAlert({ show: true, message: 'Error al cargar catálogos.', type: 'danger' })
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
            setAlert({ show: true, message: 'Complete todos los campos del medicamento (medicamento, cantidad, lote y fecha de vencimiento)', type: 'warning' })
            return
        }

        const selectedMed = medicinesCatalog.find(m => m.id === newMedicine.medicine_id)
        if (!selectedMed) return

        // Evitar duplicados de lote
        if (medicines.some(m => m.lot_number === newMedicine.lot_number)) {
            setAlert({ show: true, message: 'Ya existe un medicamento con ese número de lote en esta donación', type: 'warning' })
            return
        }

        setMedicines(prev => [...prev, {
            id: Date.now(),
            medicine_id: newMedicine.medicine_id,
            commercial_name: selectedMed.commercial_name,
            generic_name: selectedMed.generic_name,
            quantity: parseInt(newMedicine.quantity),
            lot_number: newMedicine.lot_number,
            expiration_date: newMedicine.expiration_date
        }])

        setNewMedicine({ medicine_id: '', quantity: '', lot_number: '', expiration_date: '' })
        setAlert({ show: false, message: '', type: '' })
    }

    const removeMedicine = (id) => {
        setMedicines(prev => prev.filter(m => m.id !== id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.donor_id) {
            setAlert({ show: true, message: 'Seleccione un donante', type: 'warning' })
            return
        }
        if (!form.donation_type_id) {
            setAlert({ show: true, message: 'Seleccione el tipo de donación', type: 'warning' })
            return
        }
        if (medicines.length === 0) {
            setAlert({ show: true, message: 'Debe agregar al menos un medicamento a la donación', type: 'warning' })
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                ...form,
                estimated_total_value: form.estimated_total_value ? parseFloat(form.estimated_total_value) : null,
                receiver_user_id: form.receiver_user_id || null,
                documentation_date: form.documentation_date || null,
                document_number: form.document_number || null,
                destination_warehouse: form.destination_warehouse || null,
                transport_conditions: form.transport_conditions || null,
                observations: form.observations || null,
                medicines: medicines.map(m => ({
                    medicine_id: m.medicine_id,
                    quantity: m.quantity,
                    lot_number: m.lot_number,
                    expiration_date: m.expiration_date
                }))
            }

            await createDonation(payload)
            setAlert({ show: true, message: 'Donación registrada exitosamente', type: 'success' })
            handleReset()
        } catch (error) {
            setAlert({ show: true, message: error.message || 'Error al registrar la donación', type: 'danger' })
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
            documentation_date: '',
            document_number: '',
            estimated_total_value: '',
            destination_warehouse: '',
            transport_conditions: '',
            observations: '',
            status: 'Received'
        })
        setMedicines([])
        setNewMedicine({ medicine_id: '', quantity: '', lot_number: '', expiration_date: '' })
        setAlert({ show: false, message: '', type: '' })
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
                                    Registra una donación de medicamentos, incluyendo los medicamentos específicos, lotes y fechas de vencimiento. Esta información alimenta directamente el inventario.</p>
                                <h6>🧪 Ejemplo de formulario completo</h6>
                                <div style={{ background: '#f8f9fa', color: '#212529', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1 1 45%' }}><strong>Donante *</strong><br />Ministerio de Salud (G-20001234-1)</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Tipo de Donación *</strong><br />Medicamentos</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Número de Documento</strong><br />FACT-2024-00123</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Fecha Recepción *</strong><br />02/07/2026</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Receptor</strong><br />Carlos Mendoza</div>
                                        <div style={{ flex: '1 1 45%' }}><strong>Almacén Destino</strong><br />Almacén Principal</div>
                                    </div>
                                    <hr />
                                    <p><strong>Medicamentos donados:</strong></p>
                                    <ul>
                                        <li>Amoxicilina 500mg – Lote LOTE-A01 – Vence: 01/09/2026 – 300 unidades</li>
                                        <li>Losartán 50mg – Lote LOTE-B02 – Vence: 15/01/2027 – 500 unidades</li>
                                    </ul>
                                </div>
                                <h6>📋 Validaciones y uso</h6>
                                <ol>
                                    <li><strong>Donante * (obligatorio):</strong> Seleccione de la lista.</li>
                                    <li><strong>Tipo de Donación *:</strong> Siempre "Medicamentos".</li>
                                    <li><strong>Medicamentos Donados *:</strong> Agregue cada medicamento con su lote y fecha de vencimiento. Estos crearán lotes en el inventario al guardar.</li>
                                    <li><strong>Campos logísticos:</strong> Complete la información de recepción, almacén y transporte según corresponda.</li>
                                </ol>
                                <p><strong>⚠️ Importante:</strong> La donación debe tener al menos un medicamento. El número de lote no puede repetirse en una misma donación.</p>
                            </div>
                        </HelpButton>
                    </h5>
                </CCardHeader>
                <CCardBody>
                    {alert.show && (
                        <div className={`alert alert-${alert.type} mb-4 alert-dismissible fade show`} role="alert">
                            {alert.message}
                            <button type="button" className="btn-close" onClick={() => setAlert({ show: false, message: '', type: '' })}></button>
                        </div>
                    )}

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

                        {/* Información de la Donación */}
                        <div className="form-section">
                            <h6 className="section-title">
                                <CIcon icon={cilGift} className="icon me-2" />
                                Información de la Donación
                            </h6>
                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="document_number" className="register-form-label">Número de Documento</CFormLabel>
                                        <CFormInput type="text" id="document_number" name="document_number" className="register-form-input" placeholder="Ej: FACT-2024-00123" value={form.document_number} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="reception_date" className="register-form-label">Fecha Recepción *</CFormLabel>
                                        <CFormInput type="date" id="reception_date" name="reception_date" className="register-form-input" value={form.reception_date} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="documentation_date" className="register-form-label">Fecha Documentación</CFormLabel>
                                        <CFormInput type="date" id="documentation_date" name="documentation_date" className="register-form-input" value={form.documentation_date} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="receiver_user_id" className="register-form-label">Receptor</CFormLabel>
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
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="destination_warehouse" className="register-form-label">Almacén Destino</CFormLabel>
                                        <CFormInput type="text" id="destination_warehouse" name="destination_warehouse" className="register-form-input" placeholder="Ej: Almacén Principal" value={form.destination_warehouse} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="transport_conditions" className="register-form-label">Condiciones de Transporte</CFormLabel>
                                        <CFormInput type="text" id="transport_conditions" name="transport_conditions" className="register-form-input" placeholder="Ej: Temperatura controlada 2-8°C" value={form.transport_conditions} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={6}>
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
                            </CRow>
                            <CRow>
                                <CCol md={12}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="observations" className="register-form-label">Observaciones</CFormLabel>
                                        <CFormTextarea id="observations" name="observations" className="register-form-input" rows="3" placeholder="Observaciones adicionales sobre la donación..." value={form.observations} onChange={handleFormChange} />
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Medicamentos Donados (NUEVA SECCIÓN) */}
                        <div className="form-section">
                            <h6 className="section-title">
                                <CIcon icon={cilGift} className="icon me-2" />
                                Medicamentos Donados
                                <span className="badge bg-primary ms-2">
                                    {medicines.length} medicamentos | Total: {medicines.reduce((sum, m) => sum + m.quantity, 0)} unidades
                                </span>
                            </h6>

                            {/* Formulario para agregar medicamento */}
                            <div className="border rounded p-3 mb-4">
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
                                            <CFormLabel className="register-form-label">Número de Lote *</CFormLabel>
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
                                                min={new Date().toISOString().split('T')[0]}
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
                                            <CTableHeaderCell>Lote</CTableHeaderCell>
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
                                                <CTableDataCell>{new Date(med.expiration_date + 'T00:00:00').toLocaleDateString('es-ES')}</CTableDataCell>
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