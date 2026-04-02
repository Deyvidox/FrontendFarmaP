import React from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CCardHeader
} from '@coreui/react';
import { cilUser, cilUserFollow, cilUserUnfollow, cilChart } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserStats.css';

const UserStats = () => {
  // DATOS QUEMADOS ACTUALIZADOS según DB
  const usuariosQuemados = [
    {
      id: 1,
      UsuCedula: 'V-12345678',
      UsuNombres: 'María',
      UsuApellidos: 'García',
      UsuCorreo: 'maria@donaciones.com',
      RolNombre: 'Administrador',
      UsuDepartamento: 'Gerencia',
      UsuCargo: 'Directora General',
      UsuEstado: 'ACTIVO',
      UsuCreado: '2024-01-15'
    },
    {
      id: 2,
      UsuCedula: 'V-23456789',
      UsuNombres: 'Carlos',
      UsuApellidos: 'Rodríguez',
      UsuCorreo: 'carlos@donaciones.com',
      RolNombre: 'Farmacéutico',
      UsuDepartamento: 'Farmacia',
      UsuCargo: 'Farmacéutico Titular',
      UsuEstado: 'ACTIVO',
      UsuCreado: '2024-01-20'
    },
    {
      id: 3,
      UsuCedula: 'V-34567890',
      UsuNombres: 'Ana',
      UsuApellidos: 'López',
      UsuCorreo: 'ana@donaciones.com',
      RolNombre: 'Asistente',
      UsuDepartamento: 'Administración',
      UsuCargo: 'Asistente Administrativo',
      UsuEstado: 'ACTIVO',
      UsuCreado: '2024-01-25'
    },
    {
      id: 4,
      UsuCedula: 'J-301234567',
      UsuNombres: 'Farmacias',
      UsuApellidos: 'Unidas C.A.',
      UsuCorreo: 'david@farmaciasunidas.com',
      RolNombre: 'Donante',
      UsuDepartamento: 'Externo',
      UsuCargo: 'Representante Legal',
      UsuEstado: 'ACTIVO',
      UsuCreado: '2024-02-01'
    },
    {
      id: 5,
      UsuCedula: 'V-56789012',
      UsuNombres: 'Laura',
      UsuApellidos: 'Martínez',
      UsuCorreo: 'laura@donaciones.com',
      RolNombre: 'Farmacéutico',
      UsuDepartamento: 'Farmacia',
      UsuCargo: 'Farmacéutico Adjunto',
      UsuEstado: 'INACTIVO',
      UsuCreado: '2024-02-05'
    }
  ];

  // Cálculos con los datos quemados - solo visual
  const totalUsuarios = usuariosQuemados.length;
  const usuariosActivos = usuariosQuemados.filter(user => user.UsuEstado === 'ACTIVO').length;
  const usuariosInactivos = usuariosQuemados.filter(user => user.UsuEstado === 'INACTIVO').length;
  
  const administradores = usuariosQuemados.filter(user => user.RolNombre === 'Administrador').length;
  const farmaceuticos = usuariosQuemados.filter(user => user.RolNombre === 'Farmacéutico').length;
  const donantes = usuariosQuemados.filter(user => user.RolNombre === 'Donante').length;
  const asistentes = usuariosQuemados.filter(user => user.RolNombre === 'Asistente').length;

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
      </CCardBody>
    </CCard>
  );
};

export default UserStats;