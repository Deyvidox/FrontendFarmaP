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
  CFormTextarea,
  CFormCheck,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilTruck,
  cilPlus,
  cilCalendar,
  cilUser,
  cilCheckCircle,
  cilClipboard,
  cilPeople,
  cilLocationPin,
  cilBell,
  cilSave,
  cilSearch
} from '@coreui/icons';


const Deliveries = () => {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showSelectMedModal, setShowSelectMedModal] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);

  // Medicamentos disponibles
  const medicines = [
    { id: 1, nombre: 'Metformina 850mg', stock: 450, categoria: 'Diabetes' },
    { id: 2, nombre: 'Losartán 50mg', stock: 280, categoria: 'Hipertensión' },
    { id: 3, nombre: 'Atorvastatina 20mg', stock: 320, categoria: 'Colesterol' },
    { id: 4, nombre: 'Glimepirida 4mg', stock: 180, categoria: 'Diabetes' },
    { id: 5, nombre: 'Amlodipino 10mg', stock: 210, categoria: 'Hipertensión' },
    { id: 6, nombre: 'Omeprazol 20mg', stock: 350, categoria: 'Gástrico' }
  ];

  // Beneficiarios que necesitan medicamentos
  const beneficiaries = [
    { id: 1, nombre: 'María González', cedula: 'V-12345678', medicamentos: [1, 2], comunidad: 'Los Olivos' },
    { id: 2, nombre: 'Carlos Rodríguez', cedula: 'V-23456789', medicamentos: [1], comunidad: 'El Valle' },
    { id: 3, nombre: 'Ana Martínez', cedula: 'V-34567890', medicamentos: [2, 3], comunidad: 'Petare' },
    { id: 4, nombre: 'Pedro Sánchez', cedula: 'V-45678901', medicamentos: [4], comunidad: 'La Vega' },
    { id: 5, nombre: 'Luisa Hernández', cedula: 'V-56789012', medicamentos: [1, 2, 3], comunidad: 'Catia' }
  ];

  // Entregas programadas
  const deliveries = [
    {
      id: 1,
      entregaId: 'ENT-2024-001',
      fechaEntrega: '2024-02-15',
      hora: '09:00 AM',
      lugar: 'Centro Comunitario Los Olivos',
      medicamento: 'Metformina 850mg',
      beneficiarios: 25,
      cantidad: 500,
      estado: 'PROGRAMADA',
      responsable: 'Lic. Juan Pérez'
    },
    {
      id: 2,
      entregaId: 'ENT-2024-002',
      fechaEntrega: '2024-02-18',
      hora: '10:30 AM',
      lugar: 'Hospital del Este',
      medicamento: 'Losartán 50mg',
      beneficiarios: 18,
      cantidad: 300,
      estado: 'EN PROCESO',
      responsable: 'Dra. Ana López'
    },
    {
      id: 3,
      entregaId: 'ENT-2024-003',
      fechaEntrega: '2024-02-10',
      hora: '02:00 PM',
      lugar: 'Centro de Salud Sur',
      medicamento: 'Atorvastatina 20mg',
      beneficiarios: 32,
      cantidad: 400,
      estado: 'COMPLETADA',
      responsable: 'Dr. Carlos Mendoza'
    },
    {
      id: 4,
      entregaId: 'ENT-2024-004',
      fechaEntrega: '2024-02-20',
      hora: '08:00 AM',
      lugar: 'Parroquia San José',
      medicamento: 'Glimepirida 4mg',
      beneficiarios: 15,
      cantidad: 180,
      estado: 'PROGRAMADA',
      responsable: 'Hna. Carmen Pérez'
    }
  ];

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'PROGRAMADA': return 'info';
      case 'EN PROCESO': return 'warning';
      case 'COMPLETADA': return 'success';
      case 'CANCELADA': return 'danger';
      default: return 'secondary';
    }
  };

  const handleSelectMedicine = (medicineId) => {
    setSelectedMedicines(prev => {
      if (prev.includes(medicineId)) {
        return prev.filter(id => id !== medicineId);
      } else {
        return [...prev, medicineId];
      }
    });
  };

  const getBeneficiariesForMedicine = (medicineId) => {
    return beneficiaries.filter(b => b.medicamentos.includes(medicineId));
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilTruck} className="me-2" />
              Programación de Entregas
            </h5>
            <div className="d-flex gap-2">
              <CButton color="secondary">
                <CIcon icon={cilCalendar} className="me-1" />
                Calendario
              </CButton>
            </div>
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Estadísticas */}
          <CRow className="mb-4">
            <CCol md={3}>
              <div className="card text-center border-info">
                <div className="card-body">
                  <div className="h4 text-info mb-0">2</div>
                  <small className="text-muted">Programadas</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-warning">
                <div className="card-body">
                  <div className="h4 text-warning mb-0">1</div>
                  <small className="text-muted">En Proceso</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-success">
                <div className="card-body">
                  <div className="h4 text-success mb-0">1</div>
                  <small className="text-muted">Completadas</small>
                </div>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="card text-center border-primary">
                <div className="card-body">
                  <div className="h4 text-primary mb-0">90</div>
                  <small className="text-muted">Beneficiarios</small>
                </div>
              </div>
            </CCol>
          </CRow>

          {/* Lista de Entregas */}
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID Entrega</CTableHeaderCell>
                <CTableHeaderCell>Fecha y Hora</CTableHeaderCell>
                <CTableHeaderCell>Lugar</CTableHeaderCell>
                <CTableHeaderCell>Medicamento</CTableHeaderCell>
                <CTableHeaderCell>Beneficiarios</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Responsable</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {deliveries.map(delivery => (
                <CTableRow key={delivery.id}>
                  <CTableDataCell>
                    <strong>{delivery.entregaId}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{delivery.fechaEntrega}</div>
                    <small className="text-muted">{delivery.hora}</small>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilLocationPin} className="me-1" />
                    {delivery.lugar}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilUser} className="me-1" />
                    {delivery.medicamento}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilPeople} className="me-1" />
                    {delivery.beneficiarios} personas
                  </CTableDataCell>
                  <CTableDataCell>{delivery.cantidad} unidades</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getEstadoColor(delivery.estado)}>
                      {delivery.estado}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <small>{delivery.responsable}</small>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CButton color="info" size="sm">
                        <CIcon icon={cilClipboard} />
                      </CButton>
                      <CButton color="warning" size="sm">
                        <CIcon icon={cilBell} />
                      </CButton>

                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Nueva Entrega */}
      <CModal size="xl" visible={showDeliveryModal} onClose={() => setShowDeliveryModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilTruck} className="me-2" />
            Programar Nueva Entrega
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* Paso 1: Seleccionar Medicamentos */}
            <div className="mb-4">
              <h6 className="mb-3">
                <CIcon icon={cilUser} className="me-2" />
                1. Seleccionar Medicamentos
              </h6>
              <CButton color="primary" onClick={() => setShowSelectMedModal(true)}>
                <CIcon icon={cilSearch} className="me-1" />
                Seleccionar Medicamentos
              </CButton>
              
              {selectedMedicines.length > 0 && (
                <div className="mt-3">
                  <h6>Medicamentos seleccionados:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedMedicines.map(medId => {
                      const med = medicines.find(m => m.id === medId);
                      return med ? (
                        <CBadge key={med.id} color="info" className="p-2">
                          <CIcon icon={cilUser} className="me-1" />
                          {med.nombre}
                        </CBadge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Paso 2: Beneficiarios afectados */}
            {selectedMedicines.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-3">
                  <CIcon icon={cilPeople} className="me-2" />
                  2. Beneficiarios que recibirán notificación
                </h6>
                <div className="alert alert-info">
                  <strong>
                    {selectedMedicines.flatMap(medId => 
                      getBeneficiariesForMedicine(medId)
                    ).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).length} 
                    beneficiarios serán notificados
                  </strong>
                  <div className="mt-2">
                    <small>El sistema notificará automáticamente a todos los beneficiarios que necesitan estos medicamentos.</small>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Detalles de la entrega */}
            <div className="mb-4">
              <h6 className="mb-3">
                <CIcon icon={cilCalendar} className="me-2" />
                3. Configurar Entrega
              </h6>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="fechaEntrega">Fecha de Entrega</CFormLabel>
                    <CFormInput type="date" id="fechaEntrega" required />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="horaEntrega">Hora</CFormLabel>
                    <CFormInput type="time" id="horaEntrega" required />
                  </div>
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel htmlFor="lugarEntrega">Lugar de Entrega</CFormLabel>
                <CFormSelect id="lugarEntrega" required>
                  <option value="">Seleccionar lugar</option>
                  <option value="CENTRO_COMUNITARIO">Centro Comunitario</option>
                  <option value="HOSPITAL">Hospital</option>
                  <option value="CENTRO_SALUD">Centro de Salud</option>
                  <option value="PARROQUIA">Parroquia</option>
                  <option value="OTRO">Otro</option>
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="direccion">Dirección Específica</CFormLabel>
                <CFormTextarea id="direccion" rows="2" placeholder="Calle, número, referencia..." />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="responsable">Responsable de Entrega</CFormLabel>
                <CFormInput type="text" id="responsable" placeholder="Nombre del responsable" required />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="observaciones">Observaciones</CFormLabel>
                <CFormTextarea id="observaciones" rows="3" placeholder="Instrucciones especiales..." />
              </div>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeliveryModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilSave} className="me-1" />
            Programar Entrega
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Seleccionar Medicamentos */}
      <CModal size="lg" visible={showSelectMedModal} onClose={() => setShowSelectMedModal(false)}>
        <CModalHeader>
          <CModalTitle>Seleccionar Medicamentos</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput placeholder="Buscar medicamento..." />
            </CInputGroup>
          </div>

          <div className="table-responsive">
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Seleccionar</CTableHeaderCell>
                  <CTableHeaderCell>Medicamento</CTableHeaderCell>
                  <CTableHeaderCell>Categoría</CTableHeaderCell>
                  <CTableHeaderCell>Stock Disponible</CTableHeaderCell>
                  <CTableHeaderCell>Beneficiarios</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {medicines.map(medicine => (
                  <CTableRow key={medicine.id}>
                    <CTableDataCell>
                      <CFormCheck
                        checked={selectedMedicines.includes(medicine.id)}
                        onChange={() => handleSelectMedicine(medicine.id)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{medicine.nombre}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="info">{medicine.categoria}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className={medicine.stock < 100 ? 'text-danger' : 'text-success'}>
                        {medicine.stock} unidades
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="badge bg-secondary">
                        {getBeneficiariesForMedicine(medicine.id).length} personas
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSelectMedModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={() => setShowSelectMedModal(false)}>
            <CIcon icon={cilCheckCircle} className="me-1" />
            Confirmar Selección ({selectedMedicines.length})
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Deliveries;