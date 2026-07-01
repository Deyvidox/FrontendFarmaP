import React, { useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge,
  CInputGroup, CFormInput, CInputGroupText, CPagination, CPaginationItem,
  CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormLabel, CFormSelect, CRow, CCol, CSpinner
} from '@coreui/react';
import { cilSearch, cilUser, cilPencil, cilTrash, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUserById, updateUser, deleteUser } from 'src/services/api';
import HelpButton from '../common/HelpButton';
import '../../css/users/UserList.css';

const UserList = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const CRITERIA_OPTIONS = [
    { value: 'nombre',  label: 'Nombre' },
    { value: 'cedula',  label: 'Cédula' },
    { value: 'email',   label: 'Email' },
    { value: 'rol',     label: 'Rol' },
  ];

  // Modal states
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Filter
  const filteredUsers = users.filter(user => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    switch (searchCriteria) {
      case 'cedula': return (user.identification_number || user.cedula || '').toLowerCase().includes(q);
      case 'email':  return (user.email || '').toLowerCase().includes(q);
      case 'rol':    return (user.role_name || '').toLowerCase().includes(q);
      case 'nombre':
      default:
        return `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(q);
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusBadge = (status) => {
    if (!status) return <CBadge color="secondary">Desconocido</CBadge>;
    const statusConfig = {
      'ACTIVE': { color: 'success', text: 'Activo' },
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
      'ADMINISTRADOR': 'danger', 'ADMIN': 'danger',
      'FARMACÉUTICO': 'warning', 'DONANTE': 'primary',
      'ASISTENTE': 'info', 'COORDINADOR': 'success'
    };
    return <CBadge color={roleConfig[rol.toUpperCase()] || 'secondary'}>{rol}</CBadge>;
  };

  // -- Ver --
  const handleViewClick = async (user) => {
    setModalLoading(true);
    setViewModal(true);
    try {
      const res = await getUserById(user.id);
      setSelectedUser(res?.message?.user || user);
    } catch (err) {
      setSelectedUser(user);
    } finally {
      setModalLoading(false);
    }
  };

  // -- Editar --
  const handleEditClick = async (user) => {
    setModalLoading(true);
    setEditModal(true);
    try {
      const res = await getUserById(user.id);
      const u = res?.message?.user || user;
      setSelectedUser(u);
      setEditForm({
        username: u.username || '',
        email: u.email || '',
        role_id: u.role_id || '',
        status: u.status || 'ACTIVE',
        department: u.department || '',
        position: u.position || '',
        phone: u.phone || ''
      });
    } catch (err) {
      setSelectedUser(user);
      setEditForm({
        username: user.username || '', email: user.email || '',
        role_id: user.role_id || '', status: user.status || 'ACTIVE',
        department: user.department || '', position: user.position || '',
        phone: user.phone || ''
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateUser(selectedUser.id, editForm);
      setEditModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Error actualizando usuario');
    } finally {
      setActionLoading(false);
    }
  };

  // -- Eliminar --
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteUser(selectedUser.id);
      setDeleteModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Error eliminando usuario');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <CCard className="users-card user-list-container">
        <CCardHeader className="users-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilUser} className="me-2" />
              Lista de Usuarios
              <HelpButton title="Manual de Usuario – Gestión de Usuarios">
                <div>
                  <p>Administra todas las cuentas del sistema.</p>
                  <h6>Lista de usuarios</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-2 fw-bold">(1) Cédula</div>
                      <div className="col-2 fw-bold">(2) Nombre</div>
                      <div className="col-2 fw-bold">(3) Email</div>
                      <div className="col-2 fw-bold">(4) Rol</div>
                      <div className="col-2 fw-bold">(5) Estado</div>
                      <div className="col-2 fw-bold">(6) Acciones</div>
                    </div>
                    <hr/>
                    <div className="row small text-muted">
                      <div className="col-2">V-12345678</div>
                      <div className="col-2">Juan Pérez</div>
                      <div className="col-2">juan@mail.com</div>
                      <div className="col-2"><span className="badge bg-warning text-dark">Coord.</span></div>
                      <div className="col-2"><span className="badge bg-success">Activo</span></div>
                      <div className="col-2">👁 ✏ 🗑</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Cédula/RIF:</strong> Identificación única.</li>
                    <li><strong>Nombre completo:</strong> Nombre y apellido.</li>
                    <li><strong>Email:</strong> Correo de acceso.</li>
                    <li><strong>Rol:</strong> Indica permisos (Admin, Coordinador, etc.).</li>
                    <li><strong>Estado:</strong> Activo (acceso), Inactivo (bloqueado).</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Ver (info):</strong> Ficha completa.</li>
                        <li><strong>Editar (lápiz):</strong> Modificar datos.</li>
                        <li><strong>Eliminar (basura):</strong> Cambia a Inactivo.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </HelpButton>
            </h5>
          </div>
        </CCardHeader>
        <CCardBody>
          <div className="user-search-container">
            <CRow>
              <CCol md={3} xs={12} className="mb-2 mb-md-0">
                <CFormSelect
                  value={searchCriteria}
                  onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); setCurrentPage(1); }}
                >
                  {CRITERIA_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={9} xs={12}>
                <CInputGroup>
                  <CInputGroupText className="user-search-icon">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    className="user-search-input"
                    placeholder={`Buscar por ${CRITERIA_OPTIONS.find(o=>o.value===searchCriteria)?.label || 'nombre'}...`}
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                  {searchTerm && (
                    <CButton color="secondary" variant="outline" onClick={() => { setSearchTerm(''); setCurrentPage(1); }}>&#x2715;</CButton>
                  )}
                </CInputGroup>
              </CCol>
            </CRow>
            {searchTerm && (
              <div className="text-muted small mt-2">
                {filteredUsers.length} resultado(s) de {users.length} total
              </div>
            )}
          </div>

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
                      <CTableDataCell><strong>{user.identification_number || 'N/A'}</strong></CTableDataCell>
                      <CTableDataCell><strong>{user.first_name} {user.last_name}</strong></CTableDataCell>
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
                          <CButton color="info" size="sm" className="user-action-btn" title="Ver"
                            onClick={() => handleViewClick(user)}>
                            <CIcon icon={cilInfo} />
                          </CButton>
                          <CButton color="primary" size="sm" className="user-action-btn user-action-btn-edit" title="Editar"
                            onClick={() => handleEditClick(user)}>
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton color="danger" size="sm" className="user-action-btn user-action-btn-delete" title="Eliminar"
                            onClick={() => handleDeleteClick(user)}>
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
                          {searchTerm ? 'No hay usuarios que coincidan con tu búsqueda' : 'No hay usuarios registrados en el sistema'}
                        </p>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {totalPages > 1 && (
            <div className="user-pagination">
              <CPagination align="center">
                <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem key={index + 1} active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}>{index + 1}</CPaginationItem>
                ))}
                <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</CPaginationItem>
              </CPagination>
            </div>
          )}
          <div className="user-pagination-info text-center mt-2">
            Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
            {searchTerm && ` (filtrados de ${users.length} total)`}
          </div>
        </CCardBody>
      </CCard>

      {/* Modal Ver */}
      <CModal size="lg" visible={viewModal} onClose={() => setViewModal(false)}>
        <CModalHeader>
          <CModalTitle><CIcon icon={cilUser} className="me-2" />Detalles del Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /></div>
          ) : selectedUser ? (
            <CRow>
              <CCol md={6}>
                <p><strong>Nombre:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                <p><strong>Cédula/RIF:</strong> {selectedUser.identification_number || '—'}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Username:</strong> {selectedUser.username || '—'}</p>
                <p><strong>Teléfono:</strong> {selectedUser.phone || '—'}</p>
              </CCol>
              <CCol md={6}>
                <p><strong>Rol:</strong> {getRoleBadge(selectedUser.role_name)}</p>
                <p><strong>Estado:</strong> {getStatusBadge(selectedUser.status)}</p>
                <p><strong>Departamento:</strong> {selectedUser.department || '—'}</p>
                <p><strong>Cargo:</strong> {selectedUser.position || '—'}</p>
                <p><strong>Creado:</strong> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('es-ES') : '—'}</p>
              </CCol>
            </CRow>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar */}
      <CModal size="lg" visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader>
          <CModalTitle><CIcon icon={cilPencil} className="me-2" />Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /></div>
          ) : (
            <CForm id="edit-user-form" onSubmit={submitEdit}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Username</CFormLabel>
                    <CFormInput name="username" value={editForm.username || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Teléfono</CFormLabel>
                    <CFormInput name="phone" value={editForm.phone || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Estado</CFormLabel>
                    <CFormSelect name="status" value={editForm.status || 'ACTIVE'} onChange={handleEditChange}>
                      <option value="ACTIVE">Activo</option>
                      <option value="INACTIVE">Inactivo</option>
                      <option value="SUSPENDED">Suspendido</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Departamento</CFormLabel>
                    <CFormInput name="department" value={editForm.department || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Cargo</CFormLabel>
                    <CFormInput name="position" value={editForm.position || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
              </CRow>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
          <CButton color="primary" type="submit" form="edit-user-form" disabled={actionLoading || modalLoading}>
            {actionLoading ? <><CSpinner size="sm" className="me-1" />Guardando...</> : 'Guardar Cambios'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Eliminar */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle><CIcon icon={cilTrash} className="me-2" />Eliminar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <p>¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>? Esta acción cambiará su estado a <strong>Inactivo</strong>.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? <><CSpinner size="sm" className="me-1" />Eliminando...</> : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default UserList;