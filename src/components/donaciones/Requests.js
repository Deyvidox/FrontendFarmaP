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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilClipboard,
  cilPlus,
  cilPrint,
  cilEnvelopeClosed,
  cilCalendar,
  cilWarning,
  cilCheckCircle,
  cilClock,
  cilUser
} from '@coreui/icons';


const Requests = () => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Datos de solicitudes
  const requests = [
    {
      id: 1,
      solicitudId: 'SOL-2024-001',
      solicitante: 'Hospital General del Este',
      fechaSolicitud: '2024-01-10',
      tipo: 'Medicamentos Crónicos',
      cantidadMedicamentos: 12,
      prioridad: 'ALTA',
      estado: 'PENDIENTE',
      contacto: 'Dr. Carlos Mendoza',
      telefono: '0412-555-7890'
    },
    {
      id: 2,
      solicitudId: 'SOL-2024-002',
      solicitante: 'Centro de Salud Comunitario',
      fechaSolicitud: '2024-01-12',
      tipo: 'Antibióticos',
      cantidadMedicamentos: 8,
      prioridad: 'MEDIA',
      estado: 'EN PROCESO',
      contacto: 'Lic. María Rodríguez',
      telefono: '0414-222-4567'
    },
    {
      id: 3,
      solicitudId: 'SOL-2024-003',
      solicitante: 'Asociación de Diabéticos',
      fechaSolicitud: '2024-01-15',
      tipo: 'Insulinas',
      cantidadMedicamentos: 5,
      prioridad: 'ALTA',
      estado: 'APROBADA',
      contacto: 'Ing. Pedro López',
      telefono: '0426-333-8910'
    },
    {
      id: 4,
      solicitudId: 'SOL-2024-004',
      solicitante: 'Clínica Materno Infantil',
      fechaSolicitud: '2024-01-18',
      tipo: 'Pediatría',
      cantidadMedicamentos: 15,
      prioridad: 'ALTA',
      estado: 'RECHAZADA',
      contacto: 'Dra. Ana García',
      telefono: '0416-444-1234'
    },
    {
      id: 5,
      solicitudId: 'SOL-2024-005',
      solicitante: 'Hogar de Ancianos San José',
      fechaSolicitud: '2024-01-20',
      tipo: 'Geriatría',
      cantidadMedicamentos: 10,
      prioridad: 'MEDIA',
      estado: 'COMPLETADA',
      contacto: 'Hna. Carmen Pérez',
      telefono: '0424-555-6789'
    }
  ];

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'warning';
      case 'EN PROCESO': return 'info';
      case 'APROBADA': return 'success';
      case 'RECHAZADA': return 'danger';
      case 'COMPLETADA': return 'primary';
      default: return 'secondary';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch(prioridad) {
      case 'ALTA': return 'danger';
      case 'MEDIA': return 'warning';
      case 'BAJA': return 'success';
      default: return 'secondary';
    }
  };

  const handlePrintRequest = (request) => {
    setSelectedRequest(request);
    setShowPrintModal(true);
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilClipboard} className="me-2" />
              Solicitudes de Medicamentos
            </h5>
{/*             <div className="d-flex gap-2">
              <CButton color="secondary">
                <CIcon icon={cilEnvelopeClosed} className="me-1" />
                Enviar Recordatorios
              </CButton>
            </div> */}
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Filtros Rápidos */}
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              <CButton color="outline-warning" size="sm">
                <CIcon icon={cilClock} className="me-1" />
                Pendientes (2)
              </CButton>
              <CButton color="outline-info" size="sm">
                <CIcon icon={cilWarning} className="me-1" />
                En Proceso (1)
              </CButton>
              <CButton color="outline-success" size="sm">
                <CIcon icon={cilCheckCircle} className="me-1" />
                Aprobadas (1)
              </CButton>
              <CButton color="outline-danger" size="sm">
                <CIcon icon={cilWarning} className="me-1" />
                Rechazadas (1)
              </CButton>
            </div>
          </div>

          {/* Lista de Solicitudes */}
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID Solicitud</CTableHeaderCell>
                <CTableHeaderCell>Solicitante</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Medicamentos</CTableHeaderCell>
                <CTableHeaderCell>Prioridad</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {requests.map(request => (
                <CTableRow key={request.id}>
                  <CTableDataCell>
                    <strong>{request.solicitudId}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{request.solicitante}</div>
                    <small className="text-muted">{request.contacto}</small>
                  </CTableDataCell>
                  <CTableDataCell>{request.fechaSolicitud}</CTableDataCell>
                  <CTableDataCell>{request.tipo}</CTableDataCell>
                  <CTableDataCell>{request.cantidadMedicamentos}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getPrioridadColor(request.prioridad)}>
                      {request.prioridad}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getEstadoColor(request.estado)}>
                      {request.estado}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CButton 
                        color="primary" 
                        size="sm"
                        onClick={() => handlePrintRequest(request)}
                      >
                        <CIcon icon={cilPrint} />
                      </CButton>
                      <CButton color="info" size="sm">
                        <CIcon icon={cilEnvelopeClosed} />
                      </CButton>
                      <CButton color="warning" size="sm">
                        <CIcon icon={cilUser} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para Imprimir Solicitud */}
      <CModal size="lg" visible={showPrintModal} onClose={() => setShowPrintModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilPrint} className="me-2" />
            Imprimir Solicitud
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRequest && (
            <div className="border p-4">
              {/* Encabezado del documento */}
              <div className="text-center mb-4">
                <h4 className="fw-bold">FARMAPATRIA</h4>
                <h5>Sistema de Gestión de Donaciones</h5>
                <h6 className="text-muted">SOLICITUD OFICIAL DE MEDICAMENTOS</h6>
              </div>

              {/* Información de la solicitud */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="mb-2">
                    <strong>N° Solicitud:</strong> {selectedRequest.solicitudId}
                  </div>
                  <div className="mb-2">
                    <strong>Fecha:</strong> {selectedRequest.fechaSolicitud}
                  </div>
                  <div className="mb-2">
                    <strong>Solicitante:</strong> {selectedRequest.solicitante}
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-2">
                    <strong>Prioridad:</strong> <CBadge color={getPrioridadColor(selectedRequest.prioridad)}>
                      {selectedRequest.prioridad}
                    </CBadge>
                  </div>
                  <div className="mb-2">
                    <strong>Contacto:</strong> {selectedRequest.contacto}
                  </div>
                  <div className="mb-2">
                    <strong>Teléfono:</strong> {selectedRequest.telefono}
                  </div>
                </CCol>
              </CRow>

              {/* Tabla de medicamentos solicitados */}
              <h6 className="mt-4 mb-3">Medicamentos Solicitados</h6>
              <CTable bordered hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Medicamento</CTableHeaderCell>
                    <CTableHeaderCell>Cantidad</CTableHeaderCell>
                    <CTableHeaderCell>Presentación</CTableHeaderCell>
                    <CTableHeaderCell>Observaciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>Metformina 850mg</CTableDataCell>
                    <CTableDataCell>500 unidades</CTableDataCell>
                    <CTableDataCell>Tabletas</CTableDataCell>
                    <CTableDataCell>Para pacientes diabéticos</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2</CTableDataCell>
                    <CTableDataCell>Losartán 50mg</CTableDataCell>
                    <CTableDataCell>300 unidades</CTableDataCell>
                    <CTableDataCell>Tabletas</CTableDataCell>
                    <CTableDataCell>Control de hipertensión</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>3</CTableDataCell>
                    <CTableDataCell>Amoxicilina 500mg</CTableDataCell>
                    <CTableDataCell>200 unidades</CTableDataCell>
                    <CTableDataCell>Cápsulas</CTableDataCell>
                    <CTableDataCell>Antibiótico de amplio espectro</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              {/* Firmas y autorizaciones */}
              <div className="mt-5 pt-4">
                <CRow>
                  <CCol md={6} className="text-center">
                    <div className="border-top pt-3">
                      <strong>________________________________</strong>
                      <div className="mt-2">Solicitante</div>
                      <small className="text-muted">{selectedRequest.contacto}</small>
                    </div>
                  </CCol>
                  <CCol md={6} className="text-center">
                    <div className="border-top pt-3">
                      <strong>________________________________</strong>
                      <div className="mt-2">Autorizado por</div>
                      <small className="text-muted">FarmaPatria - Departamento de Distribución</small>
                    </div>
                  </CCol>
                </CRow>
              </div>

              {/* Pie de documento */}
              <div className="mt-4 pt-3 border-top text-center">
                <small className="text-muted">
                  Documento generado automáticamente por el Sistema FarmaPatria
                </small>
                <div className="mt-1">
                  <small className="text-muted">
                    Fecha de impresión: {new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPrintModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={() => window.print()}>
            <CIcon icon={cilPrint} className="me-1" />
            Imprimir Documento
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Requests;