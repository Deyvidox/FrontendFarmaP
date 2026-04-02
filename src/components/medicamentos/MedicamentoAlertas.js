import React, { useState } from 'react';
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
  CAlert,
  CProgress,
  CRow,
  CCol,
  CButton
} from '@coreui/react';
import { 
  cilWarning,
  cilCalendar,
  cilMedicalCross,
  cilBell,
  cilCheckCircle,
  cilUser
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/medicamentos/Medicamentos.css';

const MedicamentoAlertas = () => {
  const [filterStatus, setFilterStatus] = useState('TODAS');

  // Datos quemados de alertas de vencimiento
  const alertasQuemadas = [
    {
      id: 1,
      LoteNumero: 'LOT-2024-001',
      Medicamento: 'Paracetamol 500mg',
      Laboratorio: 'Genfar',
      FechaVencimiento: '2024-03-15',
      DiasRestantes: 45,
      Cantidad: 500,
      Ubicacion: 'Estante A1',
      EstadoAlerta: 'CRITICA',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 2,
      LoteNumero: 'LOT-2024-002',
      Medicamento: 'Amoxicilina 250mg',
      Laboratorio: 'Pfizer',
      FechaVencimiento: '2024-04-20',
      DiasRestantes: 81,
      Cantidad: 300,
      Ubicacion: 'Estante B2',
      EstadoAlerta: 'PROXIMA',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 3,
      LoteNumero: 'LOT-2023-045',
      Medicamento: 'Losartán 50mg',
      Laboratorio: 'Roche',
      FechaVencimiento: '2024-02-28',
      DiasRestantes: 0,
      Cantidad: 150,
      Ubicacion: 'Estante C3',
      EstadoAlerta: 'VENCIDA',
      EstadoLote: 'RETIRADO'
    },
    {
      id: 4,
      LoteNumero: 'LOT-2024-003',
      Medicamento: 'Insulina NPH',
      Laboratorio: 'Novo Nordisk',
      FechaVencimiento: '2024-05-10',
      DiasRestantes: 101,
      Cantidad: 200,
      Ubicacion: 'Refrigerador 1',
      EstadoAlerta: 'SEGURA',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 5,
      LoteNumero: 'LOT-2024-004',
      Medicamento: 'Omeprazol 20mg',
      Laboratorio: 'AstraZeneca',
      FechaVencimiento: '2024-03-05',
      DiasRestantes: 35,
      Cantidad: 400,
      Ubicacion: 'Estante A2',
      EstadoAlerta: 'CRITICA',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 6,
      LoteNumero: 'LOT-2024-005',
      Medicamento: 'Atorvastatina 40mg',
      Laboratorio: 'Pfizer',
      FechaVencimiento: '2024-06-30',
      DiasRestantes: 152,
      Cantidad: 250,
      Ubicacion: 'Estante B1',
      EstadoAlerta: 'SEGURA',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 7,
      LoteNumero: 'LOT-2023-050',
      Medicamento: 'Salbutamol Inhalador',
      Laboratorio: 'GSK',
      FechaVencimiento: '2024-01-15',
      DiasRestantes: -15,
      Cantidad: 100,
      Ubicacion: 'Estante D4',
      EstadoAlerta: 'VENCIDA',
      EstadoLote: 'RETIRADO'
    },
    {
      id: 8,
      LoteNumero: 'LOT-2024-006',
      Medicamento: 'Diclofenaco Gel 1%',
      Laboratorio: 'Novartis',
      FechaVencimiento: '2024-04-01',
      DiasRestantes: 62,
      Cantidad: 350,
      Ubicacion: 'Estante C2',
      EstadoAlerta: 'PROXIMA',
      EstadoLote: 'DISPONIBLE'
    }
  ];

  // Estadísticas
  const totalAlertas = alertasQuemadas.length;
  const alertasCriticas = alertasQuemadas.filter(a => a.EstadoAlerta === 'CRITICA').length;
  const alertasProximas = alertasQuemadas.filter(a => a.EstadoAlerta === 'PROXIMA').length;
  const alertasVencidas = alertasQuemadas.filter(a => a.EstadoAlerta === 'VENCIDA').length;
  const alertasSeguras = alertasQuemadas.filter(a => a.EstadoAlerta === 'SEGURA').length;

  // Filtrar alertas
  const filteredAlertas = filterStatus === 'TODAS' 
    ? alertasQuemadas 
    : alertasQuemadas.filter(a => a.EstadoAlerta === filterStatus);

  // Obtener color según estado de alerta
  const getAlertaColor = (estado) => {
    switch(estado) {
      case 'CRITICA': return 'danger';
      case 'PROXIMA': return 'warning';
      case 'VENCIDA': return 'dark';
      case 'SEGURA': return 'success';
      default: return 'secondary';
    }
  };

  // Obtener icono según estado de alerta
  const getAlertaIcon = (estado) => {
    switch(estado) {
      case 'CRITICA': return cilUser;
      case 'PROXIMA': return cilWarning;
      case 'VENCIDA': return cilCalendar;
      case 'SEGURA': return cilCheckCircle;
      default: return cilBell;
    }
  };

  // Obtener texto descriptivo
  const getAlertaText = (diasRestantes) => {
    if (diasRestantes < 0) return 'Vencido';
    if (diasRestantes <= 30) return 'Vence este mes';
    if (diasRestantes <= 60) return 'Vence en 2 meses';
    if (diasRestantes <= 90) return 'Vence en 3 meses';
    return 'Vence en más de 3 meses';
  };

  // Obtener progreso de vencimiento
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

  // Handlers
  const handleRetirarClick = (lote) => {
    console.log('Retirar lote:', lote);
  };

  const handleVerDetallesClick = (lote) => {
    console.log('Ver detalles lote:', lote);
  };

  return (
    <div className="medicamento-alertas-container">
      {/* Resumen de alertas */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-danger">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{alertasCriticas}</div>
                <div>Alertas Críticas</div>
              </div>
              <CIcon icon={cilUser} height={48} className="text-white opacity-50" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-warning">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{alertasProximas}</div>
                <div>Próximas a Vencer</div>
              </div>
              <CIcon icon={cilWarning} height={48} className="text-white opacity-50" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-dark">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{alertasVencidas}</div>
                <div>Vencidas</div>
              </div>
              <CIcon icon={cilCalendar} height={48} className="text-white opacity-50" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-success">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{alertasSeguras}</div>
                <div>Seguras</div>
              </div>
              <CIcon icon={cilCheckCircle} height={48} className="text-white opacity-50" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Alertas importantes */}
      {alertasCriticas > 0 && (
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilUser} className="flex-shrink-0 me-2" height={24} />
          <div>
            <strong>Atención:</strong> Hay {alertasCriticas} lote(s) de medicamentos que vencen en menos de 30 días. 
            Se recomienda revisar y tomar acciones inmediatas.
          </div>
        </CAlert>
      )}

      {alertasVencidas > 0 && (
        <CAlert color="dark" className="d-flex align-items-center mt-3">
          <CIcon icon={cilCalendar} className="flex-shrink-0 me-2" height={24} />
          <div>
            <strong>Urgente:</strong> Hay {alertasVencidas} lote(s) de medicamentos que ya han vencido. 
            Deben ser retirados inmediatamente del inventario.
          </div>
        </CAlert>
      )}

      {/* Tabla de alertas */}
      <CCard className="medicamento-card">
        <CCardHeader className="medicamento-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilBell} className="me-2" />
              Alertas de Vencimiento
            </h5>
            <div className="d-flex gap-2">
              <CButton 
                color={filterStatus === 'TODAS' ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setFilterStatus('TODAS')}
              >
                Todas ({totalAlertas})
              </CButton>
              <CButton 
                color={filterStatus === 'CRITICA' ? 'danger' : 'secondary'} 
                size="sm"
                onClick={() => setFilterStatus('CRITICA')}
              >
                Críticas ({alertasCriticas})
              </CButton>
              <CButton 
                color={filterStatus === 'PROXIMA' ? 'warning' : 'secondary'} 
                size="sm"
                onClick={() => setFilterStatus('PROXIMA')}
              >
                Próximas ({alertasProximas})
              </CButton>
              <CButton 
                color={filterStatus === 'VENCIDA' ? 'dark' : 'secondary'} 
                size="sm"
                onClick={() => setFilterStatus('VENCIDA')}
              >
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
                      <CTableDataCell>
                        <strong>{alerta.LoteNumero}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{alerta.Medicamento}</CTableDataCell>
                      <CTableDataCell>{alerta.Laboratorio}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(alerta.FechaVencimiento).toLocaleDateString('es-ES')}
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong className={alerta.DiasRestantes < 0 ? 'text-danger' : ''}>
                          {alerta.DiasRestantes < 0 ? 
                            `${Math.abs(alerta.DiasRestantes)} días vencido` : 
                            `${alerta.DiasRestantes} días`
                          }
                        </strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getAlertaColor(alerta.EstadoAlerta)}>
                          <CIcon icon={getAlertaIcon(alerta.EstadoAlerta)} className="me-1" />
                          {alerta.EstadoAlerta}
                        </CBadge>
                        <div className="small text-muted">{getAlertaText(alerta.DiasRestantes)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{alerta.Cantidad}</strong> unidades
                      </CTableDataCell>
                      <CTableDataCell>{alerta.Ubicacion}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CProgress 
                            className="flex-grow-1 me-2" 
                            value={getProgressValue(alerta.DiasRestantes)}
                            color={getProgressColor(alerta.DiasRestantes)}
                            style={{ height: '8px' }}
                          />
                          <small className="text-muted">{getProgressValue(alerta.DiasRestantes)}%</small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton
                            color="primary"
                            size="sm"
                            className="medicamento-action-btn"
                            onClick={() => handleVerDetallesClick(alerta)}
                            title="Ver detalles"
                          >
                            Detalles
                          </CButton>
                          {(alerta.EstadoAlerta === 'VENCIDA' || alerta.EstadoAlerta === 'CRITICA') && (
                            <CButton
                              color="danger"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => handleRetirarClick(alerta)}
                              title="Retirar del inventario"
                            >
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
                          {filterStatus !== 'TODAS' 
                            ? `No hay alertas con estado "${filterStatus}"` 
                            : 'No hay alertas de vencimiento registradas'
                          }
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
    </div>
  );
};

export default MedicamentoAlertas;