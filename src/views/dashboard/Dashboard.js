import React, { useState, useEffect } from 'react'
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
  CContainer,
  CSpinner
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
  cilBell
} from '@coreui/icons'

import { getDashboardStats, getMedicineInventory, getDonations } from '../../services/api'

import HelpButton from '../../components/common/HelpButton'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState({
    beneficiaries: 0,
    donations: 0,
    activeDeliveries: 0,
    expiringAlerts: 0
  })
  const [criticalMedications, setCriticalMedications] = useState([])
  const [recentDonations, setRecentDonations] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, inventoryRes, donationsRes] = await Promise.all([
          getDashboardStats(),
          getMedicineInventory(),
          getDonations()
        ])

        if (statsRes && statsRes.message && statsRes.message.stats) {
          const stats = statsRes.message.stats
          setStatsData({
            beneficiaries: stats.beneficiaries || 0,
            donations: stats.donations || 0,
            activeDeliveries: stats.activeDeliveries || 0,
            expiringAlerts: stats.expiringAlerts || 0
          })
        }

        if (inventoryRes && inventoryRes.message && inventoryRes.message.inventory) {
          // Filter to critical/low stock (e.g. available <= minimum)
          const critical = inventoryRes.message.inventory
            .filter(item => item.stock_status === 'Critical' || item.stock_status === 'Low' || item.available_quantity <= item.minimum_stock)
            .map(item => ({
              id: item.id,
              name: item.medicine,
              stock: item.available_quantity,
              minStock: item.minimum_stock,
              status: item.stock_status === 'Critical' || item.available_quantity === 0 ? 'crítico' : 'bajo'
            }))
            .slice(0, 5) // top 5
          setCriticalMedications(critical)
        }

        if (donationsRes && donationsRes.message && donationsRes.message.donations) {
          const recent = donationsRes.message.donations
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4)
            .map(d => ({
              id: d.id,
              donor: d.donor_name || 'Desconocido',
              type: d.donation_type || 'General',
              date: new Date(d.created_at).toLocaleDateString('es-ES'),
              status: d.status ? d.status.toLowerCase() : 'pendiente'
            }))
          setRecentDonations(recent)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
      label: 'Beneficiarios Activos',
      value: statsData.beneficiaries.toLocaleString(),
      icon: cilPeople,
      colorClass: 'teal',
      trend: '+2.5%',
      trendUp: true,
    },
    {
      label: 'Donaciones Totales',
      value: statsData.donations.toLocaleString(),
      icon: cilCash,
      colorClass: 'emerald',
      trend: '+5.2%',
      trendUp: true,
    },
    {
      label: 'Entregas Activas',
      value: statsData.activeDeliveries.toLocaleString(),
      icon: cilTruck,
      colorClass: 'amber',
      trend: '-1.1%',
      trendUp: false,
    },
    {
      label: 'Alertas de Vencimiento',
      value: statsData.expiringAlerts.toLocaleString(),
      icon: cilBell,
      colorClass: 'danger',
      trend: 'Crítico',
      trendUp: false,
    },
  ]

  if (loading) {
    return (
      <CContainer fluid className="p-3 p-md-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <CContainer fluid className="p-3 p-md-4">
      {/* Welcome Header */}
      <div className="mb-4 fp-animate-in d-flex justify-content-between align-items-start" style={{ padding: '0.25rem 0' }}>
        <div>
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
        <HelpButton title="Manual de Usuario – Panel Principal">
          <div>
            <p>Bienvenido al panel principal de FarmaPatria. Aquí verás un resumen del sistema.</p>
            <h6>Vista general</h6>
            <div className="card p-3 mb-3 bg-light">
              <div className="d-flex justify-content-between">
                <div className="card text-center border-primary p-2"><strong>(1) Beneficiarios</strong></div>
                <div className="card text-center border-success p-2"><strong>(2) Medicamentos</strong></div>
                <div className="card text-center border-warning p-2"><strong>(3) Donaciones</strong></div>
                <div className="card text-center border-danger p-2"><strong>(4) Alertas</strong></div>
              </div>
            </div>
            <ol>
              <li><strong>Tarjeta Beneficiarios:</strong> Número total de beneficiarios registrados en el sistema.</li>
              <li><strong>Tarjeta Medicamentos:</strong> Cantidad de medicamentos en el catálogo.</li>
              <li><strong>Tarjeta Donaciones:</strong> Donaciones activas o recibidas.</li>
              <li><strong>Tarjeta Alertas:</strong> Lotes con fecha de vencimiento próxima o ya vencidos.</li>
            </ol>
            <p className="text-muted"><em>Consejo: Si alguna cifra no aparece, verifica tu conexión o los permisos de usuario.</em></p>
          </div>
        </HelpButton>
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
                Nivel de Inventario (Muestra)
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
                Referencia visual de capacidad
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="h-100 fp-animate-in">
            <CCardHeader className="fp-card-header-accent">
              <h6 className="mb-0">
                <CIcon icon={cilCash} className="me-2" style={{ color: 'var(--fp-success)' }} />
                Completitud de Donaciones (Muestra)
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
                Porcentaje histórico estimado
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
                Medicamentos Críticos (Bajo Stock)
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
                  {criticalMedications.length > 0 ? (
                    criticalMedications.map((med) => (
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
                            {med.status.toUpperCase()}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center text-muted">
                        No hay medicamentos con stock crítico.
                      </CTableDataCell>
                    </CTableRow>
                  )}
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
                  {recentDonations.length > 0 ? (
                    recentDonations.map((donation) => (
                      <CTableRow key={donation.id}>
                        <CTableDataCell>
                          <strong style={{ color: 'var(--fp-text)' }}>{donation.donor}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{donation.type}</CTableDataCell>
                        <CTableDataCell style={{ color: 'var(--fp-text-muted)' }}>{donation.date}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={
                              donation.status === 'completed' || donation.status === 'completada' ? 'success'
                                : donation.status === 'pending' || donation.status === 'pendiente' ? 'warning'
                                : 'info'
                            }
                          >
                            {donation.status.toUpperCase()}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center text-muted">
                        No hay donaciones recientes.
                      </CTableDataCell>
                    </CTableRow>
                  )}
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
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.03)'
          }}>
            <CCardBody className="text-center py-4">
              <CIcon icon={cilChart} size="xxl" className="mb-3 text-primary" style={{ opacity: 0.9 }} />
              <h4 style={{ fontWeight: 800, marginBottom: '0.25rem', color: 'var(--fp-text, #333)' }}>Sistema FarmaPatria</h4>
              <p style={{ opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--fp-text-muted, #666)' }}>
                Plataforma para la gestión eficiente de donaciones farmacéuticas
              </p>
              <div className="d-flex justify-content-center gap-4 gap-md-5">
                <div className="text-center" style={{ padding: '0 1rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fp-primary, #198754)' }}>
                    {statsData.beneficiaries.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.75, color: 'var(--fp-text-secondary, #555)' }}>
                    Beneficiarios Atendidos
                  </div>
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