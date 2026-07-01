import React, { useState, useEffect } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CBadge, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput, CFormLabel, CFormSelect, CRow, CCol, CSpinner, CAlert,
  CInputGroup, CInputGroupText
} from '@coreui/react'
import { cilPlus, cilPencil, cilTrash, cilIndustry, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getProviders, createProvider, updateProvider, deleteProvider } from '../../services/api'
import HelpButton from '../common/HelpButton'

const Providers = () => {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCriteria, setSearchCriteria] = useState('nombre')
  
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const [form, setForm] = useState({
    name: '',
    rif_cedula: '',
    main_contact: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    status: 'Active'
  })

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const response = await getProviders()
      setProviders(response?.message?.providers || [])
    } catch (err) {
      setError(err.message || 'Error al cargar proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ name: '', rif_cedula: '', main_contact: '', contact_phone: '', contact_email: '', address: '', status: 'Active' })
    setAlert({ show: false, message: '', type: '' })
    setModalVisible(true)
  }

  const handleOpenEdit = (provider) => {
    setEditingId(provider.id)
    setForm({
      name: provider.name || '',
      rif_cedula: provider.rif_cedula || '',
      main_contact: provider.main_contact || '',
      contact_phone: provider.contact_phone || '',
      contact_email: provider.contact_email || '',
      address: provider.address || '',
      status: provider.status || 'Active'
    })
    setAlert({ show: false, message: '', type: '' })
    setModalVisible(true)
  }

  const handleDeleteClick = (provider) => {
    setSelectedProvider(provider)
    setDeleteModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateProvider(editingId, form)
        setAlert({ show: true, message: 'Proveedor actualizado exitosamente', type: 'success' })
      } else {
        await createProvider(form)
        setAlert({ show: true, message: 'Proveedor registrado exitosamente', type: 'success' })
      }
      fetchProviders()
      setTimeout(() => setModalVisible(false), 1500)
    } catch (err) {
      setAlert({ show: true, message: err.message || 'Error al guardar', type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await deleteProvider(selectedProvider.id)
      setDeleteModal(false)
      fetchProviders()
    } catch (err) {
      window.alert(err.message || 'Error al eliminar proveedor')
    } finally {
      setSaving(false)
    }
  }

  if (loading && providers.length === 0) return <div className="text-center py-5"><CSpinner color="primary"/><p>Cargando proveedores...</p></div>
  if (error && providers.length === 0) return <CAlert color="danger">{error}</CAlert>

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilIndustry} className="me-2"/>Gestión de Proveedores
              <HelpButton title="Manual de Usuario – Gestión de Proveedores">
                <div>
                  <p>Administra los laboratorios y empresas distribuidoras del sistema.</p>
                  <h6>Lista de Proveedores</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-3 fw-bold">(1) Proveedor</div>
                      <div className="col-2 fw-bold">(2) RIF</div>
                      <div className="col-3 fw-bold">(3) Contacto Principal</div>
                      <div className="col-2 fw-bold">(4) Teléfono</div>
                      <div className="col-2 fw-bold">(5) Acciones</div>
                    </div>
                    <hr/>
                    <div className="row small text-muted">
                      <div className="col-3">Laboratorios Leti</div>
                      <div className="col-2">J-0001234</div>
                      <div className="col-3">Juan Pérez</div>
                      <div className="col-2">0212-5550123</div>
                      <div className="col-2">✏</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Proveedor:</strong> Nombre comercial o razón social.</li>
                    <li><strong>RIF:</strong> Número de registro fiscal.</li>
                    <li><strong>Contacto Principal:</strong> Persona de enlace (vendedor).</li>
                    <li><strong>Teléfono:</strong> Número de contacto directo.</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Editar (✏):</strong> Abre el formulario para actualizar teléfonos, correos y representantes.</li>
                      </ul>
                    </li>
                  </ol>
                  <p className="text-muted mb-4"><em>Nota: Use el botón "Nuevo Proveedor" para registrar aliados comerciales adicionales.</em></p>
                  
                  <h6>Registrar Nuevo Proveedor (Modal)</h6>
                  <div className="card p-3 bg-light border-primary">
                    <p className="small mb-2">Al hacer clic en <strong>"Nuevo Proveedor"</strong>, se abrirá una ventana flotante con el siguiente formulario:</p>
                    <ol className="small mb-0">
                      <li><strong>Nombre de la Empresa:</strong> Razón social o nombre comercial del laboratorio/distribuidora.</li>
                      <li><strong>RIF:</strong> Registro de Información Fiscal (Obligatorio).</li>
                      <li><strong>Contacto Principal:</strong> Nombre de la persona representante de ventas o enlace comercial.</li>
                      <li><strong>Teléfono y Correo:</strong> Medios de contacto directos para enviar requerimientos.</li>
                      <li><strong>Dirección:</strong> Ubicación de sus almacenes u oficinas comerciales.</li>
                    </ol>
                    <p className="small text-muted mt-2 mb-0"><em>Al hacer clic en "Guardar", el proveedor se añade automáticamente a la lista y estará disponible para realizar solicitudes.</em></p>
                  </div>
                </div>
              </HelpButton>
            </h5>
            <CButton color="primary" onClick={handleOpenCreate}>
              <CIcon icon={cilPlus} className="me-1"/>Nuevo Proveedor
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
                <option value="rif">RIF</option>
                <option value="contacto">Contacto</option>
              </CFormSelect>
            </CCol>
            <CCol md={9} xs={12}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput
                  placeholder={`Buscar por ${searchCriteria === 'rif' ? 'RIF' : searchCriteria === 'contacto' ? 'contacto' : 'nombre'}...`}
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
              {providers.filter(p => {
                const q = searchTerm.trim().toLowerCase();
                if (searchCriteria === 'rif') return (p.rif_cedula || '').toLowerCase().includes(q);
                if (searchCriteria === 'contacto') return (p.main_contact || '').toLowerCase().includes(q);
                return (p.name || '').toLowerCase().includes(q);
              }).length} resultado(s) de {providers.length} total
            </div>
          )}

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>RIF</CTableHeaderCell>
                <CTableHeaderCell>Contacto</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {providers.length === 0 ? (
                <CTableRow><CTableDataCell colSpan="6" className="text-center">No hay proveedores registrados</CTableDataCell></CTableRow>
              ) : (
                providers
                  .filter(p => {
                    const q = searchTerm.trim().toLowerCase();
                    if (!q) return true;
                    if (searchCriteria === 'rif') return (p.rif_cedula || '').toLowerCase().includes(q);
                    if (searchCriteria === 'contacto') return (p.main_contact || '').toLowerCase().includes(q);
                    return (p.name || '').toLowerCase().includes(q);
                  })
                  .map(p => (
                    <CTableRow key={p.id}>
                    <CTableDataCell><strong>{p.name}</strong></CTableDataCell>
                    <CTableDataCell>{p.rif_cedula || '—'}</CTableDataCell>
                    <CTableDataCell>{p.main_contact || '—'}</CTableDataCell>
                    <CTableDataCell>{p.contact_phone || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={p.status === 'Active' ? 'success' : 'secondary'}>
                        {p.status === 'Active' ? 'Activo' : 'Inactivo'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-2">
                        <CButton color="info" size="sm" onClick={() => handleOpenEdit(p)} title="Editar">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(p)} title="Eliminar">
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Crear/Editar */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CForm onSubmit={handleSubmit}>
          <CModalHeader><CModalTitle>{editingId ? 'Editar' : 'Registrar'} Proveedor</CModalTitle></CModalHeader>
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
                  <CFormLabel>RIF</CFormLabel>
                  <CFormInput name="rif_cedula" value={form.rif_cedula} onChange={handleChange} />
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
              <CCol md={6}>
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
              {editingId && (
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel>Estado</CFormLabel>
                    <CFormSelect name="status" value={form.status} onChange={handleChange}>
                      <option value="Active">Activo</option>
                      <option value="Inactive">Inactivo</option>
                    </CFormSelect>
                  </div>
                </CCol>
              )}
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={saving}>
              {saving ? <><CSpinner size="sm" className="me-2"/>Guardando...</> : 'Guardar Proveedor'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal Eliminar */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton><CModalTitle>Confirmar Eliminación</CModalTitle></CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar al proveedor <strong>{selectedProvider?.name}</strong>? Se marcará como Inactivo en el sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={saving}>{saving ? <CSpinner size="sm"/> : 'Eliminar'}</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Providers
