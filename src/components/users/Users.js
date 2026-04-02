import React from 'react';
import { CContainer, CRow, CCol } from '@coreui/react';
import UserList from "./UserList";
import '../../css/users/Users.css';

const Users = () => {
  // Datos quemados ACTUALIZADOS según tu DB
  const usuariosQuemados = [
    {
      id: 1,
      UsuCedula: 'V-12345678',
      UsuNombres: 'María',
      UsuApellidos: 'García',
      UsuCorreo: 'maria@donaciones.com',
      UsuTelefono: '+58 412 1234567',
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
      UsuTelefono: '+58 414 2345678',
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
      UsuTelefono: '+58 416 3456789',
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
      UsuTelefono: '+58 424 4567890',
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
      UsuTelefono: '+58 426 5678901',
      RolNombre: 'Farmacéutico',
      UsuDepartamento: 'Farmacia',
      UsuCargo: 'Farmacéutico Adjunto',
      UsuEstado: 'INACTIVO',
      UsuCreado: '2024-02-05'
    }
  ];

  return (
    <CContainer fluid className="users-container">
      {/* Lista de Usuarios */}
      <UserList users={usuariosQuemados} />
    </CContainer>
  );
};

export default Users;