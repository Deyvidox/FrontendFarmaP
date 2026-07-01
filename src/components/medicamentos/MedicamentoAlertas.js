import React, { useState, useEffect } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CAlert,
  CProgress, CRow, CCol, CButton, CSpinner, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import { 
  cilWarning, cilCalendar, cilMedicalCross, cilBell,
  cilCheckCircle, cilUser, cilInfo
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getMedicineAlerts, getLotById, retireLot } from 'src/services/api';
import '../../css/medicamentos/Medicamentos.css';
import HelpButton from '../common/HelpButton';

const MedicamentoAlertas = () => {
  const [filterStatus, setFilterStatus] = useState('TODAS');
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detailsModal, setDetailsModal] = useState(false);
  const [retireModal, setRetireModal] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotDetails, setLotDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await getMedicineAlerts();
      setAlertas(response?.message?.alerts || []);
    } catch (err) {
      console.error('Error cargando alertas:', err);
      setError(err.message || 'Error al cargar alertas de medicamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const totalAlertas = alertas.length;
  const alertasCriticas = alertas.filter(a => a.alert_status === 'CRITICA').length;
  const alertasProximas = alertas.filter(a => a.alert_status === 'PROXIMA').length;
  const alertasVencidas = alertas.filter(a => a.alert_status === 'VENCIDA').length;
  const alertasSeguras = alertas.filter(a => a.alert_status === 'SEGURA').length;

  const filteredAlertas = filterStatus === 'TODAS' 
    ? alertas 
    : alertas.filter(a => a.alert_status === filterStatus);

  const getAlertaColor = (estado) => {
    switch(estado) {
      case 'CRITICA': return 'danger';
      case 'PROXIMA': return 'warning';
      case 'VENCIDA': return 'dark';
      case 'SEGURA': return 'success';
      default: return 'secondary';
    }
  };

  const getAlertaIcon = (estado) => {
    switch(estado) {
      case 'CRITICA': return cilUser;
      case 'PROXIMA': return cilWarning;
      case 'VENCIDA': return cilCalendar;
      case 'SEGURA': return cilCheckCircle;
      default: return cilBell;
    }
  };

  const getAlertaText = (diasRestantes) => {
    if (diasRestantes < 0) return 'Vencido';
    if (diasRestantes <= 30) return 'Vence este mes';
    if (diasRestantes <= 60) return 'Vence en 2 meses';
    if (diasRestantes <= 90) return 'Vence en 3 meses';
    return 'Vence en más de 3 meses';
  };

  const getProgressValue = (diasRestantes) => {
    if (diasRestantes < 0) return 100;
    if (diasRestantes <= 30) return 90;
    if (diasRestantes <= 60) return 70;
    if (diasRestantes <= 90) return 40;
    return 10;
  };

  const getProgressColor = (diasRestantes) => {
    if (diasRestantes < 0) return 'dark';
    if (diasRestantes <= 30) return 'danger';
    if (diasRestantes <= 60) return 'warning';
    if (diasRestantes <= 90) return 'info';
    return 'success';
  };

  const handleVerDetallesClick = async (lote) => {
    try {
      const res = await getLotById(lote.id);
      setLotDetails(res.message.lot);
      setDetailsModal(true);
    } catch (err) {
      alert('Error obteniendo detalles del lote');
    }
  };

  const handleRetirarClick = (lote) => {
    setSelectedLot(lote);
    setRetireModal(true);
  };

  const confirmRetire = async () => {
    setActionLoading(true);
    try {
      await retireLot(selectedLot.id);
      setRetireModal(false);
      fetchAlerts();
    } catch (err) {
      alert(err.message || 'Error retirando lote');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && alertas.length === 0) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p className="mt-3">Cargando alertas de medicamentos...</p>
      </div>
    );
  }

  if (error) return <CAlert color="danger">{error}</CAlert>;

  return (
    <div className="medicamento-alertas-container">
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-danger h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-danger mb-1 fw-bold">{alertasCriticas}</div>
              <small className="text-muted">Alertas Críticas</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-warning h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-warning mb-1 fw-bold">{alertasProximas}</div>
              <small className="text-muted">Próximas a Vencer</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-dark h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-dark mb-1 fw-bold">{alertasVencidas}</div>
              <small className="text-muted">Ya Vencidas</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-success h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-success mb-1 fw-bold">{alertasSeguras}</div>
              <small className="text-muted">Seguras / Sin Alerta</small>
            </div>
          </div>
        </CCol>
      </CRow>

      {alertasCriticas > 0 && (
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilUser} className="flex-shrink-0 me-2" height={24} />
          <div>
            <strong>Atención:</strong> Hay {alertasCriticas} lote(s) que vencen en menos de 30 días. 
            Se recomienda revisar y tomar acciones inmediatas.
          </div>
        </CAlert>
      )}

      {alertasVencidas > 0 && (
        <CAlert color="dark" className="d-flex align-items-center mt-3">
          <CIcon icon={cilCalendar} className="flex-shrink-0 me-2" height={24} />
          <div>
            <strong>Urgente:</strong> Hay {alertasVencidas} lote(s) que ya han vencido. 
            Deben ser retirados inmediatamente del inventario.
          </div>
        </CAlert>
      )}

      <CCard className="medicamento-card">
        <CCardHeader className="medicamento-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilBell} className="me-2" />
              Alertas de Vencimiento
              <HelpButton title="Manual de Usuario – Alertas de Vencimiento">
                <div>
                  <p>Controla los lotes próximos a vencer o ya vencidos.</p>
                  <h6>Tabla de Alertas</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-2 fw-bold">(1) Lote</div>
                      <div className="col-3 fw-bold">(2) Medicamento</div>
                      <div className="col-2 fw-bold">(3) Vencimiento</div>
                      <div className="col-2 fw-bold">(4) Estado</div>
                      <div className="col-3 fw-bold">(5) Acción</div>
                    </div>
                    <hr/>
                    <div className="row small text-muted">
                      <div className="col-2">L-2023X</div>
                      <div className="col-3">Ibuprofeno</div>
                      <div className="col-2">15-05-2023</div>
                      <div className="col-2"><span className="badge bg-danger">Vencido</span></div>
                      <div className="col-3"><button className="btn btn-sm btn-danger text-white">Retirar</button></div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Lote:</strong> Número de lote afectado.</li>
                    <li><strong>Medicamento:</strong> Producto del lote.</li>
                    <li><strong>Vencimiento:</strong> Fecha de caducidad.</li>
                    <li><strong>Estado:</strong> Vencido (Rojo), Crítico (&lt;30 días, Naranja) o Próximo (Amarillo).</li>
                    <li><strong>Acción (Retirar):</strong> Remueve las unidades restantes del inventario general y las marca como cuarentena o desechadas.</li>
                  </ol>
                  <p className="text-muted"><em>Nota: Use los botones superiores para filtrar rápidamente entre Críticas, Próximas y Vencidas.</em></p>
                </div>
              </HelpButton>
            </h5>
            <div className="d-flex gap-2">
              <CButton color={filterStatus === 'TODAS' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilterStatus('TODAS')}>
                Todas ({totalAlertas})
              </CButton>
              <CButton color={filterStatus === 'CRITICA' ? 'danger' : 'secondary'} size="sm" onClick={() => setFilterStatus('CRITICA')}>
                Críticas ({alertasCriticas})
              </CButton>
              <CButton color={filterStatus === 'PROXIMA' ? 'warning' : 'secondary'} size="sm" onClick={() => setFilterStatus('PROXIMA')}>
                Próximas ({alertasProximas})
              </CButton>
              <CButton color={filterStatus === 'VENCIDA' ? 'dark' : 'secondary'} size="sm" onClick={() => setFilterStatus('VENCIDA')}>
                Vencidas ({alertasVencidas})
              </CButton>
            </div>
          </div>
        </CCardHeader>
        <CCardBody className="medicamento-card-body">
          <div className="table-responsive">
            <CTable hover responsive className="medicamento-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Lote</CTableHeaderCell>
                  <CTableHeaderCell>Medicamento</CTableHeaderCell>
                  <CTableHeaderCell>Laboratorio</CTableHeaderCell>
                  <CTableHeaderCell>Fecha Vencimiento</CTableHeaderCell>
                  <CTableHeaderCell>Días Restantes</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Ubicación</CTableHeaderCell>
                  <CTableHeaderCell>Progreso</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredAlertas.length > 0 ? (
                  filteredAlertas.map((alerta) => (
                    <CTableRow key={alerta.id}>
                      <CTableDataCell><strong>{alerta.lot_number}</strong></CTableDataCell>
                      <CTableDataCell>{alerta.medicine}</CTableDataCell>
                      <CTableDataCell>{alerta.laboratory || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{new Date(alerta.expiration_date).toLocaleDateString('es-ES')}</CTableDataCell>
                      <CTableDataCell>
                        <strong className={alerta.days_remaining < 0 ? 'text-danger' : ''}>
                          {alerta.days_remaining < 0 ? `${Math.abs(alerta.days_remaining)} días vencido` : `${alerta.days_remaining} días`}
                        </strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getAlertaColor(alerta.alert_status)}>
                          <CIcon icon={getAlertaIcon(alerta.alert_status)} className="me-1" />
                          {alerta.alert_status}
                        </CBadge>
                        <div className="small text-muted">{getAlertaText(alerta.days_remaining)}</div>
                      </CTableDataCell>
                      <CTableDataCell><strong>{alerta.total_units}</strong> unidades</CTableDataCell>
                      <CTableDataCell>{alerta.warehouse_location || 'Sin asignar'}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CProgress className="flex-grow-1 me-2" value={getProgressValue(alerta.days_remaining)} color={getProgressColor(alerta.days_remaining)} style={{ height: '8px' }} />
                          <small className="text-muted">{getProgressValue(alerta.days_remaining)}%</small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton color="info" variant="outline" size="sm" onClick={() => handleVerDetallesClick(alerta)} title="Ver detalles">
                            <CIcon icon={cilInfo} />
                          </CButton>
                          {(alerta.alert_status === 'VENCIDA' || alerta.alert_status === 'CRITICA') && (
                            <CButton color="danger" variant="outline" size="sm" onClick={() => handleRetirarClick(alerta)} title="Retirar del inventario">
                              Retirar
                            </CButton>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="10" className="text-center py-5">
                      <div className="medicamento-empty-state">
                        <CIcon icon={cilCheckCircle} className="medicamento-empty-state-icon text-success" />
                        <h5>No hay alertas</h5>
                        <p className="text-muted">
                          {filterStatus !== 'TODAS' ? `No hay alertas con estado "${filterStatus}"` : 'No hay alertas de vencimiento registradas'}
                        </p>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal Detalles */}
      <CModal visible={detailsModal} onClose={() => setDetailsModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Detalles del Lote</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {lotDetails && (
            <div>
              <p><strong>Lote:</strong> {lotDetails.lot_number}</p>
              <p><strong>Medicamento:</strong> {lotDetails.medicine}</p>
              <p><strong>Código Nacional:</strong> {lotDetails.national_code}</p>
              <p><strong>Fecha Vencimiento:</strong> {new Date(lotDetails.expiration_date).toLocaleDateString('es-ES')}</p>
              <p><strong>Unidades Totales:</strong> {lotDetails.total_units}</p>
              <p><strong>Ubicación:</strong> {lotDetails.warehouse_location}</p>
              <p><strong>Estado:</strong> <CBadge color="info">{lotDetails.status}</CBadge></p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailsModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Retirar */}
      <CModal visible={retireModal} onClose={() => setRetireModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Retiro</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea retirar el lote <strong>{selectedLot?.lot_number}</strong>? Su estado pasará a Depleted (Agotado/Retirado).
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRetireModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmRetire} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm"/> : 'Retirar'}
          </CButton>
        </CModalFooter>
      </CModal>

    </div>
  );
};

export default MedicamentoAlertas;