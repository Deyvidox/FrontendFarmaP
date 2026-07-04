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
import ToastNotification from '../common/ToastNotification';

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type })
    setTimeout(() => setToast({ show: true, message, type }), 20)
  };

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
    switch (estado) {
      case 'CRITICA': return 'danger';
      case 'PROXIMA': return 'warning';
      case 'VENCIDA': return 'dark';
      case 'SEGURA': return 'success';
      default: return 'secondary';
    }
  };

  const getAlertaIcon = (estado) => {
    switch (estado) {
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
      showToast('Error obteniendo detalles del lote', 'danger');
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
      showToast('Lote retirado exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error retirando lote', 'danger');
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
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-danger h-100" style={{ minHeight: '90px' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-danger mb-1 fw-bold">{alertasCriticas}</div>
              <small className="text-muted">Alertas Críticas</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-warning h-100" style={{ minHeight: '90px' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-warning mb-1 fw-bold">{alertasProximas}</div>
              <small className="text-muted">Próximas a Vencer</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-dark h-100" style={{ minHeight: '90px' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-dark mb-1 fw-bold">{alertasVencidas}</div>
              <small className="text-muted">Ya Vencidas</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-success h-100" style={{ minHeight: '90px' }}>
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
                  <p><strong>¿Qué hace esta pantalla?</strong><br />
                    Monitorea las fechas de vencimiento de los lotes de medicamentos en inventario. Clasifica los lotes según su proximidad al vencimiento y permite tomar acciones como retirar lotes vencidos o próximos a vencer.</p>
                  <h6>🧪 Ejemplo de alertas</h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f8f9fa', color: '#212529', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: '#e9ecef' }}>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Lote</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Medicamento</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Laboratorio</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Vencimiento</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Días Rest.</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Estado</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Cantidad</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Ubicación</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Progreso</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>LOTE-202512</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Amoxicilina 500mg</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Laboratorios Vargas S.A.</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>1/9/2026</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><strong>61 días</strong></td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#ffc107', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>PRÓXIMA</span></td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>300 unds</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Almacén General</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                            <div style={{ width: '100%', background: '#e9ecef', borderRadius: '4px' }}><div style={{ width: '40%', height: '8px', background: '#ffc107', borderRadius: '4px' }}></div></div>
                            <small>40%</small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h6>📋 Interpretación y uso</h6>
                  <ol>
                    <li><strong>Tarjetas de resumen:</strong> Muestran cuántos lotes hay en cada categoría (Críticas, Próximas, Vencidas, Seguras).</li>
                    <li><strong>Estados de alerta:</strong>
                      <ul>
                        <li><span style={{ color: 'red' }}>CRÍTICA</span>: Vence en ≤30 días.</li>
                        <li><span style={{ color: 'orange' }}>PRÓXIMA</span>: Vence en 31-90 días.</li>
                        <li><span style={{ color: 'black' }}>VENCIDA</span>: Ya pasó la fecha de vencimiento.</li>
                        <li><span style={{ color: 'green' }}>SEGURA</span>: Más de 90 días para vencer.</li>
                      </ul>
                    </li>
                    <li><strong>Barra de progreso:</strong> Indica qué tan cerca está la fecha de vencimiento. Rojo = crítico, Amarillo = próximo, Verde = seguro.</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Ver detalles (i):</strong> Abre un modal con toda la información del lote.</li>
                        <li><strong>Retirar:</strong> Solo disponible en lotes Vencidos o Críticos. Cambia el estado del lote a "Depleted" (agotado/retirado). Requiere confirmación.</li>
                      </ul>
                    </li>
                    <li><strong>Filtros rápidos:</strong> Use los botones superiores para ver solo un tipo de alerta.</li>
                  </ol>
                  <p><strong>⚠️ Importante:</strong> Retire los lotes vencidos lo antes posible para evitar confusiones en el inventario. Los lotes retirados no se pueden recuperar.</p>
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
            {actionLoading ? <CSpinner size="sm" /> : 'Retirar'}
          </CButton>
        </CModalFooter>
      </CModal>

    </div>
  );
};

export default MedicamentoAlertas;