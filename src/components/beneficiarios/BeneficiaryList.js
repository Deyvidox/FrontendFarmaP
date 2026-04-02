import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilMedicalCross, cilSearch, cilPencil, cilTrash, cilClipboard } from '@coreui/icons';
import '../../css/beneficiarios/Beneficiaries.css';

const BeneficiaryList = ({ beneficiaries }) => {
  return (
    <CCard className="beneficiary-card">
      <CCardHeader>
        <h5 className="mb-0">
          <CIcon icon={cilUser} className="me-2" />
          Lista de Beneficiarios
        </h5>
        <div className="d-flex gap-2 mt-3">
          <CButton color="secondary" size="sm" className="beneficiary-action-btn-secondary">
            <CIcon icon={cilSearch} className="me-1" />
            Filtrar
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive className="beneficiary-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Cédula</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nombre Completo</CTableHeaderCell>
              <CTableHeaderCell scope="col">Comunidad</CTableHeaderCell>
              <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
              <CTableHeaderCell scope="col">Prioridad</CTableHeaderCell>
              <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
              <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {beneficiaries.map((beneficiary) => (
              <CTableRow key={beneficiary.id}>
                <CTableDataCell data-label="Cédula">
                  <strong>{beneficiary.BenCedula}</strong>
                </CTableDataCell>
                <CTableDataCell data-label="Nombre">
                  {beneficiary.BenNombres} {beneficiary.BenApellidos}
                  <div className="text-muted small">
                    Edad: {beneficiary.BenEdad} años
                  </div>
                </CTableDataCell>
                <CTableDataCell data-label="Comunidad">
                  {beneficiary.Comunidad}
                  <div className="text-muted small">
                    {beneficiary.ComMunicipio}
                  </div>
                </CTableDataCell>
                <CTableDataCell data-label="Teléfono">
                  {beneficiary.BenTelefonoPersonal}
                </CTableDataCell>
                <CTableDataCell data-label="Prioridad">
                  <CBadge color={getPriorityColor(beneficiary.BenNivelPrioridad)}>
                    {beneficiary.BenNivelPrioridad}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell data-label="Estado">
                  <span className={`beneficiary-status ${beneficiary.BenEstado.toLowerCase()}`}>
                    {beneficiary.BenEstado}
                  </span>
                </CTableDataCell>
                <CTableDataCell data-label="Acciones">
                  <div className="d-flex gap-1">
                    <CButton 
                      color="info" 
                      size="sm" 
                      className="beneficiary-action-btn-secondary"
                      title="Ver Datos Médicos"
                    >
                      <CIcon icon={cilMedicalCross} />
                    </CButton>
                    <CButton 
                      color="warning" 
                      size="sm" 
                      className="beneficiary-action-btn-secondary"
                      title="Editar"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton 
                      color="danger" 
                      size="sm" 
                      className="beneficiary-action-btn-secondary"
                      title="Eliminar"
                    >
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
  );
};

// Función para obtener color de prioridad
const getPriorityColor = (priority) => {
  switch(priority) {
    case 'ALTA': return 'danger';
    case 'MEDIA': return 'warning';
    case 'BAJA': return 'success';
    default: return 'secondary';
  }
};

export default BeneficiaryList;