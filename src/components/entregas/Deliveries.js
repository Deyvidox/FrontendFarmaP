import React, { useState, useEffect, useMemo } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilTruck,
  cilInfo,
  cilPencil,
  cilBell,
  cilClipboard,
  cilSearch,
  cilTrash,
  cilMap,               // ← icono correcto para ubicación
} from '@coreui/icons';
import {
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  notifyDelivery,
} from '../../services/api';
import HelpButton from '../common/HelpButton';
import '../../css/entregas/Deliveries.css';

const STATUS_MAP = {
  'Scheduled': { label: 'Programada', color: 'info' },
  'In Transit': { label: 'En Camino', color: 'warning' },
  'Delivered': { label: 'Entregada', color: 'success' },
  'Cancelled': { label: 'Cancelada', color: 'danger' },
  'Failed': { label: 'Fallida', color: 'dark' },
  'Pending': { label: 'Pendiente', color: 'secondary' },
};

const DELIVERY_STATUS_LIST = [
  { label: 'Programada', value: 'Scheduled' },
  { label: 'En Camino', value: 'In Transit' },
  { label: 'Entregada', value: 'Delivered' },
  { label: 'Cancelada', value: 'Cancelled' },
  { label: 'Fallida', value: 'Failed' },
  { label: 'Pendiente', value: 'Pending' },
];

