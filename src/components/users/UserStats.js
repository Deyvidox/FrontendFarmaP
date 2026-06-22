import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CCardHeader,
  CSpinner,
  CAlert
} from '@coreui/react';
import { cilUser, cilUserFollow, cilUserUnfollow, cilChart } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUserStats } from 'src/services/api';
import '../../css/users/UserStats.css';

const UserStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserStats();
        setStats(response?.message?.stats || { total: 0, active: 0, inactive: 0, byRole: [] });
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalUsuarios = stats.total || 0;
  const usuariosActivos = stats.active || 0;
  const usuariosInactivos = stats.inactive || 0;
  
  const byRoleDict = {};
  if (stats.byRole) {
     stats.byRole.forEach(r => byRoleDict[r.role] = parseInt(r.count, 10));
  }
  
  // Nombres de roles predefinidos
  const administradores = byRoleDict['Administrator'] || byRoleDict['Administrador'] || byRoleDict['Admin'] || 0;
  const farmaceuticos = byRoleDict['Pharmacist'] || byRoleDict['Farmacéutico'] || byRoleDict['Farmaceutico'] || 0;
  const donantes = byRoleDict['Donor'] || byRoleDict['Donante'] || 0;
  const asistentes = byRoleDict['Assistant'] || byRoleDict['Asistente'] || 0;

  const porcentajeActivos = totalUsuarios > 0 ? (usuariosActivos / totalUsuarios) * 100 : 0;

  const tarjetasEstadisticas = [
    {
      titulo: 'Total Usuarios',
      valor: totalUsuarios,
      icono: cilUser,
      color: 'primary',
      descripcion: 'Usuarios registrados en el sistema'
    },
    {
      titulo: 'Usuarios Activos',
      valor: usuariosActivos,
      icono: cilUserFollow,
      color: 'success',
      porcentaje: porcentajeActivos,
      descripcion: 'Usuarios con acceso al sistema'
    },
    {
      titulo: 'Usuarios Inactivos',
      valor: usuariosInactivos,
      icono: cilUserUnfollow,
      color: 'warning',
      descripcion: 'Usuarios sin actividad reciente'
    },
    {
      titulo: 'Administradores',
      valor: administradores,
      icono: cilUser,
      color: 'danger',
      descripcion: 'Administradores del sistema'
    }
  ];

  return (
    <CCard className="users-card">
      <CCardHeader>
        <h5 className="mb-0">
          <CIcon icon={cilChart} className="me-2" />
          Panel de Usuarios
        </h5>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-3">Cargando estadísticas...</p>
          </div>
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : (
          <div className="user-stats-container">
          {/* Tarjetas de estadísticas */}
          <CRow className="user-stats-row">
            {tarjetasEstadisticas.map((estadistica, index) => (
              <CCol key={index} xs={12} sm={6} xl={3} className="mb-4">
                <CCard className="stats-card premium-card">
                  <CCardBody className="stats-card-body">
                    <div className="stats-card-header">
                      <div className={`stats-icon-container bg-${estadistica.color}`}>
                        <CIcon icon={estadistica.icono} className="stats-icon" />
                      </div>
                      <div className="stats-trend">
                        <span className="stats-percentage">+2.5%</span>
                      </div>
                    </div>
                    
                    <div className="stats-content">
                      <h3 className="stats-value">{estadistica.valor}</h3>
                      <p className="stats-label">{estadistica.titulo}</p>
                      <p className="stats-description">{estadistica.descripcion}</p>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>

          {/* Distribución por roles */}
          <CRow className="mt-4">
            <CCol xs={12}>
              <CCard>
                <CCardBody className="role-distribution">
                  <h5 className="mb-4 section-title">
                    <CIcon icon={cilChart} className="icon me-2" />
                    Distribución por Roles
                  </h5>
                  <CRow className="text-center">
                    <CCol md={3} className="role-stat-col">
                      <div className="role-stat">
                        <h4 className="text-primary mb-1">{administradores}</h4>
                        <small className="text-muted">Administradores</small>
                      </div>
                    </CCol>
                    <CCol md={3} className="role-stat-col">
                      <div className="role-stat">
                        <h4 className="text-warning mb-1">{farmaceuticos}</h4>
                        <small className="text-muted">Farmacéuticos</small>
                      </div>
                    </CCol>
                    <CCol md={3} className="role-stat-col">
                      <div className="role-stat">
                        <h4 className="text-info mb-1">{donantes}</h4>
                        <small className="text-muted">Donantes</small>
                      </div>
                    </CCol>
                    <CCol md={3} className="role-stat-col">
                      <div className="role-stat">
                        <h4 className="text-success mb-1">{asistentes}</h4>
                        <small className="text-muted">Asistentes</small>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default UserStats;