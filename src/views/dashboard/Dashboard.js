import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
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
  cilMedicalCross,
  cilPeople,
  cilArrowTop,
  cilArrowBottom,
} from '@coreui/icons'

const Dashboard = () => {
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

  // Greeting based on time
  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const statCards = [
    {
      label: 'Medicamentos en Inventario',
      value: statsData.totalMedicines.toLocaleString(),
      icon: cilMedicalCross,
      colorClass: 'teal',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      label: 'Donantes Activos',
      value: statsData.activeDonors,
      icon: cilPeople,
      colorClass: 'emerald',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      label: 'Donaciones Pendientes',
      value: statsData.pendingDonations,
      icon: cilTruck,
      colorClass: 'amber',
      trend: '-3.1%',
      trendUp: false,
    },
    {
      label: 'Distribuidos este mes',
      value: statsData.monthlyDistributed,
      icon: cilHospital,
      colorClass: 'blue',
      trend: '+15.7%',
      trendUp: true,
    },
  ]

  return (
    <CContainer fluid className="p-3 p-md-4">
      {/* Welcome Header */}
      <div className="mb-4 fp-animate-in" style={{ padding: '0.25rem 0' }}>
        <h2 style={{ 
          fontWeight: 800, 
          fontSize: '1.6rem', 
          color: 'var(--fp-text)',
          marginBottom: '0.25rem',
          letterSpacing: '-0.02em'
        }}>
          {getGreeting()} 👋
        </h2>
        <p style={{ color: 'var(--fp-text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Aquí tienes un resumen de tu sistema FarmaPatria
        </p>
      </div>

      {/* Stats Cards */}
      <CRow className="mb-4 g-3">
        {statCards.map((stat, i) => (
          <CCol xs={12} sm={6} xl={3} key={i}>
            <CCard 
              className={`fp-stat-card fp-animate-in-delay-${i + 1}`}
              style={{ border: 'none' }}
            >
              <CCardBody className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`fp-stat-icon ${stat.colorClass}`}>
                    <CIcon icon={stat.icon} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: stat.trendUp ? 'var(--fp-success)' : 'var(--fp-danger)',
                    background: stat.trendUp ? 'var(--fp-success-bg)' : 'var(--fp-danger-bg)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <CIcon icon={stat.trendUp ? cilArrowTop : cilArrowBottom} size="sm" />
                    {stat.trend}
                  </span>
                </div>
                <div className="fp-stat-value">{stat.value}</div>
                <p className="fp-stat-label">{stat.label}</p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Progress Section */}
      <CRow className="mb-4 g-3">
        <CCol lg={6}>
          <CCard className="h-100 fp-animate-in">
            <CCardHeader className="fp-card-header-accent">
              <h6 className="mb-0">
                <CIcon icon={cilChart} className="me-2" style={{ color: 'var(--fp-primary)' }} />
                Nivel de Inventario
              </h6>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: '0.875rem', color: 'var(--fp-text-secondary)' }}>Disponibilidad</span>
                <span style={{ fontWeight: 700, color: 'var(--fp-primary)', fontSize: '0.875rem' }}>{inventoryPercentage}%</span>
              </div>
              <CProgress 
                color="primary" 
                value={inventoryPercentage} 
                className="mb-3" 
                style={{ height: '10px' }}
              />
              <small style={{ color: 'var(--fp-text-muted)', fontSize: '0.82rem' }}>
                1,245 de 2,000 medicamentos disponibles
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="h-100 fp-animate-in">
            <CCardHeader className="fp-card-header-accent">
              <h6 className="mb-0">
                <CIcon icon={cilCash} className="me-2" style={{ color: 'var(--fp-success)' }} />
                Completitud de Donaciones
              </h6>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: '0.875rem', color: 'var(--fp-text-secondary)' }}>Procesadas</span>
                <span style={{ fontWeight: 700, color: 'var(--fp-success)', fontSize: '0.875rem' }}>{donationCompletion}%</span>
              </div>
              <CProgress 
                color="success" 
                value={donationCompletion} 
                className="mb-3" 
                style={{ height: '10px' }}
              />
              <small style={{ color: 'var(--fp-text-muted)', fontSize: '0.82rem' }}>
                32 de 41 donaciones procesadas este mes
              </small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Tables */}
      <CRow className="mb-4 g-3">
        <CCol lg={6}>
          <CCard className="h-100 fp-animate-in">
            <CCardHeader className="fp-card-header-accent">
              <h6 className="mb-0">
                <CIcon icon={cilWarning} className="me-2" style={{ color: 'var(--fp-danger)' }} />
                Medicamentos Críticos
              </h6>
            </CCardHeader>
            <CCardBody style={{ padding: '0 !important' }}>
              <CTable hover responsive className="mb-0">
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
                      <CTableDataCell>
                        <strong style={{ color: 'var(--fp-text)' }}>{med.name}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span style={{ fontWeight: 500 }}>{med.stock}</span>
                        <span style={{ color: 'var(--fp-text-muted)', fontSize: '0.8rem' }}> / {med.minStock}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            med.status === 'crítico' ? 'danger'
                              : med.status === 'bajo' ? 'warning'
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
          <CCard className="h-100 fp-animate-in">
            <CCardHeader className="fp-card-header-accent">
              <h6 className="mb-0">
                <CIcon icon={cilCash} className="me-2" style={{ color: 'var(--fp-primary)' }} />
                Donaciones Recientes
              </h6>
            </CCardHeader>
            <CCardBody style={{ padding: '0 !important' }}>
              <CTable hover responsive className="mb-0">
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
                      <CTableDataCell>
                        <strong style={{ color: 'var(--fp-text)' }}>{donation.donor}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{donation.type}</CTableDataCell>
                      <CTableDataCell style={{ color: 'var(--fp-text-muted)' }}>{donation.date}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={
                            donation.status === 'completada' ? 'success'
                              : donation.status === 'pendiente' ? 'warning'
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

      {/* Summary Footer */}
      <CRow>
        <CCol>
          <CCard className="fp-animate-in" style={{ 
            background: 'linear-gradient(135deg, var(--fp-primary) 0%, var(--fp-primary-dark) 100%)',
            border: 'none',
            color: 'white'
          }}>
            <CCardBody className="text-center py-4">
              <CIcon icon={cilChart} size="xxl" className="mb-3" style={{ opacity: 0.9 }} />
              <h4 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Sistema FarmaPatria</h4>
              <p style={{ opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Plataforma para la gestión eficiente de donaciones farmacéuticas
              </p>
              <div className="d-flex justify-content-center gap-4 gap-md-5">
                {[
                  { value: '15', label: 'Hospitales beneficiados' },
                  { value: '2,340', label: 'Pacientes atendidos' },
                  { value: '89%', label: 'Eficiencia del sistema' },
                ].map((item, i) => (
                  <div key={i} className="text-center" style={{ 
                    padding: '0 1rem',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.value}</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard