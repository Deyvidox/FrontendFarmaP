import React, { useState, useEffect } from 'react';
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
  cilPrint,
  cilEnvelopeClosed,
  cilWarning,
  cilCheckCircle,
  cilClock,
  cilUser
} from '@coreui/icons';
import { getProviderRequests } from '../../services/api';

const Requests = () => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
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
    fetchRequests();
  }, []);

  const getEstadoColor = (estado) => {
    switch(estado) {
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
    switch(prioridad) {
      case 'CRITICA':
      case 'URGENTE': 
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getShortId = (id) => {
    if (!id) return '';
    return `SOL-${id.split('-')[0].toUpperCase()}`;
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilClipboard} className="me-2" />
              Solicitudes de Medicamentos a Proveedores
            </h5>
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Filtros Rápidos */}
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              <CButton color="outline-warning" size="sm">
                <CIcon icon={cilClock} className="me-1" />
                Pendientes ({requests.filter(r => r.status === 'PENDIENTE').length})
              </CButton>
              <CButton color="outline-info" size="sm">
                <CIcon icon={cilWarning} className="me-1" />
                En Proceso ({requests.filter(r => ['ENVIADA', 'EN_REVISION', 'APROBADA_INTERNA'].includes(r.status)).length})
              </CButton>
              <CButton color="outline-success" size="sm">
                <CIcon icon={cilCheckCircle} className="me-1" />
                Aprobadas/Completadas ({requests.filter(r => ['APROBADA', 'COMPLETADA'].includes(r.status)).length})
              </CButton>
              <CButton color="outline-danger" size="sm">
                <CIcon icon={cilWarning} className="me-1" />
                Rechazadas ({requests.filter(r => r.status === 'RECHAZADA').length})
              </CButton>
            </div>
          </div>

          {/* Lista de Solicitudes */}
          {loading ? (
            <div className="text-center my-5">Cargando solicitudes...</div>
          ) : (
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
                {requests.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">No hay solicitudes registradas</CTableDataCell>
                  </CTableRow>
                ) : (
                  requests.map(request => (
                    <CTableRow key={request.id}>
                      <CTableDataCell>
                        <strong>{getShortId(request.id)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{request.provider_name}</div>
                        <small className="text-muted">{request.department || 'Sin Dpto'} - {request.responsible_name}</small>
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(request.request_date)}</CTableDataCell>
                      <CTableDataCell>{request.request_type}</CTableDataCell>
                      <CTableDataCell>
                        {request.total_medicines} ({request.total_units} unds)
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getPrioridadColor(request.general_priority)}>
                          {request.general_priority}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getEstadoColor(request.status)}>
                          {request.status}
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
                  ))
                )}
              </CTableBody>
            </CTable>
          )}
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
                <h5>Sistema de Gestión de Donaciones e Inventario</h5>
                <h6 className="text-muted">SOLICITUD OFICIAL A PROVEEDOR</h6>
              </div>

              {/* Información de la solicitud */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="mb-2">
                    <strong>N° Solicitud:</strong> {getShortId(selectedRequest.id)}
                  </div>
                  <div className="mb-2">
                    <strong>Fecha:</strong> {formatDate(selectedRequest.request_date)}
                  </div>
                  <div className="mb-2">
                    <strong>Proveedor:</strong> {selectedRequest.provider_name}
                  </div>
                  <div className="mb-2">
                    <strong>RIF:</strong> {selectedRequest.provider_rif}
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-2">
                    <strong>Prioridad:</strong> <CBadge color={getPrioridadColor(selectedRequest.general_priority)}>
                      {selectedRequest.general_priority}
                    </CBadge>
                  </div>
                  <div className="mb-2">
                    <strong>Departamento:</strong> {selectedRequest.department}
                  </div>
                  <div className="mb-2">
                    <strong>Responsable:</strong> {selectedRequest.responsible_name}
                  </div>
                  <div className="mb-2">
                    <strong>Tipo:</strong> {selectedRequest.request_type}
                  </div>
                </CCol>
              </CRow>

              <div className="mb-4 mt-3">
                <strong>Justificación General: </strong> 
                {selectedRequest.general_justification || 'Sin justificación provista'}
              </div>

              {/* Tabla de medicamentos solicitados */}
              <h6 className="mt-4 mb-3">Resumen de Cantidades Solicitadas</h6>
              <CTable bordered hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Tipos de Medicamentos</CTableHeaderCell>
                    <CTableHeaderCell>Unidades Totales</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>{selectedRequest.total_medicines}</CTableDataCell>
                    <CTableDataCell>{selectedRequest.total_units} unidades</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <div className="alert alert-secondary mt-3">
                <small>
                  Para ver el detalle completo de los medicamentos, consulte la solicitud detallada en el sistema.
                </small>
              </div>

              {/* Firmas y autorizaciones */}
              <div className="mt-5 pt-4">
                <CRow>
                  <CCol md={6} className="text-center">
                    <div className="border-top pt-3">
                      <strong>________________________________</strong>
                      <div className="mt-2">Responsable Solicitante</div>
                      <small className="text-muted">{selectedRequest.responsible_name}</small>
                    </div>
                  </CCol>
                  <CCol md={6} className="text-center">
                    <div className="border-top pt-3">
                      <strong>________________________________</strong>
                      <div className="mt-2">Autorizado por</div>
                      <small className="text-muted">FarmaPatria - Departamento de Logística</small>
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