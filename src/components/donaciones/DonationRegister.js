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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CSpinner
} from '@coreui/react'
import { cilSave, cilReload, cilGift } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/donaciones/DonationRegister.css'
import {
    getDonors,
    createDonor,
    getDonationTypes,
    getUsers,
    createDonation,
    getDonorTypes
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
    const [donorTypesList, setDonorTypesList] = useState([])

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

    // Carga inicial de datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donorsRes, donationTypesRes, usersRes, donorTypesRes] = await Promise.all([
                    getDonors(),
                    getDonationTypes().catch(() => null),
                    getUsers().catch(() => null),
                    getDonorTypes().catch(() => null)
                ])

                if (donorsRes?.message?.donors) {
                    setDonors(donorsRes.message.donors)
                }
                if (donationTypesRes?.message?.donationTypes) {
                    setDonationTypes(donationTypesRes.message.donationTypes)
                }
                if (usersRes?.message?.users) {
                    setUsers(usersRes.message.users)
                }
                if (donorTypesRes?.message?.donorTypes) {
                    setDonorTypesList(donorTypesRes.message.donorTypes)
                }
            } catch (error) {
                console.error('Error cargando datos:', error)
                setAlert({
                    show: true,
                    message: 'Error al cargar los datos iniciales. Verifique la conexión.',
                    type: 'danger'
                })
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

    // Enviar formulario principal
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
                observations: form.observations || null
            }

            await createDonation(payload)
            setAlert({ show: true, message: 'Donación registrada exitosamente', type: 'success' })
            handleReset()
        } catch (error) {
            setAlert({
                show: true,
                message: error.message || 'Error al registrar la donación',
                type: 'danger'
            })
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
                                <p>Formulario para ingresar nuevas donaciones al inventario.</p>
                                <h6>Registro de Donación</h6>
                                <div className="card p-3 mb-3 bg-light">
                                    <div className="row g-2 small">
                                        <div className="col-md-6"><span className="fw-bold">(1) Donante *</span><br/>Seleccione (O use el botón +)</div>
                                        <div className="col-md-6"><span className="fw-bold">(2) Tipo de Donación</span><br/>Medicamentos / Equipos</div>
                                        <div className="col-md-6"><span className="fw-bold">(3) Documento Ref.</span><br/>Ej: ACT-001</div>
                                        <div className="col-md-6"><span className="fw-bold">(4) Fecha de Ingreso</span><br/>10-10-2023</div>
                                        <div className="col-12"><span className="fw-bold">(5) Almacén Destino</span><br/>Seleccione Almacén Central</div>
                                        <div className="col-12 mt-2"><span className="fw-bold">(6) Lista de Medicamentos</span><br/><button className="btn btn-sm border">Añadir Artículo</button></div>
                                    </div>
                                </div>
                                <ol>
                                    <li><strong>Donante:</strong> Obligatorio. Si no está en lista, créelo con "+".</li>
                                    <li><strong>Tipo:</strong> Indica qué se está recibiendo.</li>
                                    <li><strong>Documento Ref.:</strong> Número de acta o factura asociada.</li>
                                    <li><strong>Fecha:</strong> Cuándo ingresa físicamente al sistema.</li>
                                    <li><strong>Almacén Destino:</strong> Dónde se almacenará físicamente.</li>
                                    <li><strong>Lista de Medicamentos:</strong> Sección para detallar qué medicamentos específicos y qué cantidades vienen en la donación.</li>
                                </ol>
                                <p className="text-muted"><em>Al guardar, los artículos entrarán al proceso de verificación.</em></p>
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
                                        <CFormLabel htmlFor="donor_id" className="register-form-label">
                                            Donante *
                                        </CFormLabel>
                                        <div className="d-flex gap-2 align-items-start">
                                            <CFormSelect
                                                id="donor_id"
                                                name="donor_id"
                                                className="register-form-select"
                                                value={form.donor_id}
                                                onChange={handleFormChange}
                                            >
                                                <option value="">Seleccione un donante</option>
                                                {donors.map(d => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.name} {d.rif_cedula ? `- ${d.rif_cedula}` : ''}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="donation_type_id" className="register-form-label">
                                            Tipo de Donación *
                                        </CFormLabel>
                                        <CFormSelect
                                            id="donation_type_id"
                                            name="donation_type_id"
                                            className="register-form-select"
                                            value={form.donation_type_id}
                                            onChange={handleFormChange}
                                        >
                                            <option value="">Seleccione tipo</option>
                                            {donationTypes.map(dt => (
                                                <option key={dt.id} value={dt.id}>
                                                    {dt.name}
                                                </option>
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
                                        <CFormLabel htmlFor="document_number" className="register-form-label">
                                            Número de Documento
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="document_number"
                                            name="document_number"
                                            className="register-form-input"
                                            placeholder="Ej: FACT-2024-00123"
                                            value={form.document_number}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="reception_date" className="register-form-label">
                                            Fecha Recepción *
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            id="reception_date"
                                            name="reception_date"
                                            className="register-form-input"
                                            value={form.reception_date}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="documentation_date" className="register-form-label">
                                            Fecha Documentación
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            id="documentation_date"
                                            name="documentation_date"
                                            className="register-form-input"
                                            value={form.documentation_date}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>

                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="receiver_user_id" className="register-form-label">
                                            Receptor
                                        </CFormLabel>
                                        <CFormSelect
                                            id="receiver_user_id"
                                            name="receiver_user_id"
                                            className="register-form-select"
                                            value={form.receiver_user_id}
                                            onChange={handleFormChange}
                                        >
                                            <option value="">Seleccione receptor</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.first_name} {u.last_name} {u.position ? `- ${u.position}` : ''}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="destination_warehouse" className="register-form-label">
                                            Almacén Destino
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="destination_warehouse"
                                            name="destination_warehouse"
                                            className="register-form-input"
                                            placeholder="Ej: Almacén Principal"
                                            value={form.destination_warehouse}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="transport_conditions" className="register-form-label">
                                            Condiciones de Transporte
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="transport_conditions"
                                            name="transport_conditions"
                                            className="register-form-input"
                                            placeholder="Ej: Temperatura controlada 2-8°C"
                                            value={form.transport_conditions}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="status" className="register-form-label">
                                            Estado de la Donación
                                        </CFormLabel>
                                        <CFormSelect
                                            id="status"
                                            name="status"
                                            className="register-form-select"
                                            value={form.status}
                                            onChange={handleFormChange}
                                        >
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
                                        <CFormLabel htmlFor="observations" className="register-form-label">
                                            Observaciones
                                        </CFormLabel>
                                        <CFormTextarea
                                            id="observations"
                                            name="observations"
                                            className="register-form-input"
                                            rows="3"
                                            placeholder="Observaciones adicionales sobre la donación..."
                                            value={form.observations}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        <div className="d-flex gap-2 btn-group-responsive">
                            <CButton
                                color="primary"
                                type="submit"
                                className="register-btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <><CSpinner size="sm" className="me-2" /> Registrando...</>
                                ) : (
                                    <><CIcon icon={cilSave} className="me-2" /> Registrar Donación</>
                                )}
                            </CButton>
                            <CButton
                                color="secondary"
                                type="button"
                                className="register-btn-secondary"
                                onClick={handleReset}
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

export default DonationRegister