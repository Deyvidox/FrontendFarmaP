import React, { useEffect, useState } from 'react';
import {
  CCard, CRow, CCol, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CInputGroup, CFormInput,
  CInputGroupText, CPagination, CPaginationItem, CButton, CDropdown,
  CDropdownToggle, CDropdownMenu, CDropdownItem, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter, CForm, CFormLabel, CFormSelect, CSpinner
} from '@coreui/react';
import {
  cilMedicalCross, cilSearch, cilPencil, cilTrash, cilFilter,
  cilSortAscending, cilInfo
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  getMedicines, getMedicineCategories, getMedicineById, updateMedicine, deleteMedicine,
  getLaboratories, getPharmaceuticalForms
} from 'src/services/api';
import '../../css/medicamentos/Medicamentos.css';
import HelpButton from '../common/HelpButton';

const MedicamentoCatalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('TODAS');
  const [filterStatus, setFilterStatus] = useState('TODOS'); // nuevo filtro
  const [sortBy, setSortBy] = useState('nombre');

  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState(['TODAS']);
  const [laboratories, setLaboratories] = useState([]);
  const [pharmaceuticalForms, setPharmaceuticalForms] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({});

  const itemsPerPage = 8;

  const loadData = async () => {
    setLoading(true);
    try {
      const [medsRes, catsRes, labRes, formRes] = await Promise.all([
        getMedicines(),
        getMedicineCategories(),
        getLaboratories(),
        getPharmaceuticalForms()
      ]);

      setMedicamentos(medsRes?.message?.medicines || []);

      const catList = ['TODAS'];
      const rawCategories = Array.isArray(catsRes.message) ? catsRes.message : (catsRes.message?.categories || []);
      rawCategories.forEach(c => {
        if (c.name) catList.push(c.name);
      });
      setCategories(rawCategories);
      setCategorias(catList);

      setLaboratories(Array.isArray(labRes.message) ? labRes.message : (labRes.message?.laboratories || []));

      // CORRECCIÓN: backend devuelve "forms", no "pharmaceuticalForms"
      const formsArray = Array.isArray(formRes.message) ? formRes.message : (formRes.message?.forms || []);
      setPharmaceuticalForms(formsArray);

    } catch (err) {
      console.error('Error cargando catálogo:', err);
      setError(err.message || 'Error al cargar catálogo de medicamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aplicar filtros
  let filteredMedicamentos = medicamentos.filter(med => {
    const matchesSearch =
      (med.commercial_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.generic_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.national_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.active_principle || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'TODAS' || med.category === filterCategory;

    const matchesStatus = filterStatus === 'TODOS' ||
      (med.status || '').toUpperCase() === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  filteredMedicamentos.sort((a, b) => {
    switch (sortBy) {
      case 'nombre': return (a.commercial_name || '').localeCompare(b.commercial_name || '');
      case 'categoria': return (a.category || '').localeCompare(b.category || '');
      case 'fecha': return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default: return 0;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicamentos = filteredMedicamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);

  const getStatusBadge = (status) => {
    if (!status) return <CBadge color="secondary">N/A</CBadge>;
    const statusConfig = {
      'ACTIVE': { color: 'success', text: 'Activo' },
      'INACTIVE': { color: 'danger', text: 'Inactivo' },
      'DISCONTINUED': { color: 'warning', text: 'Descontinuado' }
    };
    const config = statusConfig[status.toUpperCase()] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getRecetaBadge = (requiresPrescription) => {
    return requiresPrescription ? <CBadge color="danger">Con Receta</CBadge> : <CBadge color="success">Sin Receta</CBadge>;
  };

  const getCategoryBadge = (categoria) => {
    return <CBadge color="info">{categoria || 'Sin categoría'}</CBadge>;
  };

  const handleViewClick = async (med) => {
    try {
      const res = await getMedicineById(med.id);
      setSelectedMed(res.message.medicine);
      setViewModal(true);
    } catch (err) {
      alert('Error cargando detalles del medicamento');
    }
  };

  const handleEditClick = async (med) => {
    try {
      const res = await getMedicineById(med.id);
      const data = res.message.medicine;
      setSelectedMed(data);
      setEditForm({
        national_code: data.national_code || '',
        commercial_name: data.commercial_name || '',
        generic_name: data.generic_name || '',
        active_principle: data.active_principle || '',
        concentration: data.concentration || '',
        pharmaceutical_form_id: data.pharmaceutical_form_id || '',
        administration_route: data.administration_route || '',
        laboratory_id: data.laboratory_id || '',
        category_id: data.category_id || '',
        sanitary_registration: data.sanitary_registration || '',
        requires_prescription: data.requires_prescription || false,
        storage_conditions: data.storage_conditions || '',
        storage_temperature: data.storage_temperature || '',
        unit_measure: data.unit_measure || '',
        units_per_presentation: data.units_per_presentation || 1
      });
      setEditModal(true);
    } catch (err) {
      alert('Error cargando datos para editar');
    }
  };

  const handleDeleteClick = (med) => {
    setSelectedMed(med);
    setDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateMedicine(selectedMed.id, editForm);
      setEditModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error actualizando medicamento');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteMedicine(selectedMed.id);
      setDeleteModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error eliminando medicamento');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <CCard className="medicamento-card">
        <CCardHeader className="medicamento-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilMedicalCross} className="me-2" />
              Catálogo de Medicamentos
              <HelpButton title="Manual de Usuario – Catálogo de Medicamentos">
                <div>
                  <p><strong>¿Qué hace esta pantalla?</strong><br />
                    Muestra todos los medicamentos registrados en el sistema. Permite buscar, filtrar por categoría y ordenar, además de ver detalles, editar o eliminar cada uno.</p>
                  <h6>🧪 Ejemplo de cómo se ve la tabla</h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f8f9fa', color: '#212529', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: '#e9ecef' }}>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Código</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Nombre Comercial</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Principio Activo</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Concentración</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Laboratorio</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Categoría</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Estado</th>
                          <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>P-00789</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Amoxicilina 500mg</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Amoxicilina</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>500 mg</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Laboratorios Vargas S.A.</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#17a2b8', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Antibiótico</span></td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#198754', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Activo</span></td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>👁️ ✏️ 🗑️</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>P-00123</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Losartán 50mg</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Losartán</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>50 mg</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Laboratorios Vargas S.A.</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#17a2b8', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Antihipertensivo</span></td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#198754', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Activo</span></td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>👁️ ✏️ 🗑️</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h6>📋 Uso y funcionalidades</h6>
                  <ol>
                    <li><strong>Barra de búsqueda:</strong> Busca por nombre comercial, genérico, código nacional o principio activo. Mínimo 2 caracteres.</li>
                    <li><strong>Filtro de categoría:</strong> Seleccione una categoría del desplegable para mostrar solo esos medicamentos.</li>
                    <li><strong>Ordenar por:</strong> Elija entre Nombre, Categoría o Fecha de creación.</li>
                    <li><strong>Acciones por fila:</strong>
                      <ul>
                        <li><strong>👁️ Ver:</strong> Abre una vista detallada con todos los campos del medicamento.</li>
                        <li><strong>✏️ Editar:</strong> Permite modificar cualquier dato. Se abrirá un formulario con los valores actuales.</li>
                        <li><strong>🗑️ Eliminar:</strong> Cambia el estado a Inactivo. No se borra físicamente. Requiere confirmación.</li>
                      </ul>
                    </li>
                    <li><strong>Paginación:</strong> Muestra 8 medicamentos por página. Use los controles para navegar.</li>
                  </ol>
                  <p><strong>⚠️ Nota:</strong> No se puede eliminar un medicamento si tiene lotes activos. Primero debe retirar esos lotes del inventario.</p>
                </div>
              </HelpButton>
            </h5>
          </div>
        </CCardHeader>
        <CCardBody className="medicamento-card-body">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <div className="medicamento-filters mb-4">
            <CRow className="g-3">
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                  <CFormInput
                    placeholder="Buscar por nombre, código o principio activo..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="medicamento-form-input"
                  />
                  {searchTerm && (
                    <CButton color="secondary" variant="outline" onClick={() => { setSearchTerm(''); setCurrentPage(1); }}>&#x2715;</CButton>
                  )}
                </CInputGroup>
                {searchTerm && <div className="text-muted small mt-1">{filteredMedicamentos.length} resultado(s) de {medicamentos.length} total</div>}
              </CCol>
              <CCol md={3}>
                <CDropdown>
                  <CDropdownToggle color="secondary" className="w-100">
                    <CIcon icon={cilFilter} className="me-2" />
                    Categoría: {filterCategory}
                  </CDropdownToggle>
                  <CDropdownMenu className="w-100">
                    {categorias.map((cat, index) => (
                      <CDropdownItem key={index} onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}>
                        {cat}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="TODOS">Todos estados</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="DISCONTINUED">Descontinuado</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CDropdown>
                  <CDropdownToggle color="secondary" className="w-100">
                    <CIcon icon={cilSortAscending} className="me-2" />
                    Ordenar por
                  </CDropdownToggle>
                  <CDropdownMenu className="w-100">
                    <CDropdownItem onClick={() => setSortBy('nombre')}>Nombre</CDropdownItem>
                    <CDropdownItem onClick={() => setSortBy('categoria')}>Categoría</CDropdownItem>
                    <CDropdownItem onClick={() => setSortBy('fecha')}>Fecha</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
            </CRow>
          </div>

          <div className="table-responsive">
            <CTable hover responsive className="medicamento-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Nombre Comercial</CTableHeaderCell>
                  <CTableHeaderCell>Principio Activo</CTableHeaderCell>
                  <CTableHeaderCell>Concentración</CTableHeaderCell>
                  <CTableHeaderCell>Laboratorio</CTableHeaderCell>
                  <CTableHeaderCell>Categoría</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center py-5">
                      Cargando medicamentos...
                    </CTableDataCell>
                  </CTableRow>
                ) : currentMedicamentos.length > 0 ? (
                  currentMedicamentos.map((med) => (
                    <CTableRow key={med.id}>
                      <CTableDataCell><strong>{med.national_code || 'N/A'}</strong></CTableDataCell>
                      <CTableDataCell><strong>{med.commercial_name}</strong></CTableDataCell>
                      <CTableDataCell>{med.active_principle || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{med.concentration || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{med.laboratory || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{getCategoryBadge(med.category)}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(med.status)}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton color="info" variant="outline" size="sm" onClick={() => handleViewClick(med)} title="Ver detalles">
                            <CIcon icon={cilInfo} />
                          </CButton>
                          <CButton color="warning" variant="outline" size="sm" onClick={() => handleEditClick(med)} title="Editar">
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton color="danger" variant="outline" size="sm" onClick={() => handleDeleteClick(med)} title="Eliminar">
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center py-5">
                      <div className="medicamento-empty-state">
                        <CIcon icon={cilMedicalCross} className="medicamento-empty-state-icon" />
                        <h5>No se encontraron medicamentos</h5>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMedicamentos.length)} de {filteredMedicamentos.length} medicamentos
              </div>
              <CPagination>
                <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  Anterior
                </CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem key={index + 1} active={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Siguiente
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal Ver Detalles */}
      <CModal visible={viewModal} onClose={() => setViewModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Detalles del Medicamento</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedMed && (
            <CRow>
              <CCol md={6} className="mb-3">
                <strong>Nombre Comercial:</strong> {selectedMed.commercial_name}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Nombre Genérico:</strong> {selectedMed.generic_name}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Código Nacional:</strong> {selectedMed.national_code}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Principio Activo:</strong> {selectedMed.active_principle}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Concentración:</strong> {selectedMed.concentration}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Laboratorio:</strong> {selectedMed.laboratory}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Categoría:</strong> {selectedMed.category}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Forma Farmacéutica:</strong> {selectedMed.pharmaceutical_form}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Registro Sanitario:</strong> {selectedMed.sanitary_registration}
              </CCol>
              <CCol md={6} className="mb-3">
                <strong>Requiere Receta:</strong> {selectedMed.requires_prescription ? 'Sí' : 'No'}
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar */}
      <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle className="d-flex align-items-center gap-3">
            <div>Editar Medicamento</div>
            <HelpButton title="Manual de Usuario - Editar Medicamento">
              {/* contenido ayuda */}
            </HelpButton>
          </CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitEdit}>
          <CModalBody>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-commercial_name">Nombre Comercial</CFormLabel>
                <CFormInput id="edit-commercial_name" name="commercial_name" value={editForm.commercial_name || ''} onChange={handleEditChange} required />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-generic_name">Nombre Genérico</CFormLabel>
                <CFormInput id="edit-generic_name" name="generic_name" value={editForm.generic_name || ''} onChange={handleEditChange} />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-active_principle">Principio Activo</CFormLabel>
                <CFormInput id="edit-active_principle" name="active_principle" value={editForm.active_principle || ''} onChange={handleEditChange} />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-concentration">Concentración</CFormLabel>
                <CFormInput id="edit-concentration" name="concentration" value={editForm.concentration || ''} onChange={handleEditChange} />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-category_id">Categoría</CFormLabel>
                <CFormSelect id="edit-category_id" name="category_id" value={editForm.category_id || ''} onChange={handleEditChange} required>
                  <option value="">Seleccione...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-laboratory_id">Laboratorio</CFormLabel>
                <CFormSelect id="edit-laboratory_id" name="laboratory_id" value={editForm.laboratory_id || ''} onChange={handleEditChange} required>
                  <option value="">Seleccione...</option>
                  {laboratories.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-pharmaceutical_form_id">Forma Farmacéutica</CFormLabel>
                <CFormSelect id="edit-pharmaceutical_form_id" name="pharmaceutical_form_id" value={editForm.pharmaceutical_form_id || ''} onChange={handleEditChange} required>
                  <option value="">Seleccione...</option>
                  {pharmaceuticalForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel htmlFor="edit-national_code">Código Nacional</CFormLabel>
                <CFormInput id="edit-national_code" name="national_code" value={editForm.national_code || ''} onChange={handleEditChange} />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm" /> : 'Guardar Cambios'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal Eliminar */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar el medicamento <strong>{selectedMed?.commercial_name}</strong>? Esta acción lo desactivará en el sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancelar</CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default MedicamentoCatalogo;