import React, { useState, useEffect } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge,
  CInputGroup, CFormInput, CInputGroupText, CPagination, CPaginationItem,
  CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormLabel, CFormSelect, CRow, CCol, CSpinner
} from '@coreui/react';
import { cilSearch, cilUser, cilPencil, cilTrash, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUserById, updateUser, deleteUser, getRoles } from 'src/services/api';
import HelpButton from '../common/HelpButton';
import ToastNotification from '../common/ToastNotification';
import '../../css/users/UserList.css';

const translateRole = (roleName) => {
  if (!roleName) return 'Sin Rol';
  switch (roleName) {
    case 'Administrator': return 'Administrador';
    case 'Warehouse Manager':
    case 'Pharmacist': return 'Farmacéutico';
    case 'Social Worker':
    case 'Assistant': return 'Asistente';
    case 'Donor': return 'Donante';
    case 'Coordinator': return 'Coordinador';
    default: return roleName;
  }
};

const UserList = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('nombre');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const usersPerPage = 5;

  const CRITERIA_OPTIONS = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'cedula', label: 'Cédula' },
    { value: 'email', label: 'Email' },
    { value: 'rol', label: 'Rol' },
  ];

  const [roles, setRoles] = useState([]);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type })
    setTimeout(() => setToast({ show: true, message, type }), 20)
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await getRoles();
        setRoles(res?.message?.roles || []);
      } catch (err) {
        console.error('Error cargando roles:', err);
      }
    };
    loadRoles();
  }, []);

  const filteredUsers = users.filter(user => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || (
      (searchCriteria === 'cedula' && (user.identification_number || '').toLowerCase().includes(q)) ||
      (searchCriteria === 'email' && (user.email || '').toLowerCase().includes(q)) ||
      (searchCriteria === 'rol' && (translateRole(user.role_name) || '').toLowerCase().includes(q)) ||
      (searchCriteria === 'nombre' && `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(q))
    );
    const matchesStatus = filterStatus === 'TODOS' ||
      (user.status || '').toUpperCase() === filterStatus;
    return matchesSearch && matchesStatus;
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

  const getRoleBadge = (roleName) => {
    const translated = translateRole(roleName);
    const colorMap = {
      'Administrador': 'danger',
      'Farmacéutico': 'warning',
      'Asistente': 'info',
      'Donante': 'primary',
      'Coordinador': 'success'
    };
    return <CBadge color={colorMap[translated] || 'secondary'}>{translated}</CBadge>;
  };

  const validateEditForm = () => {
    const errors = [];
    if (!editForm.first_name || editForm.first_name.trim().length < 2) errors.push('El nombre es obligatorio (mín. 2 caracteres)');
    if (!editForm.last_name || editForm.last_name.trim().length < 2) errors.push('El apellido es obligatorio (mín. 2 caracteres)');
    if (!editForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) errors.push('Email inválido');
    if (!editForm.role_id) errors.push('Seleccione un rol');
    if (editForm.identification_number && !/^[VEJ]-\d{6,8}$/.test(editForm.identification_number)) {
      errors.push('Cédula/RIF inválida (formato: V-12345678)');
    }
    if (editForm.phone && !/^\+58\s?\d{3}\s?\d{7}$/.test(editForm.phone)) {
      errors.push('Teléfono inválido (formato: +58 412 1234567)');
    }
    return errors;
  };

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

  const handleEditClick = async (user) => {
    setModalLoading(true);
    setEditModal(true);
    try {
      const res = await getUserById(user.id);
      const u = res?.message?.user || user;
      setSelectedUser(u);
      setEditForm({
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        identification_number: u.identification_number || '',
        email: u.email || '',
        phone: u.phone || '',
        role_id: u.role_id || '',
        status: u.status || 'Active',
        department: u.department || '',
        position: u.position || '',
      });
    } catch (err) {
      setSelectedUser(user);
      setEditForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        identification_number: user.identification_number || '',
        email: user.email || '',
        phone: user.phone || '',
        role_id: user.role_id || '',
        status: user.status || 'Active',
        department: user.department || '',
        position: user.position || '',
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
    const errors = validateEditForm();
    if (errors.length > 0) {
      showToast(errors[0], 'danger');
      return;
    }
    setActionLoading(true);
    try {
      await updateUser(selectedUser.id, editForm);
      setEditModal(false);
      if (onRefresh) onRefresh();
      showToast('Usuario actualizado exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error actualizando usuario', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

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
      showToast('Usuario eliminado exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error eliminando usuario', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
      <CCard className="users-card user-list-container">
        <CCardHeader className="users-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <CIcon icon={cilUser} className="me-2" />
              Lista de Usuarios
              <HelpButton title="Manual de Usuario – Lista de Usuarios">
                <div>
                  <p>Administra todas las cuentas del sistema.</p>
                  <h6>Lista de usuarios</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-2 fw-bold">(1) Cédula</div>
                      <div className="col-2 fw-bold">(2) Nombre</div>
                      <div className="col-2 fw-bold">(3) Email</div>
                      <div className="col-1 fw-bold">(4) Rol</div>
                      <div className="col-1 fw-bold">(5) Depto.</div>
                      <div className="col-1 fw-bold">(6) Cargo</div>
                      <div className="col-1 fw-bold">(7) Estado</div>
                      <div className="col-2 fw-bold">(8) Acciones</div>
                    </div>
                    <hr />
                    <div className="row small text-muted">
                      <div className="col-2">V-29129307</div>
                      <div className="col-2">Pedro Porro</div>
                      <div className="col-2">pedro@gmail.com</div>
                      <div className="col-1"><span className="badge bg-warning text-dark">Admin</span></div>
                      <div className="col-1">N/A</div>
                      <div className="col-1">N/A</div>
                      <div className="col-1"><span className="badge bg-success">Activo</span></div>
                      <div className="col-2">👁 ✏ 🗑</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Cédula/RIF:</strong> Identificación única del usuario.</li>
                    <li><strong>Nombre completo:</strong> Nombre y apellido.</li>
                    <li><strong>Email:</strong> Correo de acceso.</li>
                    <li><strong>Rol:</strong> Indica permisos (Admin, Coordinador, etc.).</li>
                    <li><strong>Departamento:</strong> Área de trabajo asignada.</li>
                    <li><strong>Cargo:</strong> Puesto que ocupa.</li>
                    <li><strong>Estado:</strong> Activo (acceso), Inactivo (bloqueado).</li>
                    <li><strong>Acciones:</strong>
                      <ul>
                        <li><strong>Ver (info):</strong> Ficha completa.</li>
                        <li><strong>Editar (lápiz):</strong> Modificar datos.</li>
                        <li><strong>Eliminar (basura):</strong> Elimina permanentemente.</li>
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
              <CCol md={2} xs={12} className="mb-2 mb-md-0">
                <CFormSelect
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="TODOS">Todos estados</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="SUSPENDED">Suspendido</option>
                </CFormSelect>
              </CCol>
              <CCol md={2} xs={12} className="mb-2 mb-md-0">
                <CFormSelect
                  value={searchCriteria}
                  onChange={(e) => { setSearchCriteria(e.target.value); setSearchTerm(''); setCurrentPage(1); }}
                >
                  {CRITERIA_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={8} xs={12}>
                <CInputGroup>
                  <CInputGroupText className="user-search-icon">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    className="user-search-input"
                    placeholder={`Buscar por ${CRITERIA_OPTIONS.find(o => o.value === searchCriteria)?.label || 'nombre'}...`}
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
                    <CTableDataCell colSpan="9" className="text-center py-4">
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
                    <CFormLabel>Nombre *</CFormLabel>
                    <CFormInput name="first_name" value={editForm.first_name || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Apellido *</CFormLabel>
                    <CFormInput name="last_name" value={editForm.last_name || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Cédula/RIF</CFormLabel>
                    <CFormInput name="identification_number" value={editForm.identification_number || ''} onChange={handleEditChange} placeholder="V-12345678" />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Email *</CFormLabel>
                    <CFormInput type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Teléfono</CFormLabel>
                    <CFormInput name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="+58 412 1234567" />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Rol *</CFormLabel>
                    <CFormSelect name="role_id" value={editForm.role_id || ''} onChange={handleEditChange} required>
                      <option value="">Seleccione rol</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {translateRole(role.name)}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Estado</CFormLabel>
                    <CFormSelect name="status" value={editForm.status || 'Active'} onChange={handleEditChange}>
                      <option value="Active">Activo</option>
                      <option value="Inactive">Inactivo</option>
                      <option value="Suspended">Suspendido</option>
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
            <p>¿Estás seguro de que deseas eliminar permanentemente al usuario <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>? Esta acción no se puede deshacer.</p>
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