const getStatusBadge = (status) => {
  return STATUS_MAP[status] || { label: status || '—', color: 'secondary' };
};

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('beneficiario');

  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [notifyModal, setNotifyModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    status: 'Scheduled',
    observations: '',
    digital_signature: '',
    witness_receptor: '',
  });

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeliveries();
      const data = response?.message?.deliveries || [];
      setDeliveries(data);
    } catch (err) {
      console.error('Error cargando entregas:', err);
      setError(err.message || 'Error al cargar las entregas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const stats = useMemo(() => {
    const programadas = deliveries.filter(d => d.status === 'Scheduled').length;
    const enCamino = deliveries.filter(d => d.status === 'In Transit').length;
    const completadas = deliveries.filter(d => d.status === 'Delivered').length;
    const total = deliveries.length;
    return { programadas, enCamino, completadas, total };
  }, [deliveries]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const shortId = (id) => {
    if (!id) return '—';
    return id.substring(0, 8).toUpperCase();
  };

  const handleViewDetails = async (delivery) => {
    setSelectedDelivery(null);
    setDetailModal(true);
    setDetailLoading(true);
    try {
      const res = await getDeliveryById(delivery.id);
      setSelectedDelivery(res?.message?.delivery || null);
    } catch (err) {
      console.error('Error obteniendo detalle:', err);
      setSelectedDelivery({ ...delivery, error: 'No se pudo cargar el detalle' });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEditClick = (delivery) => {
    setSelectedDelivery(delivery);
    setEditForm({
      status: delivery.status || 'Scheduled',
      observations: delivery.observations || '',
      digital_signature: delivery.digital_signature || '',
      witness_receptor: delivery.witness_receptor || '',
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateDelivery(selectedDelivery.id, editForm);
      setEditModal(false);
      fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Error actualizando la entrega');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (delivery) => {
    setSelectedDelivery(delivery);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteDelivery(selectedDelivery.id);
      setDeleteModal(false);
      fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Error al cancelar la entrega');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotifyClick = (delivery) => {
    setSelectedDelivery(delivery);
    setNotifyModal(true);
  };

  const confirmNotify = async () => {
    setActionLoading(true);
    try {
      await notifyDelivery(selectedDelivery.id);
      setNotifyModal(false);
      alert('Notificación enviada exitosamente');
    } catch (err) {
      alert(err.message || 'Error al enviar la notificación');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <CCard className="mb-4 deliveries-card">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilTruck} className="me-2" />
              Programación de Entregas
              <HelpButton title="Manual de Usuario – Programación de Entregas">
                <div>
                  <p>Controla la logística y distribución de medicamentos a los beneficiarios.</p>
                  <h6>Lista de Entregas</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-2 fw-bold">(1) ID / Ref</div>
                      <div className="col-3 fw-bold">(2) Fecha/Hora</div>
                      <div className="col-3 fw-bold">(3) Beneficiario</div>
                      <div className="col-2 fw-bold">(4) Estado</div>
                      <div className="col-2 fw-bold">(5) Acciones</div>
                    </div>
                    <hr />
                    <div className="row small text-muted">
                      <div className="col-2">ENT-0012</div>
                      <div className="col-3">15/10/23 - 09:00 AM</div>
                      <div className="col-3">María Gómez</div>
                      <div className="col-2"><span className="badge bg-info">En Camino</span></div>
                      <div className="col-2">👁 ✏ 🔔 🗑</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>ID / Ref:</strong> Identificador único de la entrega.</li>
                    <li><strong>Fecha/Hora:</strong> Cuándo está programada o se realizó la entrega.</li>
                    <li><strong>Beneficiario:</strong> Persona que recibe el medicamento.</li>
                    <li><strong>Estado:</strong> Programada, En Camino, Entregada, Cancelada.</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Ver (👁):</strong> Detalles y medicamentos de la entrega.</li>
                        <li><strong>Editar (✏):</strong> Actualizar estado, testigo o ubicación.</li>
                        <li><strong>Notificar (🔔):</strong> Enviar aviso al responsable o beneficiario.</li>
                        <li><strong>Eliminar (🗑):</strong> Cancela la entrega si no se realizará.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </HelpButton>
            </h5>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Estadísticas */}
          <CRow className="mb-4">
            <CCol md={3}>
              <div className="card text-center border-info stats-card-programadas">
                <div className="card-body">
                  <div className="h4 text-info mb-0">{stats.programadas}</div>
                  <small className="text-muted">Programadas</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-warning stats-card-en-proceso">
                <div className="card-body">
                  <div className="h4 text-warning mb-0">{stats.enCamino}</div>
                  <small className="text-muted">En Camino</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-success stats-card-completadas">
                <div className="card-body">
                  <div className="h4 text-success mb-0">{stats.completadas}</div>
                  <small className="text-muted">Entregadas</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-primary stats-card-beneficiarios">
                <div className="card-body">
                  <div className="h4 text-primary mb-0">{stats.total}</div>
                  <small className="text-muted">Total Entregas</small>
                </div>
              </div>
            </CCol>
          </CRow>

          {loading && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2 text-muted">Cargando entregas...</p>
            </div>
          )}

          {error && (
            <CAlert color="danger" className="mb-3">
              <strong>Error:</strong> {error}
            </CAlert>
          )}

          {!loading && !error && deliveries.length === 0 && (
            <CAlert color="info" className="mb-3">
              No hay entregas registradas aún.
            </CAlert>
          )}

          {!loading && !error && (
            <>
              <CRow className="mb-3">
                <CCol md={3} xs={12} className="mb-2 mb-md-0">
                  <CFormSelect
                    value={searchCriteria}
                    onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); }}
                  >
                    <option value="beneficiario">Beneficiario</option>
                    <option value="medicamento">Medicamento</option>
                    <option value="estado">Estado</option>
                    <option value="id">ID de Entrega</option>
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
                  {deliveries.filter(d => {
                    const q = searchTerm.trim().toLowerCase();
                    if (!q) return true;
                    if (searchCriteria === 'medicamento') return (d.medicine_name || '').toLowerCase().includes(q);
                    if (searchCriteria === 'estado') return (getStatusBadge(d.status).label || '').toLowerCase().includes(q);
                    if (searchCriteria === 'id') return (shortId(d.id) || '').toLowerCase().includes(q);
                    return (
                      (d.beneficiary_name || '').toLowerCase().includes(q) ||
                      (d.beneficiary_cedula || '').toLowerCase().includes(q)
                    );
                  }).length} resultado(s) de {deliveries.length} total
                </div>
              )}

              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID Entrega</CTableHeaderCell>
                    <CTableHeaderCell>Fecha y Hora</CTableHeaderCell>
                    <CTableHeaderCell>Lugar</CTableHeaderCell>
                    <CTableHeaderCell>Medicamento</CTableHeaderCell>
                    <CTableHeaderCell>Beneficiario</CTableHeaderCell>
                    <CTableHeaderCell>Cantidad</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Responsable</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {deliveries
                    .filter(d => {
                      const q = searchTerm.trim().toLowerCase();
                      if (!q) return true;
                      if (searchCriteria === 'medicamento') return (d.medicine_name || '').toLowerCase().includes(q);
                      if (searchCriteria === 'estado') return (getStatusBadge(d.status).label || '').toLowerCase().includes(q);
                      if (searchCriteria === 'id') return (shortId(d.id) || '').toLowerCase().includes(q);
                      return (
                        (d.beneficiary_name || '').toLowerCase().includes(q) ||
                        (d.beneficiary_cedula || '').toLowerCase().includes(q)
                      );
                    })
                    .map((delivery) => {
                      const statusInfo = getStatusBadge(delivery.status);
                      return (
                        <CTableRow key={delivery.id}>
                          <CTableDataCell><strong>{shortId(delivery.id)}</strong></CTableDataCell>
                          <CTableDataCell>
                            <div>{formatDate(delivery.delivery_date)}</div>
                            <small className="text-muted">
                              {delivery.delivery_time && delivery.delivery_time !== '00:00'
                                ? delivery.delivery_time
                                : '—'}
                            </small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CIcon icon={cilMap} className="me-1" />
                            {delivery.delivery_point || '—'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {delivery.medicine_name ? (
                              <span>{delivery.medicine_name}</span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {delivery.beneficiary_name ? (
                              <>
                                <div>{delivery.beneficiary_name}</div>
                                {delivery.beneficiary_cedula && (
                                  <small className="text-muted">{delivery.beneficiary_cedula}</small>
                                )}
                              </>
                            ) : (
                              '—'
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{delivery.total_quantity} unidades</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={statusInfo.color}>{statusInfo.label}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <small>{delivery.responsible_name || '—'}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              <CButton color="info" size="sm" title="Ver detalles" onClick={() => handleViewDetails(delivery)}>
                                <CIcon icon={cilClipboard} />
                              </CButton>
                              <CButton color="warning" size="sm" title="Editar" onClick={() => handleEditClick(delivery)}>
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton color="secondary" size="sm" title="Notificar" onClick={() => handleNotifyClick(delivery)}>
                                <CIcon icon={cilBell} />
                              </CButton>
                              <CButton color="danger" size="sm" title="Eliminar / Cancelar" onClick={() => handleDeleteClick(delivery)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                </CTableBody>
              </CTable>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Modal Ver Detalles */}
      <CModal size="lg" visible={detailModal} onClose={() => setDetailModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Detalle de Entrega {selectedDelivery ? shortId(selectedDelivery.id) : ''}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {detailLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /><p>Cargando detalle...</p></div>
          ) : selectedDelivery ? (
            selectedDelivery.error ? (
              <CAlert color="danger">{selectedDelivery.error}</CAlert>
            ) : (
              <CRow className="g-3">
                <CCol md={6}>
                  <div className="mb-2"><strong>Fecha:</strong> {formatDate(selectedDelivery.delivery_date)}</div>
                  <div className="mb-2"><strong>Tipo:</strong> {selectedDelivery.delivery_type || '—'}</div>
                  <div className="mb-2"><strong>Lugar:</strong> {selectedDelivery.delivery_point || '—'}</div>
                  <div className="mb-2"><strong>Testigo/Receptor:</strong> {selectedDelivery.witness_receptor || '—'}</div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-2"><strong>Medicamento:</strong> {selectedDelivery.medicine_name || '—'}</div>
                  <div className="mb-2"><strong>Beneficiario:</strong> {selectedDelivery.beneficiary_name || '—'} ({selectedDelivery.beneficiary_cedula || 'N/A'})</div>
                  <div className="mb-2"><strong>Responsable:</strong> {selectedDelivery.responsible_name || '—'}</div>
                  <div className="mb-2"><strong>Firma Digital:</strong> {selectedDelivery.digital_signature || '—'}</div>
                </CCol>
                <CCol xs={12}>
                  <div className="mb-2"><strong>Observaciones:</strong> {selectedDelivery.observations || '—'}</div>
                </CCol>
              </CRow>
            )
          ) : (
            <p className="text-muted">No hay información disponible.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CForm onSubmit={submitEdit}>
          <CModalHeader closeButton><CModalTitle>Editar Entrega {selectedDelivery ? shortId(selectedDelivery.id) : ''}</CModalTitle></CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Estado *</CFormLabel>
              <CFormSelect name="status" value={editForm.status} onChange={handleEditChange} required>
                {DELIVERY_STATUS_LIST.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Observaciones</CFormLabel>
              <CFormInput name="observations" value={editForm.observations} onChange={handleEditChange} />
            </div>
            <div className="mb-3">
              <CFormLabel>Firma Digital / Comprobante</CFormLabel>
              <CFormInput name="digital_signature" value={editForm.digital_signature} onChange={handleEditChange} />
            </div>
            <div className="mb-3">
              <CFormLabel>Testigo / Receptor</CFormLabel>
              <CFormInput name="witness_receptor" value={editForm.witness_receptor} onChange={handleEditChange} />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm" /> : 'Guardar cambios'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal Eliminar (Cancelar) */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton><CModalTitle>Cancelar Entrega</CModalTitle></CModalHeader>
        <CModalBody>
          ¿Está seguro de cancelar la entrega <strong>{selectedDelivery ? shortId(selectedDelivery.id) : ''}</strong>? Su estado cambiará a "Cancelada".
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>No, mantener</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : 'Sí, cancelar entrega'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Notificar */}
      <CModal visible={notifyModal} onClose={() => setNotifyModal(false)}>
        <CModalHeader closeButton><CModalTitle>Enviar Notificación</CModalTitle></CModalHeader>
        <CModalBody>
          ¿Desea enviar una notificación a los involucrados en la entrega <strong>{selectedDelivery ? shortId(selectedDelivery.id) : ''}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setNotifyModal(false)}>Cancelar</CButton>
          <CButton color="primary" onClick={confirmNotify} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : 'Enviar notificación'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Deliveries;