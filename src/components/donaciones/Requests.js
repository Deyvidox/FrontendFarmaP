import React, { useState, useEffect } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton,
  CModal, CModalHeader, CModalTitle, CModalBody, CFormSelect,
  CFormInput, CInputGroup, CInputGroupText, CModalFooter,
  CRow, CCol, CSpinner, CForm, CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilClipboard, cilPrint, cilPencil, cilTrash, cilSearch,
  cilWarning, cilCheckCircle, cilClock
} from '@coreui/icons';
import { getProviderRequests, updateProviderRequest, deleteProviderRequest } from '../../services/api';
import HelpButton from '../common/HelpButton';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('proveedor');

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Solo los campos permitidos para actualizar
  const [editForm, setEditForm] = useState({
    status: 'PENDIENTE',
    observations: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getProviderRequests();
      if (response?.message?.providerRequests) {
        setRequests(response.message.providerRequests);
      }
    } catch (error) {
      console.error('Error fetching provider requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'ENVIADA': return 'info';
      case 'EN_REVISION': return 'info';
      case 'APROBADA_INTERNA': return 'primary';
      case 'APROBADA': return 'success';
      case 'RECHAZADA': return 'danger';
      case 'COMPLETADA': return 'success';
      default: return 'secondary';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'CRITICA': case 'URGENTE': case 'ALTA': return 'danger';
      case 'MEDIA': return 'warning';
      case 'BAJA': return 'success';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getShortId = (id) => {
    if (!id) return '';
    return `SOL-${id.split('-')[0].toUpperCase()}`;
  };

  const handlePrintRequest = (request) => {
    setSelectedRequest(request);
    setShowPrintModal(true);
  };

  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setEditForm({
      status: request.status || 'PENDIENTE',
      observations: request.observations || ''
    });
    setEditModal(true);
  };

  const handleDeleteClick = (request) => {
    setSelectedRequest(request);
    setDeleteModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateProviderRequest(selectedRequest.id, {
        status: editForm.status,
        observations: editForm.observations
      });
      setEditModal(false);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Error actualizando solicitud');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteProviderRequest(selectedRequest.id);
      setDeleteModal(false);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Error eliminando solicitud');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilClipboard} className="me-2" />
              Solicitudes de Medicamentos a Proveedores
              <HelpButton title="Manual de Usuario – Solicitudes a Proveedores">
                <div>
                  <p>Gestiona las órdenes de compra y requerimientos enviados a laboratorios o distribuidoras.</p>
                  <h6>Lista de Solicitudes</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-2 fw-bold">(1) Solicitud</div>
                      <div className="col-3 fw-bold">(2) Proveedor</div>
                      <div className="col-2 fw-bold">(3) Tipo/Fecha</div>
                      <div className="col-2 fw-bold">(4) Estado</div>
                      <div className="col-3 fw-bold">(5) Acciones</div>
                    </div>
                    <hr />
                    <div className="row small text-muted">
                      <div className="col-2">REQ-0042</div>
                      <div className="col-3">Droguería Nena</div>
                      <div className="col-2">Emergencia<br /><small>12/10/23</small></div>
                      <div className="col-2"><span className="badge bg-warning">Pendiente</span></div>
                      <div className="col-3">✏ 🖨 🗑</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Solicitud:</strong> Número de requerimiento (ID).</li>
                    <li><strong>Proveedor:</strong> Laboratorio o distribuidora destino.</li>
                    <li><strong>Tipo/Fecha:</strong> Indica si es Emergencia o Rutinaria y cuándo se creó.</li>
                    <li><strong>Estado:</strong> Pendiente, En Proceso, Aprobada, Rechazada.</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Editar (✏):</strong> Cambiar estado u observaciones.</li>
                        <li><strong>Imprimir (🖨):</strong> Genera vista previa de la orden.</li>
                        <li><strong>Eliminar (🗑):</strong> Cancela la solicitud.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </HelpButton>
            </h5>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3} xs={12} className="mb-2 mb-md-0">
              <CFormSelect
                value={searchCriteria}
                onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); }}
              >
                <option value="proveedor">Proveedor</option>
                <option value="departamento">Departamento</option>
                <option value="prioridad">Prioridad</option>
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
                <CTableHeaderCell>ID Solicitud</CTableHeaderCell>
                <CTableHeaderCell>Proveedor / Destino</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Medicamentos</CTableHeaderCell>
                <CTableHeaderCell>Prioridad</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {requests.filter(r => {
                const q = searchTerm.trim().toLowerCase();
                if (!q) return true;
                if (searchCriteria === 'departamento') return (r.department || '').toLowerCase().includes(q);
                if (searchCriteria === 'prioridad') return (r.general_priority || '').toLowerCase().includes(q);
                return (r.provider_name || '').toLowerCase().includes(q);
              }).map(request => (
                <CTableRow key={request.id}>
                  <CTableDataCell><strong>{getShortId(request.id)}</strong></CTableDataCell>
                  <CTableDataCell>
                    <div>{request.provider_name}</div>
                    <small className="text-muted">{request.department || 'Sin Dpto'} - {request.responsible_name}</small>
                  </CTableDataCell>
                  <CTableDataCell>{formatDate(request.request_date)}</CTableDataCell>
                  <CTableDataCell>{request.request_type}</CTableDataCell>
                  <CTableDataCell>{request.total_medicines} ({request.total_units} unds)</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getPrioridadColor(request.general_priority)}>{request.general_priority}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getEstadoColor(request.status)}>{request.status}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CButton color="warning" size="sm" onClick={() => handleEditClick(request)}><CIcon icon={cilPencil} /></CButton>
                      <CButton color="primary" size="sm" onClick={() => handlePrintRequest(request)}><CIcon icon={cilPrint} /></CButton>
                      <CButton color="danger" size="sm" onClick={() => handleDeleteClick(request)}><CIcon icon={cilTrash} /></CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Editar */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader closeButton><CModalTitle>Editar Solicitud {selectedRequest && getShortId(selectedRequest.id)}</CModalTitle></CModalHeader>
        <CForm onSubmit={submitEdit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect name="status" value={editForm.status} onChange={handleEditChange}>
                <option value="PENDIENTE">Pendiente</option>
                <option value="ENVIADA">Enviada</option>
                <option value="EN_REVISION">En Revisión</option>
                <option value="APROBADA_INTERNA">Aprobada Interna</option>
                <option value="APROBADA">Aprobada</option>
                <option value="RECHAZADA">Rechazada</option>
                <option value="COMPLETADA">Completada</option>
              </CFormSelect>
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
          ¿Está seguro de eliminar la solicitud <strong>{selectedRequest && getShortId(selectedRequest.id)}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Imprimir (opcional) */}
      <CModal size="lg" visible={showPrintModal} onClose={() => setShowPrintModal(false)}>
        <CModalHeader><CModalTitle>Vista previa – Solicitud {selectedRequest ? getShortId(selectedRequest.id) : ''}</CModalTitle></CModalHeader>
        <CModalBody>
          {selectedRequest && (
            <div>
              <h6>{selectedRequest.provider_name}</h6>
              <p>Tipo: {selectedRequest.request_type}</p>
              <p>Medicamentos: {selectedRequest.total_medicines} ({selectedRequest.total_units} unds)</p>
              <p>Estado: {selectedRequest.status}</p>
              <p>Observaciones: {selectedRequest.observations}</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPrintModal(false)}>Cerrar</CButton>
          <CButton color="primary" onClick={() => window.print()}><CIcon icon={cilPrint} /> Imprimir</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Requests;