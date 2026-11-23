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
  cilPencil, cilTrash, cilDrop, cilSearch, cilInfo
} from '@coreui/icons';
import { getDonations, getDonationById, updateDonation, deleteDonation } from '../../services/api';
import HelpButton from '../common/HelpButton';
import ToastNotification from '../common/ToastNotification';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('donante');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type })
    setTimeout(() => setToast({ show: true, message, type }), 20)
  };

  // Campos del formulario de edición
  const [editForm, setEditForm] = useState({
    status: 'Received',
    reception_date: '',
    document_number: '',
    observations: ''
  });

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
  const totalLotes = donations.reduce((sum, d) => sum + (parseInt(d.total_lots) || 0), 0);

  const getEstadoInfo = (status) => {
    switch (status) {
      case 'Received': return { label: 'Recibido', color: 'success' };
      case 'Inspected': return { label: 'Inspeccionado', color: 'info' };
      case 'InProcess': return { label: 'En Proceso', color: 'warning' };
      case 'Accepted': return { label: 'Aceptado', color: 'primary' };
      case 'Rejected': return { label: 'Rechazado', color: 'danger' };
      case 'Quarantined': return { label: 'En Cuarentena', color: 'dark' };
      default: return { label: status || 'Desconocido', color: 'secondary' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-VE');
  };

  const getShortId = (id) => {
    if (!id) return '';
    return `DON-${id.substring(0, 8).toUpperCase()}`;
  };

  // Filtrado de donaciones
  const filteredDonations = donations.filter(donation => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch (searchCriteria) {
      case 'donante':
        return (donation.donor_name || '').toLowerCase().includes(term);
      case 'documento':
        return (donation.document_number || '').toLowerCase().includes(term);
      case 'estado':
        const estadoLabel = getEstadoInfo(donation.status).label;
        return estadoLabel.toLowerCase().includes(term);
      default:
        return true;
    }
  });

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

  const handleEditClick = (donation) => {
    setSelectedDonation(donation);
    setEditForm({
      status: donation.status || 'Received',
      reception_date: donation.reception_date ? donation.reception_date.split('T')[0] : '',
      document_number: donation.document_number || '',
      observations: donation.observations || ''
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
      await updateDonation(selectedDonation.id, {
        status: editForm.status,
        reception_date: editForm.reception_date,
        document_number: editForm.document_number,
        observations: editForm.observations
      });
      setEditModal(false);
      fetchDonations();
      showToast('Donación actualizada exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error actualizando donación', 'danger');
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
      showToast('Donación eliminada exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error eliminando donación', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilDrop} className="me-2" />
              Gestión de Donaciones
              <HelpButton title="Manual de Usuario – Gestión de Donaciones">
                <div>
                  <p><strong>¿Qué hace esta pantalla?</strong><br />
                    Lista todas las donaciones registradas con sus lotes y medicamentos recibidos. Permite buscar, ver detalles, editar estado y eliminar donaciones.</p>
                  <h6>📋 Columnas de la tabla</h6>
                  <ul>
                    <li><strong>Código:</strong> Identificador DON-XXXX de la donación.</li>
                    <li><strong>N° Documento/Acta:</strong> Referencia del acta o documento físico.</li>
                    <li><strong>Donante:</strong> Persona u organización que realizó la donación.</li>
                    <li><strong>Fecha Recepción:</strong> Cuándo se recibió la donación.</li>
                    <li><strong>Medicamentos/Lotes:</strong> Cantidad de lotes recibidos y total de unidades.</li>
                    <li><strong>Estado:</strong> Estado actual de la donación.</li>
                  </ul>
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
                  <small className="text-body-secondary">Donaciones Totales</small>
                </div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="card text-center border-warning">
                <div className="card-body">
                  <div className="h4 text-warning mb-0">{enInspeccion}</div>
                  <small className="text-body-secondary">En Inspección</small>
                </div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="card text-center border-info">
                <div className="card-body">
                  <div className="h4 text-info mb-0">{totalLotes}</div>
                  <small className="text-body-secondary">Lotes Recibidos</small>
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
                    <option value="documento">N° Documento</option>
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
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Código</CTableHeaderCell>
                    <CTableHeaderCell>N° Documento/Acta</CTableHeaderCell>
                    <CTableHeaderCell>Donante</CTableHeaderCell>
                    <CTableHeaderCell>Fecha Recepción</CTableHeaderCell>
                    <CTableHeaderCell>Medicamentos / Lotes</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredDonations.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="7" className="text-center">
                        {searchTerm ? 'No se encontraron donaciones' : 'No hay donaciones registradas'}
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredDonations.map(donation => {
                      const estado = getEstadoInfo(donation.status);
                      const lots = parseInt(donation.total_lots) || 0;
                      const units = parseInt(donation.total_units) || 0;
                      return (
                        <CTableRow key={donation.id}>
                          <CTableDataCell><strong>{getShortId(donation.id)}</strong></CTableDataCell>
                          <CTableDataCell>{donation.document_number || '—'}</CTableDataCell>
                          <CTableDataCell>
                            <div>{donation.donor_name || '—'}</div>
                            <small className="text-body-secondary">{donation.rif_cedula || ''}</small>
                          </CTableDataCell>
                          <CTableDataCell>{formatDate(donation.reception_date)}</CTableDataCell>
                          <CTableDataCell>
                            <span className="badge bg-info text-dark me-1">{lots} lote{lots !== 1 ? 's' : ''}</span>
                            <span className="badge bg-secondary">{units} unds</span>
                          </CTableDataCell>
                          <CTableDataCell><CBadge color={estado.color}>{estado.label}</CBadge></CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              <CButton color="info" size="sm" title="Ver detalles" onClick={() => handleViewDetails(donation)}><CIcon icon={cilInfo} /></CButton>
                              <CButton color="warning" size="sm" title="Editar" onClick={() => handleEditClick(donation)}><CIcon icon={cilPencil} /></CButton>
                              <CButton color="danger" size="sm" title="Eliminar" onClick={() => handleDeleteClick(donation)}><CIcon icon={cilTrash} /></CButton>
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

      {/* Modal Detalles — con desglose de lotes */}
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
                  <div className="mb-2"><strong>RIF/Cédula:</strong> {selectedDonation.rif_cedula || '—'}</div>
                  <div className="mb-2"><strong>Fecha Recepción:</strong> {formatDate(selectedDonation.reception_date)}</div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-2"><strong>N° Documento/Acta:</strong> {selectedDonation.document_number || '—'}</div>
                  <div className="mb-2"><strong>Tipo:</strong> {selectedDonation.donation_type || '—'}</div>
                  <div className="mb-2"><strong>Estado:</strong> <CBadge color={getEstadoInfo(selectedDonation.status).color}>{getEstadoInfo(selectedDonation.status).label}</CBadge></div>
                </CCol>
              </CRow>
              {selectedDonation.receiver_name && (
                <div className="mb-2"><strong>Receptor:</strong> {selectedDonation.receiver_name}</div>
              )}
              {selectedDonation.observations && <div className="mb-3"><strong>Observaciones:</strong> {selectedDonation.observations}</div>}

              {/* Desglose de medicamentos/lotes recibidos */}
              {selectedDonation.lots && selectedDonation.lots.length > 0 && (
                <>
                  <h6 className="mt-3 mb-2">Medicamentos / Lotes Recibidos</h6>
                  <CTable hover bordered responsive size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Medicamento</CTableHeaderCell>
                        <CTableHeaderCell>N° Lote</CTableHeaderCell>
                        <CTableHeaderCell>Cantidad</CTableHeaderCell>
                        <CTableHeaderCell>Fecha Vencimiento</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedDonation.lots.map((lot, idx) => (
                        <CTableRow key={lot.id || idx}>
                          <CTableDataCell>{lot.medicine_name || '—'}</CTableDataCell>
                          <CTableDataCell><strong>{lot.lot_number}</strong></CTableDataCell>
                          <CTableDataCell>{lot.total_units} unds</CTableDataCell>
                          <CTableDataCell>{formatDate(lot.expiration_date)}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </>
              )}
            </>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader closeButton><CModalTitle>Editar Donación</CModalTitle></CModalHeader>
        <CForm onSubmit={submitEdit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect name="status" value={editForm.status} onChange={handleEditChange}>
                <option value="Received">Recibido</option>
                <option value="Inspected">Inspeccionado</option>
                <option value="Accepted">Aceptado</option>
                <option value="Rejected">Rechazado</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Fecha de Recepción</CFormLabel>
              <CFormInput type="date" name="reception_date" value={editForm.reception_date} onChange={handleEditChange} />
            </div>
            <div className="mb-3">
              <CFormLabel>N° Documento/Acta</CFormLabel>
              <CFormInput name="document_number" value={editForm.document_number} onChange={handleEditChange} />
            </div>
            <div className="mb-3">
              <CFormLabel>Observaciones</CFormLabel>
              <CFormInput name="observations" value={editForm.observations} onChange={handleEditChange} />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm" /> : 'Guardar'}
            </CButton>
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
          <CButton color="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Donations;
