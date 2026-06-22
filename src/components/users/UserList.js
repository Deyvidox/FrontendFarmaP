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
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CPagination,
  CPaginationItem,
  CButton
} from '@coreui/react';
import { cilSearch, cilUser, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/users/UserList.css';

const UserList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusBadge = (status) => {
    if (!status) return <CBadge color="secondary">Desconocido</CBadge>;
    const statusConfig = {
      'ACTIVE': { color: 'success', text: 'Activo' },
      'ACTIVE_ES': { color: 'success', text: 'Activo' }, // Para compatibilidad
      'INACTIVE': { color: 'secondary', text: 'Inactivo' },
      'SUSPENDED': { color: 'warning', text: 'Suspendido' }
    };
    
    const key = status.toUpperCase();
    const config = statusConfig[key] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getRoleBadge = (rol) => {
    if (!rol) return <CBadge color="secondary">Sin Rol</CBadge>;
    const roleConfig = {
      'ADMINISTRADOR': 'danger',
      'ADMIN': 'danger',
      'FARMACÉUTICO': 'warning',
      'DONANTE': 'primary',
      'ASISTENTE': 'info',
      'COORDINADOR': 'success'
    };
    
    return <CBadge color={roleConfig[rol.toUpperCase()] || 'secondary'}>{rol}</CBadge>;
  };

  const handleEditClick = () => {
    console.log('Botón Editar clickeado');
  };

  const handleDeleteClick = () => {
    console.log('Botón Eliminar clickeado');
  };

  return (
    <CCard className="users-card user-list-container">
      <CCardHeader className="users-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Lista de Usuarios
          </h5>
        </div>
      </CCardHeader>
      <CCardBody>
        {/* Barra de búsqueda */}
        <div className="user-search-container">
          <CInputGroup>
            <CInputGroupText className="user-search-icon">
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              className="user-search-input"
              placeholder="Buscar por nombre, email, rol o departamento..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </CInputGroup>
        </div>

        {/* Tabla de usuarios */}
        <div className="user-table-container">
          <CTable responsive striped hover className="user-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Cédula/RIF</CTableHeaderCell>
                <CTableHeaderCell>Nombre Completo</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Departamento</CTableHeaderCell>
                <CTableHeaderCell>Cargo</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Fecha de Creación</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>
                      <strong>{user.identification_number || 'N/A'}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{user.first_name} {user.last_name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{getRoleBadge(user.role_name)}</CTableDataCell>
                    <CTableDataCell>{user.department || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.position || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                    <CTableDataCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell>                      
                      <div className="user-actions-container">
                        <CButton
                          color="primary"
                          size="sm"
                          className="user-action-btn user-action-btn-edit"
                          onClick={handleEditClick}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="user-action-btn user-action-btn-delete"
                          onClick={handleDeleteClick}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center py-4">
                    <div className="users-empty-state">
                      <CIcon icon={cilUser} className="users-empty-state-icon" />
                      <h5>No se encontraron usuarios</h5>
                      <p className="text-muted">
                        {searchTerm 
                          ? 'No hay usuarios que coincidan con tu búsqueda' 
                          : 'No hay usuarios registrados en el sistema'
                        }
                      </p>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="user-pagination">
            <CPagination align="center">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </CPaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </CPaginationItem>
            </CPagination>
          </div>
        )}

        {/* Información de paginación */}
        <div className="user-pagination-info text-center mt-2">
          Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
          {searchTerm && ` (filtrados de ${users.length} total)`}
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UserList;