import React, { useState, useEffect } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CRow, CCol, CSpinner, CForm, CFormLabel, CFormInput, CFormSelect,
  CInputGroup, CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPencil, cilTrash, cilPrint, cilDrop, cilSearch
} from '@coreui/icons';
import { getDonations, getDonationById, updateDonation, deleteDonation } from '../../services/api';
import HelpButton from '../common/HelpButton';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('donante');
  
  // Modals state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await getDonations();
      if (response?.message?.donations) {
        setDonations(response.message.donations);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Error al cargar las donaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const totalDonaciones = donations.length;
  const enInspeccion = donations.filter(d => d.status === 'Inspected' || d.status === 'InProcess').length;

  const getEstadoInfo = (status) => {
    switch(status) {
      case 'Received': return { label: 'Recibido', color: 'success' };
      case 'Inspected': return { label: 'Inspeccionado', color: 'info' };
      case 'InProcess': return { label: 'En Proceso', color: 'warning' };
      case 'Accepted': return { label: 'Aceptado', color: 'primary' };
      case 'Verified': return { label: 'Verificado', color: 'info' };
      case 'Rejected': return { label: 'Rechazado', color: 'danger' };
      case 'Quarantined': return { label: 'En Cuarentena', color: 'dark' };
      default: return { label: status || 'Desconocido', color: 'secondary' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '—';
    return `$${num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getShortId = (id) => {
    if (!id) return '';
    return `DON-${id.substring(0, 8).toUpperCase()}`;
  };

  const handleViewDetails = async (donation) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
    setLoadingDetail(true);
    try {
      const response = await getDonationById(donation.id);
      if (response?.message?.donation) {
        setSelectedDonation(response.message.donation);
      }
    } catch (err) {
      console.error('Error fetching donation detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEditClick = async (donation) => {
    setSelectedDonation(donation);
    setEditForm({
      donor_id: donation.donor_id || '',
      donation_type_id: donation.donation_type_id || '',
      reception_date: donation.reception_date ? donation.reception_date.split('T')[0] : '',
      document_number: donation.document_number || '',
      transport_conditions: donation.transport_conditions || '',
      observations: donation.observations || '',
      status: donation.status || 'Received'
    });
    setEditModal(true);
  };

  const handleDeleteClick = (donation) => {
    setSelectedDonation(donation);
    setDeleteModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateDonation(selectedDonation.id, editForm);
      setEditModal(false);
      fetchDonations();
    } catch (err) {
      alert(err.message || 'Error actualizando donación');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteDonation(selectedDonation.id);
      setDeleteModal(false);
      fetchDonations();
    } catch (err) {
      alert(err.message || 'Error eliminando donación');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilDrop} className="me-2" />
              Gestión de Donaciones
              <HelpButton title="Manual de Usuario - Gestión de Donaciones">
                <div className="text-muted">
                  <p><strong>Resumen</strong></p>
                  <ul>
                    <li>"2 Donaciones Totales", "0 En Inspección", "— Items Totales"</li>
                  </ul>
                  <p><strong>Filtro</strong></p>
                  <ul>
                    <li>Filtro: placeholder "Buscar por donante..."</li>
                  </ul>
                  <p><strong>Columnas:</strong></p>
                  <p>ID Donación | Donante | Fecha Recepción | Tipo | Estado | Acciones</p>
                  <p><strong>Datos de ejemplo:</strong></p>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                      <tbody>
                        <tr><td>DON-5046980D | Ministerio de Salud (G-20001234-1) | 26/6/2026 | Equipamiento | Recibido</td></tr>
                        <tr><td>DON-D4F0E840 | Vargas S.A. (J-30012345-1) | 10/3/2025 | Medicamentos | Aceptado</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </HelpButton>
            </h5>

          </div>
        </CCardHeader>
        
        <CCardBody>
          <CRow className="mb-4">
            <CCol md={4}>
              <div className="card text-center border-primary">
                <div className="card-body">
                  <div className="h4 text-primary mb-0">{totalDonaciones}</div>
                  <small className="text-muted">Donaciones Totales</small>
                </div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="card text-center border-warning">
                <div className="card-body">
                  <div className="h4 text-warning mb-0">{enInspeccion}</div>
                  <small className="text-muted">En Inspección</small>
                </div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="card text-center border-info">
                <div className="card-body">
                  <div className="h4 text-info mb-0">—</div>
                  <small className="text-muted">Items Totales</small>
                </div>
              </div>
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center my-5">
              <CSpinner color="primary" />
              <div className="mt-2">Cargando donaciones...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <>
              <CRow className="mb-3">
                <CCol md={3} xs={12} className="mb-2 mb-md-0">
                  <CFormSelect
                    value={searchCriteria}
                    onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); }}
                  >
                    <option value="donante">Donante</option>
                    <option value="tipo">Tipo</option>
                    <option value="estado">Estado</option>
                  </CFormSelect>
                </CCol>
                <CCol md={9} xs={12}>
                  <CInputGroup>
                    <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                    <CFormInput
                      placeholder={`Buscar por ${searchCriteria}...`}
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
                  {donations.filter(d => {
                    const q = searchTerm.trim().toLowerCase();
                    if (searchCriteria === 'tipo') return (d.donation_type || '').toLowerCase().includes(q);
                    if (searchCriteria === 'estado') return (getEstadoInfo(d.status).label || '').toLowerCase().includes(q);
                    return (d.donor_name || '').toLowerCase().includes(q);
                  }).length} resultado(s) de {donations.length} total
                </div>
              )}
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID Donación</CTableHeaderCell>
                  <CTableHeaderCell>Donante</CTableHeaderCell>
                  <CTableHeaderCell>Fecha Recepción</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>

                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {donations.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      {searchTerm ? 'No se encontraron donaciones' : 'No hay donaciones registradas'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  donations
                    .filter(d => {
                      const q = searchTerm.trim().toLowerCase();
                      if (!q) return true;
                      if (searchCriteria === 'tipo') return (d.donation_type || '').toLowerCase().includes(q);
                      if (searchCriteria === 'estado') return (getEstadoInfo(d.status).label || '').toLowerCase().includes(q);
                      return (d.donor_name || '').toLowerCase().includes(q);
                    })
                    .map(donation => {
                    const estado = getEstadoInfo(donation.status);
                    return (
                      <CTableRow key={donation.id}>
                        <CTableDataCell>
                          <strong>{getShortId(donation.id)}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{donation.donor_name || '—'}</div>
                          <small className="text-muted">{donation.rif_cedula || ''}</small>
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(donation.reception_date)}</CTableDataCell>
                        <CTableDataCell>{donation.donation_type || '—'}</CTableDataCell>

                        <CTableDataCell>
                          <CBadge color={estado.color}>
                            {estado.label}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1">
                            <CButton color="info" size="sm" title="Ver detalles" onClick={() => handleViewDetails(donation)}>
                              <CIcon icon={cilSearch} />
                            </CButton>
                            <CButton color="warning" size="sm" title="Editar" onClick={() => handleEditClick(donation)}>
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton color="danger" size="sm" title="Eliminar" onClick={() => handleDeleteClick(donation)}>
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                )}
              </CTableBody>
            </CTable>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Modal Detalles */}
      <CModal size="lg" visible={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Detalles de Donación{selectedDonation ? ` - ${getShortId(selectedDonation.id)}` : ''}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingDetail ? (
            <div className="text-center my-3"><CSpinner color="primary" size="sm" /><span className="ms-2">Cargando detalles...</span></div>
          ) : selectedDonation ? (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="mb-2"><strong>Donante:</strong> {selectedDonation.donor_name || '—'}</div>
                  <div className="mb-2"><strong>RIF:</strong> {selectedDonation.rif_cedula || '—'}</div>
                  <div className="mb-2"><strong>Fecha Recepción:</strong> {formatDate(selectedDonation.reception_date)}</div>
                  <div className="mb-2"><strong>Documento:</strong> {selectedDonation.document_number || '—'}</div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-2"><strong>Tipo:</strong> {selectedDonation.donation_type || '—'}</div>

                  <div className="mb-2"><strong>Estado:</strong> <CBadge color={getEstadoInfo(selectedDonation.status).color}>{getEstadoInfo(selectedDonation.status).label}</CBadge></div>
                  <div className="mb-2"><strong>Almacén:</strong> {selectedDonation.destination_warehouse || '—'}</div>
                </CCol>
              </CRow>
              {selectedDonation.transport_conditions && <div className="mb-2"><strong>Condiciones de Transporte:</strong> {selectedDonation.transport_conditions}</div>}
              {selectedDonation.observations && <div className="mb-2"><strong>Observaciones:</strong> {selectedDonation.observations}</div>}
            </>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</CButton>
          <CButton color="primary" onClick={() => window.print()}><CIcon icon={cilPrint} className="me-1" /> Imprimir Acta</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader closeButton><CModalTitle>Editar Donación</CModalTitle></CModalHeader>
        <CForm onSubmit={submitEdit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect name="status" value={editForm.status || ''} onChange={handleEditChange}>
                <option value="Received">Recibido</option>
                <option value="Inspected">Inspeccionado</option>
                <option value="InProcess">En Proceso</option>
                <option value="Accepted">Aceptado</option>
                <option value="Verified">Verificado</option>
                <option value="Rejected">Rechazado</option>
                <option value="Quarantined">En Cuarentena</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Fecha de Recepción</CFormLabel>
              <CFormInput type="date" name="reception_date" value={editForm.reception_date || ''} onChange={handleEditChange} />
            </div>
            <div className="mb-3">
              <CFormLabel>Nro Documento</CFormLabel>
              <CFormInput name="document_number" value={editForm.document_number || ''} onChange={handleEditChange} />
            </div>
            <div className="mb-3">
              <CFormLabel>Observaciones</CFormLabel>
              <CFormInput name="observations" value={editForm.observations || ''} onChange={handleEditChange} />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={actionLoading}>{actionLoading ? <CSpinner size="sm"/> : 'Guardar'}</CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal Eliminar */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton><CModalTitle>Confirmar Eliminación</CModalTitle></CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar la donación <strong>{getShortId(selectedDonation?.id)}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={actionLoading}>{actionLoading ? <CSpinner size="sm"/> : 'Eliminar'}</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Donations;