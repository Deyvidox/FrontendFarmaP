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
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTruck, cilCalendar, cilInfo, cilPencil, cilCheckCircle, cilBan, cilPaperPlane, cilUser, cilPeople, cilLocationPin, cilBell, cilClipboard, cilSearch } from '@coreui/icons';
import { getDeliveries } from '../../services/api';
import HelpButton from '../common/HelpButton';
import '../../css/entregas/Deliveries.css';

// Mapeo de estados del backend a español + color de badge
const STATUS_MAP = {
  'Scheduled':  { label: 'Programada', color: 'info' },
  'In Transit': { label: 'En Camino',  color: 'warning' },
  'Delivered':  { label: 'Entregada',  color: 'success' },
  'Cancelled':  { label: 'Cancelada',  color: 'danger' },
  'Failed':     { label: 'Fallida',    color: 'dark' },
  'Pending':    { label: 'Pendiente',  color: 'secondary' },
};

const getStatusBadge = (status) => {
  const mapped = STATUS_MAP[status] || { label: status || '—', color: 'secondary' };
  return mapped;
};

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('beneficiario');

  // Cargar entregas desde la API
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDeliveries();
        // El controlador devuelve: { type, message: { count, deliveries: [...] } }
        const data = response?.message?.deliveries || [];
        setDeliveries(data);
      } catch (err) {
        console.error('Error cargando entregas:', err);
        setError(err.message || 'Error al cargar las entregas');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Estadísticas calculadas dinámicamente
  const stats = useMemo(() => {
    const programadas = deliveries.filter(d => d.status === 'Scheduled').length;
    const enCamino = deliveries.filter(d => d.status === 'In Transit').length;
    const completadas = deliveries.filter(d => d.status === 'Delivered').length;
    const total = deliveries.length;
    return { programadas, enCamino, completadas, total };
  }, [deliveries]);

  // Formatear fecha
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

  // Abreviar UUID a 8 caracteres
  const shortId = (id) => {
    if (!id) return '—';
    return id.substring(0, 8).toUpperCase();
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
                    <hr/>
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

          {/* Estado de carga */}
          {loading && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2 text-muted">Cargando entregas...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <CAlert color="danger" className="mb-3">
              <strong>Error:</strong> {error}
            </CAlert>
          )}

          {/* Tabla sin datos */}
          {!loading && !error && deliveries.length === 0 && (
            <CAlert color="info" className="mb-3">
              No hay entregas registradas aún.
            </CAlert>
          )}

          {/* Lista de Entregas */}
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
                    if (searchCriteria === 'medicamento') return (d.medicine_name || '').toLowerCase().includes(q);
                    if (searchCriteria === 'estado') return (getStatusBadge(d.status).label || '').toLowerCase().includes(q);
                    if (searchCriteria === 'id') return (shortId(d.id) || '').toLowerCase().includes(q);
                    return (d.beneficiary_name || '').toLowerCase().includes(q) || (d.beneficiary_cedula || '').toLowerCase().includes(q);
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
                {deliveries.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {searchTerm ? 'No se encontraron entregas' : 'No hay entregas registradas aún.'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                deliveries
                  .filter(d => {
                    const q = searchTerm.trim().toLowerCase();
                    if (!q) return true;
                    if (searchCriteria === 'medicamento') return (d.medicine_name || '').toLowerCase().includes(q);
                    if (searchCriteria === 'estado') return (getStatusBadge(d.status).label || '').toLowerCase().includes(q);
                    if (searchCriteria === 'id') return (shortId(d.id) || '').toLowerCase().includes(q);
                    return (d.beneficiary_name || '').toLowerCase().includes(q) || (d.beneficiary_cedula || '').toLowerCase().includes(q);
                  })
                  .map((delivery) => {
                  const statusInfo = getStatusBadge(delivery.status);
                  return (
                    <CTableRow key={delivery.id} className="table-row-hover">
                      <CTableDataCell>
                        <strong>{shortId(delivery.id)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{formatDate(delivery.delivery_date)}</div>
                        <small className="text-muted">
                          {delivery.delivery_time && delivery.delivery_time !== '00:00'
                            ? delivery.delivery_time
                            : '—'}
                        </small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilLocationPin} className="me-1" />
                        {delivery.delivery_point || '—'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {delivery.medicine_name ? (
                          <span className="medicine-badge">
                            <CIcon icon={cilUser} className="me-1" size="sm" />
                            {delivery.medicine_name}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {delivery.beneficiary_name ? (
                          <>
                            <CIcon icon={cilPeople} className="me-1" />
                            <div>{delivery.beneficiary_name}</div>
                            {delivery.beneficiary_cedula && (
                              <small className="text-muted">{delivery.beneficiary_cedula}</small>
                            )}
                          </>
                        ) : (
                          '—'
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {delivery.total_quantity} unidades
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={statusInfo.color} className="badge-status">
                          {statusInfo.label}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <small>{delivery.responsible_name || '—'}</small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-1">
                          <CButton color="info" size="sm" title="Ver detalles">
                            <CIcon icon={cilClipboard} />
                          </CButton>
                          <CButton color="warning" size="sm" title="Notificar">
                            <CIcon icon={cilBell} />
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
    </>
  );
};

export default Deliveries;