import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CRow, CCol, CSpinner, CForm, CFormLabel, CFormSelect,
  CFormInput, CInputGroup, CInputGroupText, CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilClipboard, cilPencil, cilTrash, cilSearch, cilInfo
} from '@coreui/icons';
import {
  getProviderRequests, getProviderRequestById, updateProviderRequest, deleteProviderRequest
} from '../../services/api';
import HelpButton from '../common/HelpButton';
import ToastNotification from '../common/ToastNotification';

/* ═══════════════════════════════════════════════
   ESTADOS DE SOLICITUDES A PROVEEDORES
   Flujo: PENDIENTE → ENVIADA → EN_REVISION → APROBADA → COMPLETADA
   (RECHAZADA puede ocurrir en cualquier paso)
   ═══════════════════════════════════════════════ */
const STATUS_CONFIG = {
  PENDIENTE:        { label: 'Pendiente',          color: 'warning',   icon: '⏳', order: 1 },
  ENVIADA:          { label: 'Enviada',            color: 'info',      icon: '📤', order: 2 },
  EN_REVISION:      { label: 'En Revisión',        color: 'primary',   icon: '🔍', order: 3 },
  APROBADA_INTERNA: { label: 'Aprobada Int.',      color: 'success',   icon: '✔️',  order: 4 },
  APROBADA:         { label: 'Aprobada',           color: 'success',   icon: '✅', order: 5 },
  COMPLETADA:       { label: 'Completada',         color: 'dark',      icon: '📦', order: 6 },
  RECHAZADA:        { label: 'Rechazada',          color: 'danger',    icon: '❌', order: 99 },
};

// Transiciones válidas según estado actual
const VALID_TRANSITIONS = {
  PENDIENTE:        ['ENVIADA', 'RECHAZADA'],
  ENVIADA:          ['EN_REVISION', 'RECHAZADA'],
  EN_REVISION:      ['APROBADA_INTERNA', 'APROBADA', 'RECHAZADA'],
  APROBADA_INTERNA: ['APROBADA', 'RECHAZADA'],
  APROBADA:         ['COMPLETADA'],
  COMPLETADA:       [],
  RECHAZADA:        ['PENDIENTE'], // Permite reabrir
};

const REQUEST_TYPE_LABELS = {
  New: 'Nueva',
  Renewal: 'Renovación',
  Emergency: 'Emergencia',
};

