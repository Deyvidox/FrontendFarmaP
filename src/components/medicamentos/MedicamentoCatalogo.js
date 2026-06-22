import React, { useEffect, useState } from 'react';
import {
  CCard,
  CRow,
  CCol,
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
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import { 
  cilMedicalCross, 
  cilSearch, 
  cilPencil, 
  cilTrash,
  cilFilter,
  cilSortAscending,
  cilUser
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getMedicines, getMedicineCategories } from 'src/services/api';
import '../../css/medicamentos/Medicamentos.css';

const MedicamentoCatalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('TODAS');
  const [sortBy, setSortBy] = useState('nombre');
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState(['TODAS']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const itemsPerPage = 8;

  useEffect(() => {
    const loadData = async () => {
      try {
        const medsRes = await getMedicines();
        const catsRes = await getMedicineCategories();
        
        setMedicamentos(medsRes?.message?.medicines || []);
        
        const catList = ['TODAS'];
        if (catsRes?.message) {
          // Si catsRes es array u objeto listamos sus nombres
          const cats = Array.isArray(catsRes.message) ? catsRes.message : (catsRes.message.categories || []);
          cats.forEach(c => {
            if (c.name) catList.push(c.name);
          });
        }
        setCategorias(catList);
      } catch (err) {
        console.error('Error cargando catálogo:', err);
        setError(err.message || 'Error al cargar catálogo de medicamentos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrar y ordenar
  let filteredMedicamentos = medicamentos.filter(med => {
    const matchesSearch = 
      (med.commercial_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.generic_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.national_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.active_principle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'TODAS' || med.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Ordenar
  filteredMedicamentos.sort((a, b) => {
    switch(sortBy) {
      case 'nombre': return (a.commercial_name || '').localeCompare(b.commercial_name || '');
      case 'categoria': return (a.category || '').localeCompare(b.category || '');
      case 'fecha': return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default: return 0;
    }
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicamentos = filteredMedicamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);

  // Estados visuales
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
    return requiresPrescription ? 
      <CBadge color="danger">Con Receta</CBadge> : 
      <CBadge color="success">Sin Receta</CBadge>;
  };

  const getCategoryBadge = (categoria) => {
    return <CBadge color="info">{categoria || 'Sin categoría'}</CBadge>;
  };

  // Handlers
  const handleEditClick = (medicamento) => {
    console.log('Editar medicamento:', medicamento);
  };

  const handleDeleteClick = (medicamento) => {
    console.log('Eliminar medicamento:', medicamento);
  };

  const handleViewClick = (medicamento) => {
    console.log('Ver medicamento:', medicamento);
  };

  return (
    <CCard className="medicamento-card">
      <CCardHeader className="medicamento-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilMedicalCross} className="me-2" />
            Catálogo de Medicamentos
          </h5>
          <div className="d-flex gap-2">
            <CButton color="primary" size="sm">
              <CIcon icon={cilMedicalCross} className="me-1" />
              Nuevo Medicamento
            </CButton>
          </div>
        </div>
      </CCardHeader>
      <CCardBody className="medicamento-card-body">
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {/* Filtros y búsqueda */}
        <div className="medicamento-filters mb-4">
          <CRow className="g-3">
            <CCol md={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por nombre, código o principio activo..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="medicamento-form-input"
                />
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CDropdown>
                <CDropdownToggle color="secondary" className="w-100">
                  <CIcon icon={cilFilter} className="me-2" />
                  Categoría: {filterCategory}
                </CDropdownToggle>
                <CDropdownMenu className="w-100">
                  {categorias.map((cat, index) => (
                    <CDropdownItem 
                      key={index} 
                      onClick={() => {
                        setFilterCategory(cat);
                        setCurrentPage(1);
                      }}
                    >
                      {cat}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
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

        {/* Tabla de medicamentos */}
        <div className="table-responsive">
          <CTable hover responsive className="medicamento-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Código</CTableHeaderCell>
                <CTableHeaderCell>Nombre Comercial</CTableHeaderCell>
                <CTableHeaderCell>Nombre Genérico</CTableHeaderCell>
                <CTableHeaderCell>Principio Activo</CTableHeaderCell>
                <CTableHeaderCell>Concentración</CTableHeaderCell>
                <CTableHeaderCell>Forma</CTableHeaderCell>
                <CTableHeaderCell>Laboratorio</CTableHeaderCell>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Receta</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="11" className="text-center py-5">
                    Cargando medicamentos del catálogo...
                  </CTableDataCell>
                </CTableRow>
              ) : currentMedicamentos.length > 0 ? (
                currentMedicamentos.map((med) => (
                  <CTableRow key={med.id}>
                    <CTableDataCell>
                      <strong>{med.national_code || 'N/A'}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{med.commercial_name}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{med.generic_name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{med.active_principle || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{med.concentration || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{med.pharmaceutical_form || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{med.laboratory || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{getCategoryBadge(med.category)}</CTableDataCell>
                    <CTableDataCell>{getRecetaBadge(med.requires_prescription)}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(med.status)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-2 justify-content-center">
                        <CButton
                          color="primary"
                          size="sm"
                          className="medicamento-action-btn medicamento-action-btn-primary"
                          onClick={() => handleViewClick(med)}
                          title="Ver detalles"
                        >
                          <CIcon icon={cilUser} />
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="medicamento-action-btn medicamento-action-btn-secondary"
                          onClick={() => handleEditClick(med)}
                          title="Editar"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="medicamento-action-btn medicamento-action-btn-secondary"
                          onClick={() => handleDeleteClick(med)}
                          title="Eliminar"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="11" className="text-center py-5">
                    <div className="medicamento-empty-state">
                      <CIcon icon={cilMedicalCross} className="medicamento-empty-state-icon" />
                      <h5>No se encontraron medicamentos</h5>
                      <p className="text-muted">
                        {searchTerm || filterCategory !== 'TODAS' 
                          ? 'No hay medicamentos que coincidan con tu búsqueda' 
                          : 'No hay medicamentos registrados en el sistema'
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
        {!loading && totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMedicamentos.length)} de {filteredMedicamentos.length} medicamentos
            </div>
            <CPagination>
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
      </CCardBody>
    </CCard>
  );
};

export default MedicamentoCatalogo;