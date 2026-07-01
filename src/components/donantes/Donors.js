import React, { useState, useEffect } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CBadge, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput, CFormLabel, CFormSelect, CRow, CCol, CSpinner, CAlert,
  CInputGroup, CInputGroupText
} from '@coreui/react'
import { cilPlus, cilPencil, cilUser, cilTrash, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getDonors, createDonor, getDonorTypes, updateDonor, deleteDonor } from '../../services/api'
import HelpButton from '../common/HelpButton'

const Donors = () => {
  const [donors, setDonors] = useState([])
  const [donorTypes, setDonorTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCriteria, setSearchCriteria] = useState('nombre')
  
  const [modalVisible, setModalVisible] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState(null)
  
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const [form, setForm] = useState({
    name: '', rif_cedula: '', main_contact: '', contact_phone: '', contact_email: '', address: '', donor_type_id: ''
  })
  const [editForm, setEditForm] = useState({})

  const loadData = async () => {
    setLoading(true)
    try {
      const [donorsRes, typesRes] = await Promise.all([
        getDonors(),
        getDonorTypes().catch(() => null)
      ])
      setDonors(donorsRes?.message?.donors || [])
      setDonorTypes(typesRes?.message?.donorTypes || [])
    } catch (err) {
      setError(err.message || 'Error al cargar donantes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenCreate = () => {
    setForm({ name: '', rif_cedula: '', main_contact: '', contact_phone: '', contact_email: '', address: '', donor_type_id: '' })
    setAlert({ show: false, message: '', type: '' })
    setModalVisible(true)
  }

  const handleEditClick = (donor) => {
    setSelectedDonor(donor)
    setEditForm({
      name: donor.name || '',
      rif_cedula: donor.rif_cedula || '',
      main_contact: donor.main_contact || '',
      contact_phone: donor.contact_phone || '',
      contact_email: donor.contact_email || '',
      address: donor.address || '',
      donor_type_id: donor.donor_type_id || '',
      status: donor.status || 'Active'
    })
    setAlert({ show: false, message: '', type: '' })
    setEditModal(true)
  }

  const handleDeleteClick = (donor) => {
    setSelectedDonor(donor)
    setDeleteModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.donor_type_id) {
        setAlert({ show: true, message: 'El tipo de donante es requerido', type: 'danger' })
        return
    }
    setSaving(true)
    try {
      await createDonor(form)
      setAlert({ show: true, message: 'Donante registrado exitosamente', type: 'success' })
      loadData()
      setTimeout(() => setModalVisible(false), 1500)
    } catch (err) {
      setAlert({ show: true, message: err.message || 'Error al guardar', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editForm.donor_type_id) {
        setAlert({ show: true, message: 'El tipo de donante es requerido', type: 'danger' })
        return
    }
    setSaving(true)
    try {
      await updateDonor(selectedDonor.id, editForm)
      setAlert({ show: true, message: 'Donante actualizado exitosamente', type: 'success' })
      loadData()
      setTimeout(() => setEditModal(false), 1500)
    } catch (err) {
      setAlert({ show: true, message: err.message || 'Error al actualizar', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await deleteDonor(selectedDonor.id)
      setDeleteModal(false)
      loadData()
    } catch (err) {
      window.alert(err.message || 'Error al eliminar donante')
    } finally {
      setSaving(false)
    }
  }

  if (loading && donors.length === 0) return <div className="text-center py-5"><CSpinner color="primary"/><p>Cargando donantes...</p></div>
  if (error && donors.length === 0) return <CAlert color="danger">{error}</CAlert>

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilUser} className="me-2"/>Gestión de Donantes
              <HelpButton title="Manual de Usuario – Gestión de Donantes">
                <div>
                  <p>Administra las instituciones o personas que aportan al sistema.</p>
                  <h6>Lista de Donantes</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-3 fw-bold">(1) Nombre / Razón Social</div>
                      <div className="col-2 fw-bold">(2) RIF/ID</div>
                      <div className="col-2 fw-bold">(3) Tipo</div>
                      <div className="col-3 fw-bold">(4) Contacto</div>
                      <div className="col-2 fw-bold">(5) Acciones</div>
                    </div>
                    <hr/>
                    <div className="row small text-muted">
                      <div className="col-3">Cruz Roja</div>
                      <div className="col-2">J-123456789</div>
                      <div className="col-2">Institución</div>
                      <div className="col-3">info@cruzroja.org</div>
                      <div className="col-2">✏ 🗑</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Nombre:</strong> Razón social o nombre completo.</li>
                    <li><strong>RIF/ID:</strong> Documento de identidad o tributario.</li>
                    <li><strong>Tipo:</strong> Persona natural, jurídica u ONG.</li>
                    <li><strong>Contacto:</strong> Correo y teléfono asociado.</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Editar:</strong> Actualizar datos del donante.</li>
                        <li><strong>Eliminar:</strong> Cambiar estado a inactivo (no borra histórico).</li>
                      </ul>
                    </li>
                  </ol>

                  <h6 className="mt-4">Registrar Nuevo Donante (Modal)</h6>
                  <div className="card p-3 bg-light border-primary">
                    <p className="small mb-2">Al hacer clic en <strong>"Nuevo Donante"</strong>, se abrirá una ventana flotante para ingresar los datos:</p>
                    <ol className="small mb-0">
                      <li><strong>Tipo de Donante:</strong> Selecciona si es Persona Natural, Empresa/Institución, u ONG.</li>
                      <li><strong>Nombre / Razón Social:</strong> Nombre completo o razón social de la empresa.</li>
                      <li><strong>RIF / Cédula:</strong> Documento de identidad fiscal para trazabilidad.</li>
                      <li><strong>Datos de Contacto:</strong> Teléfono, correo electrónico y dirección detallada de procedencia.</li>
                    </ol>
                    <p className="small text-muted mt-2 mb-0"><em>Al hacer clic en "Guardar", el donante se añadirá al catálogo para ser usado al recibir donaciones.</em></p>
                  </div>
                </div>
              </HelpButton>
            </h5>
            <CButton color="primary" onClick={handleOpenCreate}>
              <CIcon icon={cilPlus} className="me-1"/>Nuevo Donante
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3} xs={12} className="mb-2 mb-md-0">
              <CFormSelect
                value={searchCriteria}
                onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); }}
              >
                <option value="nombre">Nombre</option>
                <option value="rif">RIF/Cédula</option>
                <option value="contacto">Contacto</option>
              </CFormSelect>
            </CCol>
            <CCol md={9} xs={12}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput
                  placeholder={`Buscar por ${searchCriteria === 'rif' ? 'RIF/Cédula' : searchCriteria === 'contacto' ? 'contacto' : 'nombre'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <CButton color="secondary" variant="outline" onClick={() => setSearchTerm('')}>&#x2715;</CButton>
                )}
              </CInputGroup>
            </CCol>
          </CRow>

          {searchTerm && (
            <div className="text-muted small mb-2">
              {donors.filter(d => {
                const q = searchTerm.trim().toLowerCase();
                if (searchCriteria === 'rif') return (d.rif_cedula || '').toLowerCase().includes(q);
                if (searchCriteria === 'contacto') return (d.main_contact || '').toLowerCase().includes(q);
                return (d.name || '').toLowerCase().includes(q);
              }).length} resultado(s) de {donors.length} total
            </div>
          )}

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Cédula/RIF</CTableHeaderCell>
                <CTableHeaderCell>Contacto</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {donors.length === 0 ? (
                <CTableRow><CTableDataCell colSpan="7" className="text-center">No hay donantes registrados</CTableDataCell></CTableRow>
              ) : (
                donors
                  .filter(d => {
                    const q = searchTerm.trim().toLowerCase();
                    if (!q) return true;
                    if (searchCriteria === 'rif') return (d.rif_cedula || '').toLowerCase().includes(q);
                    if (searchCriteria === 'contacto') return (d.main_contact || '').toLowerCase().includes(q);
                    return (d.name || '').toLowerCase().includes(q);
                  })
                  .map(d => (
                    <CTableRow key={d.id}>
                    <CTableDataCell><strong>{d.name}</strong></CTableDataCell>
                    <CTableDataCell>{d.donor_type || '—'}</CTableDataCell>
                    <CTableDataCell>{d.rif_cedula || '—'}</CTableDataCell>
                    <CTableDataCell>{d.main_contact || '—'}</CTableDataCell>
                    <CTableDataCell>{d.contact_phone || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={d.status === 'Active' ? 'success' : 'secondary'}>
                        {d.status === 'Active' ? 'Activo' : 'Inactivo'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-2">
                        <CButton color="warning" size="sm" onClick={() => handleEditClick(d)} title="Editar"><CIcon icon={cilPencil} /></CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(d)} title="Eliminar"><CIcon icon={cilTrash} /></CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Crear */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CForm onSubmit={handleSubmit}>
          <CModalHeader><CModalTitle>Registrar Donante</CModalTitle></CModalHeader>
          <CModalBody>
            {alert.show && <CAlert color={alert.type}>{alert.message}</CAlert>}
            <CRow>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Nombre / Razón Social *</CFormLabel>
                  <CFormInput name="name" value={form.name} onChange={handleChange} required />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Cédula / RIF</CFormLabel>
                  <CFormInput name="rif_cedula" value={form.rif_cedula} onChange={handleChange} />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Tipo de Donante *</CFormLabel>
                  <CFormSelect name="donor_type_id" value={form.donor_type_id} onChange={handleChange} required>
                    <option value="">Seleccione tipo</option>
                    {donorTypes.map(dt => <option key={dt.id} value={dt.id}>{dt.name}</option>)}
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Contacto Principal</CFormLabel>
                  <CFormInput name="main_contact" value={form.main_contact} onChange={handleChange} />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Teléfono</CFormLabel>
                  <CFormInput name="contact_phone" value={form.contact_phone} onChange={handleChange} />
                </div>
              </CCol>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput type="email" name="contact_email" value={form.contact_email} onChange={handleChange} />
                </div>
              </CCol>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Dirección</CFormLabel>
                  <CFormInput name="address" value={form.address} onChange={handleChange} />
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={saving}>
              {saving ? <><CSpinner size="sm" className="me-2"/>Guardando...</> : 'Guardar Donante'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal Editar */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CForm onSubmit={handleEditSubmit}>
          <CModalHeader><CModalTitle>Editar Donante</CModalTitle></CModalHeader>
          <CModalBody>
            {alert.show && <CAlert color={alert.type}>{alert.message}</CAlert>}
            <CRow>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Nombre / Razón Social *</CFormLabel>
                  <CFormInput name="name" value={editForm.name || ''} onChange={handleEditChange} required />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Cédula / RIF</CFormLabel>
                  <CFormInput name="rif_cedula" value={editForm.rif_cedula || ''} onChange={handleEditChange} />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Tipo de Donante *</CFormLabel>
                  <CFormSelect name="donor_type_id" value={editForm.donor_type_id || ''} onChange={handleEditChange} required>
                    <option value="">Seleccione tipo</option>
                    {donorTypes.map(dt => <option key={dt.id} value={dt.id}>{dt.name}</option>)}
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Contacto Principal</CFormLabel>
                  <CFormInput name="main_contact" value={editForm.main_contact || ''} onChange={handleEditChange} />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Teléfono</CFormLabel>
                  <CFormInput name="contact_phone" value={editForm.contact_phone || ''} onChange={handleEditChange} />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Estado</CFormLabel>
                  <CFormSelect name="status" value={editForm.status || ''} onChange={handleEditChange}>
                    <option value="Active">Activo</option>
                    <option value="Inactive">Inactivo</option>
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput type="email" name="contact_email" value={editForm.contact_email || ''} onChange={handleEditChange} />
                </div>
              </CCol>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Dirección</CFormLabel>
                  <CFormInput name="address" value={editForm.address || ''} onChange={handleEditChange} />
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={saving}>
              {saving ? <><CSpinner size="sm" className="me-2"/>Guardando...</> : 'Guardar Cambios'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal Eliminar */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton><CModalTitle>Confirmar Eliminación</CModalTitle></CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar al donante <strong>{selectedDonor?.name}</strong>? Se marcará como Inactivo en el sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={saving}>{saving ? <CSpinner size="sm"/> : 'Eliminar'}</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Donors
