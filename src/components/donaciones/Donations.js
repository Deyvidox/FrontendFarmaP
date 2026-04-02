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
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilPrint,
  cilCalendar,
  cilUser,
  cilDollar,
  cilCheckCircle,
  cilWarning,
  cilDrop
} from '@coreui/icons';


const Donations = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Datos de donaciones
  const donations = [
    {
      id: 1,
      donacionId: 'DON-2024-001',
      donante: 'Laboratorio Pfizer C.A.',
      fechaRecepcion: '2024-01-15',
      tipoDonacion: 'Medicamentos',
      cantidadItems: 15,
      valorEstimado: 4500.00,
      estado: 'RECIBIDO',
      almacenDestino: 'Almacén Central',
      observaciones: 'Medicamentos para diabetes'
    },
    {
      id: 2,
      donacionId: 'DON-2024-002',
      donante: 'Farmacias SAAS',
      fechaRecepcion: '2024-01-20',
      tipoDonacion: 'Insumos Médicos',
      cantidadItems: 8,
      valorEstimado: 3200.50,
      estado: 'EN INSPECCIÓN',
      almacenDestino: 'Almacén Norte',
      observaciones: 'Jeringas y agujas estériles'
    },
    {
      id: 3,
      donacionId: 'DON-2024-003',
      donante: 'Distribuidora Médica Unida',
      fechaRecepcion: '2024-01-25',
      tipoDonacion: 'Medicamentos',
      cantidadItems: 25,
      valorEstimado: 7800.00,
      estado: 'PROCESADO',
      almacenDestino: 'Almacén Central',
      observaciones: 'Medicamentos varios'
    },
    {
      id: 4,
      donacionId: 'DON-2024-004',
      donante: 'Hospital Central',
      fechaRecepcion: '2024-02-01',
      tipoDonacion: 'Equipamiento',
      cantidadItems: 3,
      valorEstimado: 12500.00,
      estado: 'RECIBIDO',
      almacenDestino: 'Bodega Principal',
      observaciones: 'Monitores de signos vitales'
    },
    {
      id: 5,
      donacionId: 'DON-2024-005',
      donante: 'Fundación Ayuda Médica',
      fechaRecepcion: '2024-02-05',
      tipoDonacion: 'Medicamentos',
      cantidadItems: 18,
      valorEstimado: 5600.75,
      estado: 'EN INSPECCIÓN',
      almacenDestino: 'Almacén Sur',
      observaciones: 'Antibióticos y analgésicos'
    }
  ];

  // Donantes registrados
  const donors = [
    { id: 1, nombre: 'Laboratorio Pfizer C.A.', rif: 'J-301234567' },
    { id: 2, nombre: 'Farmacias SAAS', rif: 'J-302345678' },
    { id: 3, nombre: 'Distribuidora Médica Unida', rif: 'J-303456789' },
    { id: 4, nombre: 'Hospital Central', rif: 'J-304567890' },
    { id: 5, nombre: 'Fundación Ayuda Médica', rif: 'J-305678901' }
  ];

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'RECIBIDO': return 'success';
      case 'EN INSPECCIÓN': return 'warning';
      case 'PROCESADO': return 'info';
      case 'RECHAZADO': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilDrop} className="me-2" />
              Gestión de Donaciones
            </h5>
            <div className="d-flex gap-2">
              <CButton color="secondary">
                <CIcon icon={cilPrint} className="me-1" />
                Reporte
              </CButton>
            </div>
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Resumen */}
          <CRow className="mb-4">
            <CCol md={3}>
              <div className="card text-center border-primary">
                <div className="card-body">
                  <div className="h4 text-primary mb-0">5</div>
                  <small className="text-muted">Donaciones Totales</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-success">
                <div className="card-body">
                  <div className="h4 text-success mb-0">$23,600.25</div>
                  <small className="text-muted">Valor Total</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-warning">
                <div className="card-body">
                  <div className="h4 text-warning mb-0">2</div>
                  <small className="text-muted">En Inspección</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-info">
                <div className="card-body">
                  <div className="h4 text-info mb-0">69</div>
                  <small className="text-muted">Items Totales</small>
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Lista de Donaciones */}
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID Donación</CTableHeaderCell>
                <CTableHeaderCell>Donante</CTableHeaderCell>
                <CTableHeaderCell>Fecha Recepción</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Valor Estimado</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {donations.map(donation => (
                <CTableRow key={donation.id}>
                  <CTableDataCell>
                    <strong>{donation.donacionId}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{donation.donante}</div>
                    <small className="text-muted">{donation.almacenDestino}</small>
                  </CTableDataCell>
                  <CTableDataCell>{donation.fechaRecepcion}</CTableDataCell>
                  <CTableDataCell>{donation.tipoDonacion}</CTableDataCell>
                  <CTableDataCell>{donation.cantidadItems} items</CTableDataCell>
                  <CTableDataCell>
                    <strong>${donation.valorEstimado.toFixed(2)}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getEstadoColor(donation.estado)}>
                      {donation.estado}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CButton 
                        color="info" 
                        size="sm"
                        onClick={() => setShowDetailsModal(true)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="warning" size="sm">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm">
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Nueva Donación */}
      <CModal size="lg" visible={showDonationModal} onClose={() => setShowDonationModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilDrop} className="me-2" />
            Registrar Nueva Donación
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="donante">Donante</CFormLabel>
                  <CFormSelect id="donante" required>
                    <option value="">Seleccionar donante</option>
                    {donors.map(donor => (
                      <option key={donor.id} value={donor.id}>
                        {donor.nombre} - {donor.rif}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="fecha">Fecha de Recepción</CFormLabel>
                  <CFormInput type="date" id="fecha" required />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="tipo">Tipo de Donación</CFormLabel>
                  <CFormSelect id="tipo" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="MEDICAMENTOS">Medicamentos</option>
                    <option value="INSUMOS">Insumos Médicos</option>
                    <option value="EQUIPOS">Equipamiento</option>
                    <option value="DINERO">Dinero</option>
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="documento">N° Documento</CFormLabel>
                  <CFormInput type="text" id="documento" placeholder="Ej: FACT-001-2024" />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="valor">Valor Estimado (USD)</CFormLabel>
                  <CFormInput type="number" step="0.01" id="valor" placeholder="0.00" />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="almacen">Almacén Destino</CFormLabel>
                  <CFormSelect id="almacen" required>
                    <option value="">Seleccionar almacén</option>
                    <option value="CENTRAL">Almacén Central</option>
                    <option value="NORTE">Almacén Norte</option>
                    <option value="SUR">Almacén Sur</option>
                    <option value="BODEGA">Bodega Principal</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            <div className="mb-3">
              <CFormLabel htmlFor="observaciones">Observaciones</CFormLabel>
              <CFormTextarea id="observaciones" rows="3" />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDonationModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Registrar Donación
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Detalles Donación */}
      <CModal size="lg" visible={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <CModalHeader>
          <CModalTitle>Detalles de Donación - DON-2024-001</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-2">
                <strong>Donante:</strong> Laboratorio Pfizer C.A.
              </div>
              <div className="mb-2">
                <strong>RIF:</strong> J-301234567
              </div>
              <div className="mb-2">
                <strong>Fecha Recepción:</strong> 2024-01-15
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-2">
                <strong>Tipo:</strong> Medicamentos
              </div>
              <div className="mb-2">
                <strong>Valor Estimado:</strong> $4,500.00
              </div>
              <div className="mb-2">
                <strong>Estado:</strong> <CBadge color="success">RECIBIDO</CBadge>
              </div>
            </CCol>
          </CRow>

          <h6>Medicamentos Recibidos</h6>
          <CTable hover responsive small>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Medicamento</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Lote</CTableHeaderCell>
                <CTableHeaderCell>Vencimiento</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Metformina 850mg</CTableDataCell>
                <CTableDataCell>500 unidades</CTableDataCell>
                <CTableDataCell>LOT-12345</CTableDataCell>
                <CTableDataCell>2025-06-30</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Losartán 50mg</CTableDataCell>
                <CTableDataCell>300 unidades</CTableDataCell>
                <CTableDataCell>LOT-12346</CTableDataCell>
                <CTableDataCell>2025-08-15</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilPrint} className="me-1" />
            Imprimir Acta
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Donations;