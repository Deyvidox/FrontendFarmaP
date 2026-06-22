import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CBadge,
  CProgress,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilMedicalCross,
  cilHeart,
  cilSave,
  cilCalendar,
  cilWarning,
  cilUser,
  cilFire,
  cilInfo,
  cilPencil
} from '@coreui/icons';
import { getBeneficiaries } from 'src/services/api';
import '../../css/beneficiarios/BeneficiariesMedical.css';

const BeneficiaryMedicalCards = () => {
  const [activeTab, setActiveTab] = useState('criticos');
  const [showModal, setShowModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [modalTab, setModalTab] = useState('enfermedades');

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await getBeneficiaries();
        setBeneficiarios(response?.message?.beneficiaries || []);
      } catch (err) {
        console.error('Error fetching beneficiaries:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  // Mapeo de prioridad a estado general (incluye 'Critical')
  const getEstadoGeneral = (priority) => {
    if (!priority) return 'ESTABLE';
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
      case 'ALTA':
        return 'CRÍTICO';
      case 'MEDIUM':
      case 'MEDIA':
        return 'GRAVE';
      case 'LOW':
      case 'BAJA':
        return 'ESTABLE';
      default:
        return 'ESTABLE';
    }
  };

  // Filtros
  const beneficiariosCriticos = beneficiarios.filter(b => getEstadoGeneral(b.priority_level) === 'CRÍTICO');
  const beneficiariosGraves = beneficiarios.filter(b => getEstadoGeneral(b.priority_level) === 'GRAVE');
  const beneficiariosEstables = beneficiarios.filter(b => getEstadoGeneral(b.priority_level) === 'ESTABLE');

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CRÍTICO': return 'danger';
      case 'GRAVE': return 'warning';
      case 'ESTABLE': return 'success';
      default: return 'secondary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'CRÍTICO': return cilFire;
      case 'GRAVE': return cilWarning;
      case 'ESTABLE': return cilInfo;
      default: return cilMedicalCross;
    }
  };

  const getBeneficiariosMostrar = () => {
    switch (activeTab) {
      case 'criticos': return beneficiariosCriticos;
      case 'graves': return beneficiariosGraves;
      case 'estables': return beneficiariosEstables;
      default: return beneficiarios;
    }
  };

  const beneficiariosMostrar = getBeneficiariosMostrar();

  // Helper para color de estado de enfermedad (basado en current_status)
  const getDiseaseStatusColor = (status) => {
    if (!status) return 'secondary';
    const s = status.toUpperCase();
    if (s === 'CRÍTICO' || s === 'CRITICAL') return 'danger';
    if (s === 'GRAVE' || s === 'SEVERE') return 'warning';
    if (s === 'MODERADO' || s === 'MODERATE') return 'info';
    if (s === 'ESTABLE' || s === 'STABLE' || s === 'CONTROLADO') return 'success';
    return 'secondary';
  };

  // Tarjeta individual
  const TarjetaBeneficiario = ({ beneficiario }) => {
    const enfermedades = beneficiario.enfermedades || [];
    const vulnerabilidades = beneficiario.vulnerabilidades || [];
    const estadoGeneral = getEstadoGeneral(beneficiario.priority_level);
    const puntuacionRiesgo = estadoGeneral === 'CRÍTICO' ? 85 : estadoGeneral === 'GRAVE' ? 65 : 25;
    const totalVulnerabilidades = vulnerabilidades.reduce((sum, vul) => sum + (vul.puntos || 0), 0);

    // Primera enfermedad para destacar
    const enfermedadPrincipal = enfermedades.length > 0 ? enfermedades[0] : null;

    return (
      <CCol key={beneficiario.id} xs={12} md={6} lg={4} className="mb-4">
        <CCard className="h-100" style={{
          borderLeft: `5px solid var(--cui-${getEstadoColor(estadoGeneral)})`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">{beneficiario.first_name} {beneficiario.last_name}</h6>
              <small className="text-muted">
                <CIcon icon={cilUser} className="me-1" size="sm" />
                {beneficiario.age || 'N/A'} años | {beneficiario.community_name || 'N/A'}
              </small>
            </div>
            <CBadge color={getEstadoColor(estadoGeneral)}>
              <CIcon icon={getEstadoIcon(estadoGeneral)} className="me-1" />
              {estadoGeneral}
            </CBadge>
          </CCardHeader>

          <CCardBody>
            {/* Enfermedad Principal */}
            {enfermedadPrincipal ? (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="text-primary">Enfermedad Principal</strong>
                  <CBadge color={getDiseaseStatusColor(enfermedadPrincipal.estado)}>
                    {enfermedadPrincipal.estado || 'Sin estado'}
                  </CBadge>
                </div>
                <p className="mb-1">
                  <CIcon icon={cilMedicalCross} className="me-2 text-danger" />
                  <strong>{enfermedadPrincipal.nombre}</strong>
                </p>
                {enfermedadPrincipal.fechaDiagnostico && (
                  <small className="text-muted d-block">
                    <CIcon icon={cilCalendar} className="me-1" size="sm" />
                    Diagnóstico: {enfermedadPrincipal.fechaDiagnostico}
                  </small>
                )}
                {enfermedadPrincipal.tratamiento && (
                  <small className="text-muted d-block mt-1">
                    <strong>Tratamiento:</strong> {enfermedadPrincipal.tratamiento}
                  </small>
                )}
              </div>
            ) : (
              <div className="mb-3">
                <strong className="text-primary">Enfermedades</strong>
                <p className="text-muted mb-0">Sin enfermedades registradas</p>
              </div>
            )}

            {/* Resumen */}
            <div className="row mb-3">
              <div className="col-6">
                <div className="text-center">
                  <div className="h4 mb-0 text-primary">{enfermedades.length}</div>
                  <small className="text-muted">Enfermedades</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <div className="h4 mb-0 text-warning">{totalVulnerabilidades}</div>
                  <small className="text-muted">Pts Vulnerabilidad</small>
                </div>
              </div>
            </div>

            {/* Barra de Riesgo */}
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <small>Riesgo de Salud</small>
                <small className="fw-bold">{puntuacionRiesgo}%</small>
              </div>
              <CProgress
                color={puntuacionRiesgo >= 80 ? 'danger' :
                  puntuacionRiesgo >= 60 ? 'warning' : 'success'}
                value={puntuacionRiesgo}
                className="mb-2"
                style={{ height: '10px' }}
              />
            </div>

            {/* Vulnerabilidades resumidas */}
            {vulnerabilidades.length > 0 && (
              <div className="mb-3">
                <small className="fw-bold">
                  <CIcon icon={cilWarning} className="me-1" />
                  Vulnerabilidades:
                </small>
                <ul className="list-unstyled mb-0 mt-1">
                  {vulnerabilidades.slice(0, 2).map(v => (
                    <li key={v.id} className="small text-muted">
                      • {v.nombre} ({v.puntos} pts)
                    </li>
                  ))}
                  {vulnerabilidades.length > 2 && (
                    <li className="small text-muted">... y {vulnerabilidades.length - 2} más</li>
                  )}
                </ul>
              </div>
            )}

            {/* Botones */}
            <div className="d-flex gap-2">
              <CButton
                color="primary"
                size="sm"
                className="flex-fill"
                onClick={() => {
                  setSelectedBeneficiary(beneficiario);
                  setShowModal(true);
                }}
              >
                <CIcon icon={cilPencil} className="me-1" />
                Ver Detalles
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    );
  };

  // Modal con datos reales del beneficiario seleccionado
  const BeneficiaryModal = () => {
    if (!selectedBeneficiary) return null;
    const enf = selectedBeneficiary.enfermedades || [];
    const vul = selectedBeneficiary.vulnerabilidades || [];

    return (
      <CModal size="lg" visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilMedicalCross} className="me-2" />
            {selectedBeneficiary.first_name} {selectedBeneficiary.last_name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTabs activeTab={modalTab} onActiveTabChange={setModalTab}>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="enfermedades">
                  <CIcon icon={cilMedicalCross} className="me-1" />
                  Enfermedades ({enf.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="vulnerabilidades">
                  <CIcon icon={cilWarning} className="me-1" />
                  Vulnerabilidades ({vul.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="medicamentos">
                  <CIcon icon={cilHeart} className="me-1" />
                  Medicamentos (próximamente)
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane data-tab="enfermedades">
                {enf.length > 0 ? (
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Enfermedad</CTableHeaderCell>
                        <CTableHeaderCell>Fecha Diagnóstico</CTableHeaderCell>
                        <CTableHeaderCell>Estado</CTableHeaderCell>
                        <CTableHeaderCell>Tratamiento</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {enf.map((e, idx) => (
                        <CTableRow key={e.id || idx}>
                          <CTableDataCell>{e.nombre}</CTableDataCell>
                          <CTableDataCell>{e.fechaDiagnostico || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getDiseaseStatusColor(e.estado)}>
                              {e.estado || 'Sin estado'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{e.tratamiento || 'No especificado'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <p className="text-muted text-center">No hay enfermedades registradas.</p>
                )}
              </CTabPane>

              <CTabPane data-tab="vulnerabilidades">
                {vul.length > 0 ? (
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Vulnerabilidad</CTableHeaderCell>
                        <CTableHeaderCell>Puntos</CTableHeaderCell>
                        <CTableHeaderCell>Observaciones</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {vul.map((v, idx) => (
                        <CTableRow key={v.id || idx}>
                          <CTableDataCell>{v.nombre}</CTableDataCell>
                          <CTableDataCell>{v.puntos || 0} pts</CTableDataCell>
                          <CTableDataCell>{v.observaciones || '—'}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <p className="text-muted text-center">No hay vulnerabilidades registradas.</p>
                )}
              </CTabPane>

              <CTabPane data-tab="medicamentos">
                <p className="text-muted text-center">Funcionalidad en desarrollo.</p>
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </CButton>
          {/* El botón Guardar Cambios queda para futura edición */}
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <>
      <CCard className="beneficiary-card">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilMedicalCross} className="me-2" />
              Historial Médico de Beneficiarios
            </h5>
            <div className="d-flex gap-2">
              <CButton color="secondary" size="sm">
                <CIcon icon={cilMedicalCross} className="me-1" /> {/* ícono placeholder */}
                Generar Reporte
              </CButton>
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3">Cargando datos médicos...</p>
            </div>
          ) : error ? (
            <CAlert color="danger">{error}</CAlert>
          ) : (
            <>
              {/* Filtros */}
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2">
                  <CButton color={activeTab === 'criticos' ? 'danger' : 'outline-danger'} size="sm"
                    onClick={() => setActiveTab('criticos')}>
                    <CIcon icon={cilFire} className="me-1" />
                    Críticos ({beneficiariosCriticos.length})
                  </CButton>
                  <CButton color={activeTab === 'graves' ? 'warning' : 'outline-warning'} size="sm"
                    onClick={() => setActiveTab('graves')}>
                    <CIcon icon={cilWarning} className="me-1" />
                    Graves ({beneficiariosGraves.length})
                  </CButton>
                  <CButton color={activeTab === 'estables' ? 'success' : 'outline-success'} size="sm"
                    onClick={() => setActiveTab('estables')}>
                    <CIcon icon={cilInfo} className="me-1" />
                    Estables ({beneficiariosEstables.length})
                  </CButton>
                  <CButton color={activeTab === 'todos' ? 'primary' : 'outline-primary'} size="sm"
                    onClick={() => setActiveTab('todos')}>
                    Todos ({beneficiarios.length})
                  </CButton>
                </div>
              </div>

              {/* Contador */}
              <div className="alert alert-info mb-4">
                <div className="row text-center">
                  <div className="col">
                    <div className="h4 text-danger mb-0">{beneficiariosCriticos.length}</div>
                    <small>Críticos</small>
                  </div>
                  <div className="col">
                    <div className="h4 text-warning mb-0">{beneficiariosGraves.length}</div>
                    <small>Graves</small>
                  </div>
                  <div className="col">
                    <div className="h4 text-success mb-0">{beneficiariosEstables.length}</div>
                    <small>Estables</small>
                  </div>
                  <div className="col">
                    <div className="h4 text-primary mb-0">{beneficiarios.length}</div>
                    <small>Total</small>
                  </div>
                </div>
              </div>

              <CRow>
                {beneficiariosMostrar.map(b => (
                  <TarjetaBeneficiario key={b.id} beneficiario={b} />
                ))}
                {beneficiariosMostrar.length === 0 && (
                  <CCol xs={12} className="text-center py-4">
                    <p className="text-muted">No se encontraron beneficiarios en esta categoría.</p>
                  </CCol>
                )}
              </CRow>
            </>
          )}
        </CCardBody>
      </CCard>

      <BeneficiaryModal />
    </>
  );
};

export default BeneficiaryMedicalCards;