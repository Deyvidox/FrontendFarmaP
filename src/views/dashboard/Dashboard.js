import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CContainer
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilTruck,
  cilUser,
  cilChart,
  cilCash,
  cilHospital,
  cilWarning,
  cilCalendar
} from '@coreui/icons'

const Dashboard = () => {
  // Datos estáticos para el dashboard
  const statsData = {
    totalMedicines: 1245,
    activeDonors: 89,
    pendingDonations: 12,
    monthlyDistributed: 345
  }

  const criticalMedications = [
    { id: 1, name: 'Insulina Glargina', stock: 12, minStock: 50, status: 'crítico' },
    { id: 2, name: 'Amoxicilina 500mg', stock: 18, minStock: 100, status: 'bajo' },
    { id: 3, name: 'Paracetamol', stock: 245, minStock: 200, status: 'normal' },
    { id: 4, name: 'Losartán 50mg', stock: 22, minStock: 150, status: 'crítico' },
    { id: 5, name: 'Metformina 850mg', stock: 65, minStock: 120, status: 'normal' }
  ]

  const recentDonations = [
    { id: 1, donor: 'Laboratorio Pharma', type: 'Medicamentos', value: '$2,500', date: '15/03/2024', status: 'completada' },
    { id: 2, donor: 'Hospital Central', type: 'Equipos', value: '$1,800', date: '14/03/2024', status: 'pendiente' },
    { id: 3, donor: 'Fundación Salud', type: 'Medicamentos', value: '$3,200', date: '13/03/2024', status: 'completada' },
    { id: 4, donor: 'Farmacia', type: 'Insumos', value: '$950', date: '12/03/2024', status: 'procesando' }
  ]

  const inventoryPercentage = 62
  const donationCompletion = 78

  return (
    <CContainer fluid className="p-3">
      {/* Encabezado de bienvenida */}
      <div className="mb-4">
        <h2 className="mb-1">Bienvenido a FarmaPatria</h2>
        <p className="text-body-secondary">
          Sistema de gestión de donaciones farmacéuticas
        </p>
      </div>

      {/* Widgets de estadísticas */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-primary text-white rounded p-3">
                  <CIcon icon={cilUser} size="xl" />
                </div>
              </div>
              <div>
                <div className="fs-4 fw-bold">{statsData.totalMedicines.toLocaleString()}</div>
                <div className="text-body-secondary">Medicamentos en Inventario</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-success text-white rounded p-3">
                  <CIcon icon={cilUser} size="xl" />
                </div>
              </div>
              <div>
                <div className="fs-4 fw-bold">{statsData.activeDonors}</div>
                <div className="text-body-secondary">Donantes Activos</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-warning text-white rounded p-3">
                  <CIcon icon={cilTruck} size="xl" />
                </div>
              </div>
              <div>
                <div className="fs-4 fw-bold">{statsData.pendingDonations}</div>
                <div className="text-body-secondary">Donaciones Pendientes</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <CCard className="mb-3">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-info text-white rounded p-3">
                  <CIcon icon={cilHospital} size="xl" />
                </div>
              </div>
              <div>
                <div className="fs-4 fw-bold">{statsData.monthlyDistributed}</div>
                <div className="text-body-secondary">Distribuidos este mes</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Progresos */}
      <CRow className="mb-4">
        <CCol lg={6}>
          <CCard className="mb-3">
            <CCardHeader>
              <h6 className="mb-0">Nivel de Inventario</h6>
            </CCardHeader>
            <CCardBody>
              <div className="mb-2 d-flex justify-content-between">
                <span>Disponibilidad</span>
                <span className="fw-bold">{inventoryPercentage}%</span>
              </div>
              <CProgress color="primary" value={inventoryPercentage} className="mb-3" />
              <small className="text-body-secondary">
                {1245} de {2000} medicamentos disponibles
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="mb-3">
            <CCardHeader>
              <h6 className="mb-0">Completitud de Donaciones</h6>
            </CCardHeader>
            <CCardBody>
              <div className="mb-2 d-flex justify-content-between">
                <span>Procesadas</span>
                <span className="fw-bold">{donationCompletion}%</span>
              </div>
              <CProgress color="success" value={donationCompletion} className="mb-3" />
              <small className="text-body-secondary">
                32 de 41 donaciones procesadas este mes
              </small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Tablas principales */}
      <CRow>
        <CCol lg={6}>
          <CCard className="mb-3">
            <CCardHeader>
              <h6 className="mb-0">
                <CIcon icon={cilWarning} className="me-2" />
                Medicamentos Críticos
              </h6>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Medicamento</CTableHeaderCell>
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {criticalMedications.map((med) => (
                    <CTableRow key={med.id}>
                      <CTableDataCell>{med.name}</CTableDataCell>
                      <CTableDataCell>{med.stock} unidades</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            med.status === 'crítico'
                              ? 'danger'
                              : med.status === 'bajo'
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {med.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="mb-3">
            <CCardHeader>
              <h6 className="mb-0">
                <CIcon icon={cilCash} className="me-2" />
                Donaciones Recientes
              </h6>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Donante</CTableHeaderCell>
                    <CTableHeaderCell>Tipo</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentDonations.map((donation) => (
                    <CTableRow key={donation.id}>
                      <CTableDataCell>{donation.donor}</CTableDataCell>
                      <CTableDataCell>{donation.type}</CTableDataCell>
                      <CTableDataCell>{donation.date}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            donation.status === 'completada'
                              ? 'success'
                              : donation.status === 'pendiente'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {donation.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Información resumida */}
      <CRow>
        <CCol>
          <CCard>
            <CCardBody className="text-center py-5">
              <CIcon icon={cilChart} size="xxl" className="text-primary mb-3" />
              <h4>Sistema FarmaPatria</h4>
              <p className="text-body-secondary">
                Plataforma para la gestión eficiente de donaciones farmacéuticas
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <div className="text-center">
                  <div className="fw-bold">15</div>
                  <div className="text-body-secondary small">Hospitales beneficiados</div>
                </div>
                <div className="text-center">
                  <div className="fw-bold">2,340</div>
                  <div className="text-body-secondary small">Pacientes atendidos</div>
                </div>
                <div className="text-center">
                  <div className="fw-bold">89%</div>
                  <div className="text-body-secondary small">Eficiencia del sistema</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard