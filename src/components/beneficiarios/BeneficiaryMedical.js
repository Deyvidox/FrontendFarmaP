import React, { useState } from 'react';
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
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilMedicalCross, 
  cilHeart, 
  cilNotes, 
  cilPlus, 
  cilSave, 
  cilTrash, 
  cilFile,
  cilCalendar,
  cilWarning,
  cilUser,
  cilFire,
  cilInfo,
  cilClipboard,
  cilPencil
} from '@coreui/icons';
import '../../css/beneficiarios/BeneficiariesMedical.css';

const BeneficiaryMedicalCards = () => {
  const [activeTab, setActiveTab] = useState('criticos');
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('enfermedades');

  // Datos de ejemplo
  const beneficiarios = [
    {
      id: 1,
      BenCedula: 'V-12345678',
      BenNombres: 'María José',
      BenApellidos: 'González Pérez',
      BenEdad: 68,
      BenGenero: 'F',
      BenNivelPrioridad: 'ALTA',
      ComMunicipio: 'Sucre',
      ComNombre: 'Las Vegas',
      enfermedades: [
        {
          id: 1,
          nombre: 'Diabetes Tipo 2',
          fechaDiagnostico: '2023-05-15',
          estado: 'CRÍTICO',
          tratamiento: 'Metformina 850mg 2x día',
          observaciones: 'Última glicemia: 280 mg/dL',
          prioridad: 10,
          ultimoControl: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'Hipertensión Arterial',
          fechaDiagnostico: '2022-08-10',
          estado: 'ESTABLE',
          tratamiento: 'Losartán 50mg 1x día',
          observaciones: 'Control cada 3 meses',
          prioridad: 5,
          ultimoControl: '2023-12-20'
        }
      ],
      vulnerabilidades: [
        { id: 1, nombre: 'Adulto Mayor', puntos: 20 },
        { id: 2, nombre: 'Discapacidad Motora', puntos: 15 }
      ],
      medicamentosActivos: 3,
      estadoGeneral: 'CRÍTICO',
      puntuacionRiesgo: 85,
      ultimaConsulta: '2024-01-15',
      proximaCita: '2024-02-15',
      alertas: ['Glicemia elevada', 'Control pendiente']
    },
    {
      id: 2,
      BenCedula: 'V-23456789',
      BenNombres: 'Carlos Manuel',
      BenApellidos: 'Rodríguez López',
      BenEdad: 72,
      BenGenero: 'M',
      BenNivelPrioridad: 'ALTA',
      ComMunicipio: 'Libertador',
      ComNombre: 'Tariba',
      enfermedades: [
        {
          id: 1,
          nombre: 'Insuficiencia Cardíaca',
          fechaDiagnostico: '2023-01-20',
          estado: 'GRAVE',
          tratamiento: 'Furosemida 40mg, Enalapril 10mg',
          observaciones: 'Última eco: FE 35%',
          prioridad: 9,
          ultimoControl: '2024-01-10'
        }
      ],
      vulnerabilidades: [
        { id: 1, nombre: 'Adulto Mayor', puntos: 20 },
        { id: 2, nombre: 'Vivienda Precaria', puntos: 10 }
      ],
      medicamentosActivos: 2,
      estadoGeneral: 'GRAVE',
      puntuacionRiesgo: 75,
      ultimaConsulta: '2024-01-10',
      proximaCita: '2024-02-10',
      alertas: ['Control cardiológico pendiente']
    },
    {
      id: 3,
      BenCedula: 'V-34567890',
      BenNombres: 'Ana Isabel',
      BenApellidos: 'Martínez García',
      BenEdad: 52,
      BenGenero: 'F',
      BenNivelPrioridad: 'MEDIA',
      ComMunicipio: 'Sucre',
      ComNombre: 'San Cristobal',
      enfermedades: [
        {
          id: 1,
          nombre: 'Artritis Reumatoide',
          fechaDiagnostico: '2021-03-15',
          estado: 'MODERADO',
          tratamiento: 'Metotrexato 15mg semanal',
          observaciones: 'Control reumatológico',
          prioridad: 6,
          ultimoControl: '2023-12-05'
        }
      ],
      vulnerabilidades: [
        { id: 1, nombre: 'Madre Soltera', puntos: 8 }
      ],
      medicamentosActivos: 1,
      estadoGeneral: 'ESTABLE',
      puntuacionRiesgo: 45,
      ultimaConsulta: '2023-12-05',
      proximaCita: '2024-03-05',
      alertas: []
    },
    {
      id: 4,
      BenCedula: 'V-45678901',
      BenNombres: 'Pedro Antonio',
      BenApellidos: 'Sánchez Díaz',
      BenEdad: 35,
      BenGenero: 'M',
      BenNivelPrioridad: 'BAJA',
      ComMunicipio: 'Libertador',
      ComNombre: 'Palmira',
      enfermedades: [
        {
          id: 1,
          nombre: 'Hipertensión Leve',
          fechaDiagnostico: '2022-11-30',
          estado: 'CONTROLADO',
          tratamiento: 'Lisinopril 10mg',
          observaciones: 'Sin complicaciones',
          prioridad: 3,
          ultimoControl: '2023-11-30'
        }
      ],
      vulnerabilidades: [],
      medicamentosActivos: 1,
      estadoGeneral: 'ESTABLE',
      puntuacionRiesgo: 25,
      ultimaConsulta: '2023-11-30',
      proximaCita: '2024-05-30',
      alertas: []
    }
  ];

  // Filtrar por estado
  const beneficiariosCriticos = beneficiarios.filter(b => b.estadoGeneral === 'CRÍTICO');
  const beneficiariosGraves = beneficiarios.filter(b => b.estadoGeneral === 'GRAVE');
  const beneficiariosEstables = beneficiarios.filter(b => b.estadoGeneral === 'ESTABLE');

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'CRÍTICO': return 'danger';
      case 'GRAVE': return 'warning';
      case 'ESTABLE': return 'success';
      default: return 'secondary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'CRÍTICO': return cilFire;
      case 'GRAVE': return cilWarning;
      case 'ESTABLE': return cilInfo;
      default: return cilMedicalCross;
    }
  };

  // Función para mostrar beneficiarios según pestaña activa
  const getBeneficiariosMostrar = () => {
    switch(activeTab) {
      case 'criticos': return beneficiariosCriticos;
      case 'graves': return beneficiariosGraves;
      case 'estables': return beneficiariosEstables;
      default: return beneficiarios;
    }
  };

  const beneficiariosMostrar = getBeneficiariosMostrar();

  // Tarjeta de beneficiario
  const TarjetaBeneficiario = ({ beneficiario }) => {
    const enfermedadesOrdenadas = [...beneficiario.enfermedades].sort((a, b) => b.prioridad - a.prioridad);
    const enfermedadPrincipal = enfermedadesOrdenadas[0];
    const totalVulnerabilidades = beneficiario.vulnerabilidades.reduce((sum, vul) => sum + vul.puntos, 0);

    return (
      <CCol key={beneficiario.id} xs={12} md={6} lg={4} className="mb-4">
        <CCard className="h-100" style={{
          borderLeft: `5px solid var(--cui-${getEstadoColor(beneficiario.estadoGeneral)})`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">{beneficiario.BenNombres} {beneficiario.BenApellidos}</h6>
              <small className="text-muted">
                <CIcon icon={cilUser} className="me-1" size="sm" />
                {beneficiario.BenEdad} años | {beneficiario.ComNombre}
              </small>
            </div>
            <CBadge color={getEstadoColor(beneficiario.estadoGeneral)}>
              <CIcon icon={getEstadoIcon(beneficiario.estadoGeneral)} className="me-1" />
              {beneficiario.estadoGeneral}
            </CBadge>
          </CCardHeader>
          
          <CCardBody>
            {/* Enfermedad Principal */}
            {enfermedadPrincipal && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="text-primary">Enfermedad Principal</strong>
                  <CBadge color={enfermedadPrincipal.prioridad >= 8 ? 'danger' : 'warning'}>
                    Prioridad: {enfermedadPrincipal.prioridad}/10
                  </CBadge>
                </div>
                <p className="mb-1">
                  <CIcon icon={cilMedicalCross} className="me-2 text-danger" />
                  <strong>{enfermedadPrincipal.nombre}</strong>
                </p>
                <small className="text-muted d-block">
                  Estado: <CBadge color={enfermedadPrincipal.estado === 'CRÍTICO' ? 'danger' : 'warning'}>
                    {enfermedadPrincipal.estado}
                  </CBadge>
                </small>
                <small className="text-muted d-block">
                  Último control: {enfermedadPrincipal.ultimoControl}
                </small>
              </div>
            )}

            {/* Resumen */}
            <div className="row mb-3">
              <div className="col-6">
                <div className="text-center">
                  <div className="h4 mb-0 text-primary">{beneficiario.enfermedades.length}</div>
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
                <small className="fw-bold">{beneficiario.puntuacionRiesgo}%</small>
              </div>
              <CProgress 
                color={beneficiario.puntuacionRiesgo >= 80 ? 'danger' : 
                       beneficiario.puntuacionRiesgo >= 60 ? 'warning' : 'success'}
                value={beneficiario.puntuacionRiesgo}
                className="mb-2"
                style={{ height: '10px' }}
              />
            </div>

            {/* Alertas */}
            {beneficiario.alertas.length > 0 && (
              <div className="mb-3">
                <small className="fw-bold text-danger">
                  <CIcon icon={cilWarning} className="me-1" />
                  Alertas:
                </small>
                <ul className="list-unstyled mb-0 mt-1">
                  {beneficiario.alertas.map((alerta, index) => (
                    <li key={index} className="small text-danger">
                      • {alerta}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Próxima cita */}
            <div className="small text-muted mb-3">
              <div className="d-flex justify-content-between">
                <span><CIcon icon={cilCalendar} className="me-1" />Próxima cita:</span>
                <span className="fw-bold">{beneficiario.proximaCita}</span>
              </div>
            </div>

            {/* Botones */}
            <div className="d-flex gap-2">
              <CButton 
                color="primary" 
                size="sm" 
                className="flex-fill"
                onClick={() => setShowModal(true)}
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
                <CIcon icon={cilFile} className="me-1" />
                Generar Reporte
              </CButton>
            </div>
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Filtros */}
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              <CButton 
                color={activeTab === 'criticos' ? 'danger' : 'outline-danger'} 
                size="sm"
                onClick={() => setActiveTab('criticos')}
              >
                <CIcon icon={cilFire} className="me-1" />
                Críticos ({beneficiariosCriticos.length})
              </CButton>
              <CButton 
                color={activeTab === 'graves' ? 'warning' : 'outline-warning'} 
                size="sm"
                onClick={() => setActiveTab('graves')}
              >
                <CIcon icon={cilWarning} className="me-1" />
                Graves ({beneficiariosGraves.length})
              </CButton>
              <CButton 
                color={activeTab === 'estables' ? 'success' : 'outline-success'} 
                size="sm"
                onClick={() => setActiveTab('estables')}
              >
                <CIcon icon={cilInfo} className="me-1" />
                Estables ({beneficiariosEstables.length})
              </CButton>
              <CButton 
                color={activeTab === 'todos' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setActiveTab('todos')}
              >
                Todos ({beneficiarios.length})
              </CButton>
            </div>
          </div>

          {/* Contador de Beneficiarios */}
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

          {/* Grid de Tarjetas */}
          <CRow>
            {beneficiariosMostrar.map(beneficiario => (
              <TarjetaBeneficiario key={beneficiario.id} beneficiario={beneficiario} />
            ))}
          </CRow>
        </CCardBody>
      </CCard>

      {/* Modal de Detalles (solo visual) */}
      <CModal size="lg" visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilMedicalCross} className="me-2" />
            Historial Médico Completo
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTabs activeTab={modalTab} onActiveTabChange={setModalTab}>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="enfermedades">
                  <CIcon icon={cilMedicalCross} className="me-1" />
                  Enfermedades
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="vulnerabilidades">
                  <CIcon icon={cilWarning} className="me-1" />
                  Vulnerabilidades
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="medicamentos">
                  <CIcon icon={cilHeart} className="me-1" />
                  Medicamentos
                </CNavLink>
              </CNavItem>
            </CNav>
            
            <CTabContent>
              <CTabPane data-tab="enfermedades">
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Enfermedad</CTableHeaderCell>
                      <CTableHeaderCell>Fecha Diagnóstico</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Prioridad</CTableHeaderCell>
                      <CTableHeaderCell>Último Control</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Diabetes Tipo 2</CTableDataCell>
                      <CTableDataCell>2023-05-15</CTableDataCell>
                      <CTableDataCell><CBadge color="danger">CRÍTICO</CBadge></CTableDataCell>
                      <CTableDataCell><CBadge color="danger">10/10</CBadge></CTableDataCell>
                      <CTableDataCell>2024-01-15</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Hipertensión Arterial</CTableDataCell>
                      <CTableDataCell>2022-08-10</CTableDataCell>
                      <CTableDataCell><CBadge color="success">ESTABLE</CBadge></CTableDataCell>
                      <CTableDataCell><CBadge color="warning">5/10</CBadge></CTableDataCell>
                      <CTableDataCell>2023-12-20</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CTabPane>
              
              <CTabPane data-tab="vulnerabilidades">
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Vulnerabilidad</CTableHeaderCell>
                      <CTableHeaderCell>Puntos</CTableHeaderCell>
                      <CTableHeaderCell>Observaciones</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Adulto Mayor</CTableDataCell>
                      <CTableDataCell><CBadge color="warning">20 pts</CBadge></CTableDataCell>
                      <CTableDataCell>Mayor de 65 años</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Discapacidad Motora</CTableDataCell>
                      <CTableDataCell><CBadge color="warning">15 pts</CBadge></CTableDataCell>
                      <CTableDataCell>Requiere ayuda para desplazarse</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CTabPane>
              
              <CTabPane data-tab="medicamentos">
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Medicamento</CTableHeaderCell>
                      <CTableHeaderCell>Cantidad</CTableHeaderCell>
                      <CTableHeaderCell>Frecuencia</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Próxima Entrega</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Metformina 850mg</CTableDataCell>
                      <CTableDataCell>60 unidades</CTableDataCell>
                      <CTableDataCell>2 veces al día</CTableDataCell>
                      <CTableDataCell><CBadge color="success">ENTREGADO</CBadge></CTableDataCell>
                      <CTableDataCell>2024-02-15</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Losartán 50mg</CTableDataCell>
                      <CTableDataCell>30 unidades</CTableDataCell>
                      <CTableDataCell>1 vez al día</CTableDataCell>
                      <CTableDataCell><CBadge color="success">ENTREGADO</CBadge></CTableDataCell>
                      <CTableDataCell>2024-02-15</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilSave} className="me-1" />
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default BeneficiaryMedicalCards;