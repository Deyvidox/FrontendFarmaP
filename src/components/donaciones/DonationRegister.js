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
import { cilSave, cilReload, cilGift } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '../../css/donaciones/DonationRegister.css'

const DonationRegister = () => {
    const [alert, setAlert] = useState({ show: false, message: '', type: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Formulario de donación enviado')

        setAlert({
            show: true,
            message: 'Donación registrada exitosamente',
            type: 'success'
        })
    }

    const handleReset = () => {
        setAlert({ show: false, message: '', type: '' })
    }

    return (
        <div className="donation-register-container">
            <CCard className="donation-register-card">
                <CCardHeader>
                    <h5 className="mb-0">
                        <CIcon icon={cilGift} className="me-2" />
                        Registrar Nueva Donación
                    </h5>
                </CCardHeader>
                <CCardBody>
                    {alert.show && (
                        <div className={`alert alert-${alert.type} mb-4`}>
                            {alert.message}
                        </div>
                    )}

                    <CForm onSubmit={handleSubmit} onReset={handleReset}>
                        {/* Información del Donante */}
                        <div className="form-section">
                            <h6 className="section-title">
                                <CIcon icon={cilGift} className="icon me-2" />
                                Información del Donante
                            </h6>
                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonanteID" className="register-form-label">
                                            Donante *
                                        </CFormLabel>
                                        <CFormSelect id="DonanteID" name="DonanteID" className="register-form-select">
                                            <option value="">Seleccione un donante</option>
                                            <option value="1">Laboratorio XYZ</option>
                                            <option value="2">Farmacia ABC</option>
                                            <option value="3">Particular - Juan Pérez</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="TipoDonacionID" className="register-form-label">
                                            Tipo de Donación *
                                        </CFormLabel>
                                        <CFormSelect id="TipoDonacionID" name="TipoDonacionID" className="register-form-select">
                                            <option value="">Seleccione tipo</option>
                                            <option value="MEDICAMENTOS">Medicamentos</option>
                                            <option value="INSUMOS">Insumos Médicos</option>
                                            <option value="ECONOMICA">Donación Económica</option>
                                            <option value="EQUIPOS">Equipos Médicos</option>
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
                                        <CFormLabel htmlFor="DonNumeroDocumento" className="register-form-label">
                                            Número de Documento
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="DonNumeroDocumento"
                                            name="DonNumeroDocumento"
                                            className="register-form-input"
                                            placeholder="Ej: FACT-2024-00123"
                                        />
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonFechaRecepcion" className="register-form-label">
                                            Fecha Recepción *
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            id="DonFechaRecepcion"
                                            name="DonFechaRecepcion"
                                            className="register-form-input"
                                        />
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonFechaDocumentacion" className="register-form-label">
                                            Fecha Documentación
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            id="DonFechaDocumentacion"
                                            name="DonFechaDocumentacion"
                                            className="register-form-input"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonValorEstimadoTotal" className="register-form-label">
                                            Valor Estimado Total
                                        </CFormLabel>
                                        <CFormInput
                                            type="number"
                                            id="DonValorEstimadoTotal"
                                            name="DonValorEstimadoTotal"
                                            className="register-form-input"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="UsuarioReceptorID" className="register-form-label">
                                            Receptor *
                                        </CFormLabel>
                                        <CFormSelect id="UsuarioReceptorID" name="UsuarioReceptorID" className="register-form-select">
                                            <option value="">Seleccione receptor</option>
                                            <option value="1">Ana García - Farmacéutica</option>
                                            <option value="2">Carlos López - Almacén</option>
                                            <option value="3">María Rodríguez - Recepción</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonAlmacenDestino" className="register-form-label">
                                            Almacén Destino
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="DonAlmacenDestino"
                                            name="DonAlmacenDestino"
                                            className="register-form-input"
                                            placeholder="Ej: Almacén Principal"
                                        />
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonCondicionesTransporte" className="register-form-label">
                                            Condiciones de Transporte
                                        </CFormLabel>
                                        <CFormInput
                                            type="text"
                                            id="DonCondicionesTransporte"
                                            name="DonCondicionesTransporte"
                                            className="register-form-input"
                                            placeholder="Ej: Temperatura controlada 2-8°C"
                                        />
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonEstado" className="register-form-label">
                                            Estado de la Donación
                                        </CFormLabel>
                                        <CFormSelect id="DonEstado" name="DonEstado" className="register-form-select">
                                            <option value="RECIBIDO">Recibido</option>
                                            <option value="EN_PROCESO">En Proceso</option>
                                            <option value="VERIFICADO">Verificado</option>
                                            <option value="RECHAZADO">Rechazado</option>
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol md={12}>
                                    <div className="mb-3">
                                        <CFormLabel htmlFor="DonObservaciones" className="register-form-label">
                                            Observaciones
                                        </CFormLabel>
                                        <CFormTextarea
                                            id="DonObservaciones"
                                            name="DonObservaciones"
                                            className="register-form-input"
                                            rows="3"
                                            placeholder="Observaciones adicionales sobre la donación..."
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
                            >
                                <CIcon icon={cilSave} className="me-2" />
                                Registrar Donación
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

export default DonationRegister