const Requests = () => {
  const navigate = useNavigate();
  const [providerRequests, setProviderRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('proveedor');

  // Modales
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editForm, setEditForm] = useState({ status: 'PENDIENTE', observations: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type });
    setTimeout(() => setToast({ show: true, message, type }), 20);
  };

  const fetchProviderRequests = async () => {
    setLoading(true);
    try {
      const response = await getProviderRequests();
      if (response?.message?.providerRequests) {
        setProviderRequests(response.message.providerRequests);
      }
    } catch (error) {
      console.error('Error fetching provider requests:', error);
      showToast('Error al cargar las solicitudes', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderRequests();
  }, []);

  /* ─── Estadísticas ─── */
  const stats = {
    total: providerRequests.length,
    pendientes: providerRequests.filter(r => r.status === 'PENDIENTE').length,
    enProceso: providerRequests.filter(r => ['ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA'].includes(r.status)).length,
    aprobadas: providerRequests.filter(r => ['APROBADA', 'COMPLETADA'].includes(r.status)).length,
  };

  /* ─── Helpers ─── */
  const getStatusBadge = (status) => {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return <CBadge color="secondary">{status || '—'}</CBadge>;
    return <CBadge color={cfg.color}>{cfg.icon} {cfg.label}</CBadge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-VE');
  };

  const getShortId = (id) => {
    if (!id) return '';
    return `SOL-${id.substring(0, 8).toUpperCase()}`;
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICA': return <CBadge color="danger">Crítica</CBadge>;
      case 'URGENTE': return <CBadge color="danger">Urgente</CBadge>;
      case 'ALTA': return <CBadge color="warning">Alta</CBadge>;
      case 'MEDIA': return <CBadge color="info">Media</CBadge>;
      case 'BAJA': return <CBadge color="secondary">Baja</CBadge>;
      default: return <CBadge color="secondary">{priority || '—'}</CBadge>;
    }
  };

  const getTypeLabel = (type) => REQUEST_TYPE_LABELS[type] || type || '—';

  /* ─── Filtro ─── */
  const filteredRequests = providerRequests.filter(r => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.trim().toLowerCase();
    switch (searchCriteria) {
      case 'proveedor':
        return (r.provider_name || '').toLowerCase().includes(q);
      case 'documento':
        return (r.document_number || '').toLowerCase().includes(q);
      case 'estado':
        const lbl = STATUS_CONFIG[r.status]?.label || '';
        return lbl.toLowerCase().includes(q);
      case 'responsable':
        return (r.responsible_name || '').toLowerCase().includes(q);
      default:
        return true;
    }
  });

  /* ─── Acciones ─── */
  const handleDetailClick = async (request) => {
    setSelectedRequest(request);
    setDetailModal(true);
    setLoadingDetail(true);
    try {
      const response = await getProviderRequestById(request.id);
      if (response?.message?.providerRequest) {
        setSelectedRequest(response.message.providerRequest);
      }
    } catch (err) {
      console.error('Error fetching request detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEditClick = (request) => {
    setSelectedRequest(request);
    const nextStatuses = VALID_TRANSITIONS[request.status] || [];
    setEditForm({
      status: nextStatuses.length > 0 ? nextStatuses[0] : request.status,
      observations: request.observations || ''
    });
    setEditModal(true);
  };

  const handleDeleteClick = (request) => {
    setSelectedRequest(request);
    setDeleteModal(true);
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
      fetchProviderRequests();
      showToast('Solicitud actualizada exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error actualizando solicitud', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteProviderRequest(selectedRequest.id);
      setDeleteModal(false);
      fetchProviderRequests();
      showToast('Solicitud eliminada exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error eliminando solicitud', 'danger');
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
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilClipboard} className="me-2" />
              Gestión de Solicitudes a Proveedores
              <HelpButton title="Manual – Solicitudes a Proveedores">
                <div>
                  <p>
                    <strong>¿Qué hace esta pantalla?</strong><br />
                    Gestiona las solicitudes de medicamentos que FarmaPatria
                    envía a instituciones gubernamentales, proveedores o
                    entidades contratadas.
                  </p>
                  <h6>Flujo de Estados</h6>
                  <p>
                    Pendiente → Enviada → En Revisión → Aprobada Int. → Aprobada → Completada.<br />
                    En cualquier paso se puede Rechazar y luego Reabrir.
                  </p>
                  <h6>Columnas</h6>
                  <ul>
                    <li><strong>Código:</strong> SOL-XXXX — Identificador único.</li>
                    <li><strong>N° Oficio:</strong> Referencia del documento físico.</li>
                    <li><strong>Proveedor:</strong> Ente destino de la solicitud.</li>
                    <li><strong>Medicamentos:</strong> Cantidad de tipos y unidades totales.</li>
                    <li><strong>Prioridad:</strong> Nivel de urgencia.</li>
                    <li><strong>Estado:</strong> Paso actual en el flujo.</li>
                  </ul>
                </div>
              </HelpButton>
            </h5>
            <CButton
              color="primary"
              onClick={() => navigate('/solicitudes/nueva')}
            >
              + Nueva Solicitud
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Estadísticas */}
          <CRow className="mb-4">
            <CCol md={3} sm={6} className="mb-2">
              <div className="card text-center border-primary">
                <div className="card-body py-2">
                  <div className="h4 text-primary mb-0">{stats.total}</div>
                  <small className="text-body-secondary">Total Solicitudes</small>
                </div>
              </div>
            </CCol>
            <CCol md={3} sm={6} className="mb-2">
              <div className="card text-center border-warning">
                <div className="card-body py-2">
                  <div className="h4 text-warning mb-0">{stats.pendientes}</div>
                  <small className="text-body-secondary">Pendientes</small>
                </div>
              </div>
            </CCol>
            <CCol md={3} sm={6} className="mb-2">
              <div className="card text-center border-info">
                <div className="card-body py-2">
                  <div className="h4 text-info mb-0">{stats.enProceso}</div>
                  <small className="text-body-secondary">En Proceso</small>
                </div>
              </div>
            </CCol>
            <CCol md={3} sm={6} className="mb-2">
              <div className="card text-center border-success">
                <div className="card-body py-2">
                  <div className="h4 text-success mb-0">{stats.aprobadas}</div>
                  <small className="text-body-secondary">Aprobadas / Completadas</small>
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Búsqueda */}
          <CRow className="mb-3">
            <CCol md={3} xs={12} className="mb-2 mb-md-0">
              <CFormSelect
                value={searchCriteria}
                onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); }}
              >
                <option value="proveedor">Proveedor</option>
                <option value="documento">N° Oficio</option>
                <option value="estado">Estado</option>
                <option value="responsable">Responsable</option>
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

          {loading ? (
            <div className="text-center py-4"><CSpinner color="primary" /><p className="mt-2 text-body-secondary">Cargando solicitudes...</p></div>
          ) : filteredRequests.length === 0 ? (
            <div className="alert alert-info text-center">
              {searchTerm ? 'No se encontraron solicitudes con ese criterio' : 'No hay solicitudes registradas aún'}
            </div>
          ) : (
            <CTable hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>N° Oficio/Documento</CTableHeaderCell>
                  <CTableHeaderCell>Proveedor / Ente</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Medicamentos</CTableHeaderCell>
                  <CTableHeaderCell>Prioridad</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredRequests.map(request => (
                  <CTableRow key={request.id}>
                    <CTableDataCell>
                      <strong className="text-primary">{getShortId(request.id)}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{request.document_number || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <div><strong>{request.provider_name || '—'}</strong></div>
                      <small className="text-body-secondary">
                        {request.responsible_name || '—'} — {request.department || 'Sin Dpto'}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>{formatDate(request.request_date)}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <strong>{request.total_medicines || 0}</strong>
                      <div><small className="text-body-secondary">{request.total_units || 0} uds.</small></div>
                    </CTableDataCell>
                    <CTableDataCell>{getPriorityBadge(request.general_priority)}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(request.status)}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <CButton color="info" size="sm" title="Ver detalles" onClick={() => handleDetailClick(request)}>
                          <CIcon icon={cilInfo} />
                        </CButton>
                        {(VALID_TRANSITIONS[request.status] || []).length > 0 && (
                          <CButton color="warning" size="sm" title="Cambiar estado" onClick={() => handleEditClick(request)}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                        )}
                        {request.status === 'PENDIENTE' && (
                          <CButton color="danger" size="sm" title="Eliminar" onClick={() => handleDeleteClick(request)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* ═══ Modal Ver Detalles ═══ */}
      <CModal size="lg" visible={detailModal} onClose={() => setDetailModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Detalle de Solicitud {selectedRequest ? getShortId(selectedRequest.id) : ''}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loadingDetail ? (
            <div className="text-center my-3"><CSpinner color="primary" size="sm" /><span className="ms-2">Cargando detalles...</span></div>
          ) : selectedRequest ? (
            <>
              <CRow className="g-3 mb-3">
                <CCol md={6}>
                  <div className="mb-2"><strong>Proveedor / Ente:</strong> {selectedRequest.provider_name || '—'}</div>
                  <div className="mb-2"><strong>N° Oficio/Documento:</strong> {selectedRequest.document_number || '—'}</div>
                  <div className="mb-2"><strong>Tipo:</strong> {getTypeLabel(selectedRequest.request_type)}</div>
                  <div className="mb-2"><strong>Departamento:</strong> {selectedRequest.department || '—'}</div>
                  <div className="mb-2"><strong>Responsable:</strong> {selectedRequest.responsible_name || '—'}</div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-2"><strong>Fecha Solicitud:</strong> {formatDate(selectedRequest.request_date)}</div>
                  <div className="mb-2"><strong>Fecha Requerida:</strong> {formatDate(selectedRequest.required_date)}</div>
                  <div className="mb-2"><strong>Prioridad:</strong> {getPriorityBadge(selectedRequest.general_priority)}</div>
                  <div className="mb-2"><strong>Estado:</strong> {getStatusBadge(selectedRequest.status)}</div>
                </CCol>
                <CCol xs={12}>
                  <div className="mb-2"><strong>Justificación Institucional:</strong> {selectedRequest.general_justification || '—'}</div>
                  <div className="mb-2"><strong>Observaciones:</strong> {selectedRequest.observations || '—'}</div>
                </CCol>
              </CRow>

              {/* Tabla detallada de medicamentos */}
              {selectedRequest.medicines && selectedRequest.medicines.length > 0 && (
                <>
                  <h6 className="mt-3 mb-2">Medicamentos Solicitados</h6>
                  <CTable hover bordered responsive size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Medicamento</CTableHeaderCell>
                        <CTableHeaderCell>Principio Activo</CTableHeaderCell>
                        <CTableHeaderCell>Concentración</CTableHeaderCell>
                        <CTableHeaderCell>Cantidad</CTableHeaderCell>
                        <CTableHeaderCell>Prioridad</CTableHeaderCell>
                        <CTableHeaderCell>Justificación</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedRequest.medicines.map((med, idx) => (
                        <CTableRow key={med.id || idx}>
                          <CTableDataCell>{med.medicine_name || '—'}</CTableDataCell>
                          <CTableDataCell>{med.active_principle || '—'}</CTableDataCell>
                          <CTableDataCell>{med.concentration || '—'}</CTableDataCell>
                          <CTableDataCell><span className="badge bg-primary">{med.requested_quantity}</span></CTableDataCell>
                          <CTableDataCell>{getPriorityBadge(med.priority)}</CTableDataCell>
                          <CTableDataCell><small>{med.justification || '—'}</small></CTableDataCell>
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
          <CButton color="secondary" onClick={() => setDetailModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* ═══ Modal Cambiar Estado ═══ */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Actualizar Estado — {selectedRequest ? getShortId(selectedRequest.id) : ''}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitEdit}>
          <CModalBody>
            {selectedRequest && (
              <div className="mb-3 p-2 border rounded" style={{ borderColor: 'var(--cui-border-color)' }}>
                <small className="text-body-secondary">Estado actual:</small>{' '}
                {getStatusBadge(selectedRequest.status)}
              </div>
            )}
            <div className="mb-3">
              <CFormLabel>Nuevo Estado *</CFormLabel>
              <CFormSelect
                name="status"
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
              >
                {selectedRequest && (VALID_TRANSITIONS[selectedRequest.status] || []).map(st => (
                  <option key={st} value={st}>{STATUS_CONFIG[st]?.icon} {STATUS_CONFIG[st]?.label || st}</option>
                ))}
                {selectedRequest && (VALID_TRANSITIONS[selectedRequest.status] || []).length === 0 && (
                  <option value={selectedRequest.status}>{STATUS_CONFIG[selectedRequest.status]?.label || selectedRequest.status} (sin cambios disponibles)</option>
                )}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Observaciones</CFormLabel>
              <CFormTextarea
                rows="3"
                name="observations"
                value={editForm.observations}
                onChange={(e) => setEditForm(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Notas sobre el cambio de estado..."
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm" /> : 'Guardar Cambio'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* ═══ Modal Eliminar ═══ */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton><CModalTitle>Confirmar Eliminación</CModalTitle></CModalHeader>
        <CModalBody>
          ¿Está seguro de eliminar la solicitud <strong>{selectedRequest ? getShortId(selectedRequest.id) : ''}</strong>?
          <br /><small className="text-body-secondary">Solo se pueden eliminar solicitudes en estado Pendiente.</small>
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

export default Requests;
