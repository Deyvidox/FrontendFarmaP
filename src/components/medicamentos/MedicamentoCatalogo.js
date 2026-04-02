import React, { useState } from 'react';
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
import '../../css/medicamentos/Medicamentos.css';

const MedicamentoCatalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('TODAS');
  const [sortBy, setSortBy] = useState('nombre');
  const itemsPerPage = 8;

  // Datos quemados de medicamentos
  const medicamentosQuemados = [
    {
      id: 1,
      MedCodigoNacional: 'MED-001',
      MedNombreComercial: 'Paracetamol 500mg',
      MedNombreGenerico: 'Paracetamol',
      MedPrincipioActivo: 'Paracetamol',
      MedConcentracion: '500 mg',
      FormaFarmaceutica: 'Tableta',
      Laboratorio: 'Genfar',
      Categoria: 'Analgésico',
      MedRequiereReceta: false,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-01-15'
    },
    {
      id: 2,
      MedCodigoNacional: 'MED-002',
      MedNombreComercial: 'Amoxicilina 250mg',
      MedNombreGenerico: 'Amoxicilina',
      MedPrincipioActivo: 'Amoxicilina Trihidratada',
      MedConcentracion: '250 mg',
      FormaFarmaceutica: 'Cápsula',
      Laboratorio: 'Pfizer',
      Categoria: 'Antibiótico',
      MedRequiereReceta: true,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-01-20'
    },
    {
      id: 3,
      MedCodigoNacional: 'MED-003',
      MedNombreComercial: 'Losartán 50mg',
      MedNombreGenerico: 'Losartán',
      MedPrincipioActivo: 'Losartán Potásico',
      MedConcentracion: '50 mg',
      FormaFarmaceutica: 'Tableta',
      Laboratorio: 'Roche',
      Categoria: 'Antihipertensivo',
      MedRequiereReceta: true,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-01-25'
    },
    {
      id: 4,
      MedCodigoNacional: 'MED-004',
      MedNombreComercial: 'Insulina NPH',
      MedNombreGenerico: 'Insulina',
      MedPrincipioActivo: 'Insulina Humana',
      MedConcentracion: '100 UI/mL',
      FormaFarmaceutica: 'Inyectable',
      Laboratorio: 'Novo Nordisk',
      Categoria: 'Antidiabético',
      MedRequiereReceta: true,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-02-01'
    },
    {
      id: 5,
      MedCodigoNacional: 'MED-005',
      MedNombreComercial: 'Omeprazol 20mg',
      MedNombreGenerico: 'Omeprazol',
      MedPrincipioActivo: 'Omeprazol',
      MedConcentracion: '20 mg',
      FormaFarmaceutica: 'Cápsula',
      Laboratorio: 'AstraZeneca',
      Categoria: 'Gastrointestinal',
      MedRequiereReceta: false,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-02-05'
    },
    {
      id: 6,
      MedCodigoNacional: 'MED-006',
      MedNombreComercial: 'Atorvastatina 40mg',
      MedNombreGenerico: 'Atorvastatina',
      MedPrincipioActivo: 'Atorvastatina Cálcica',
      MedConcentracion: '40 mg',
      FormaFarmaceutica: 'Tableta',
      Laboratorio: 'Pfizer',
      Categoria: 'Cardiovascular',
      MedRequiereReceta: true,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-02-10'
    },
    {
      id: 7,
      MedCodigoNacional: 'MED-007',
      MedNombreComercial: 'Salbutamol Inhalador',
      MedNombreGenerico: 'Salbutamol',
      MedPrincipioActivo: 'Salbutamol Sulfato',
      MedConcentracion: '100 mcg/dosis',
      FormaFarmaceutica: 'Inhalador',
      Laboratorio: 'GSK',
      Categoria: 'Respiratorio',
      MedRequiereReceta: true,
      MedEstado: 'INACTIVO',
      MedCreado: '2024-02-15'
    },
    {
      id: 8,
      MedCodigoNacional: 'MED-008',
      MedNombreComercial: 'Diclofenaco Gel 1%',
      MedNombreGenerico: 'Diclofenaco',
      MedPrincipioActivo: 'Diclofenaco Sódico',
      MedConcentracion: '1%',
      FormaFarmaceutica: 'Gel',
      Laboratorio: 'Novartis',
      Categoria: 'Antiinflamatorio',
      MedRequiereReceta: false,
      MedEstado: 'ACTIVO',
      MedCreado: '2024-02-20'
    }
  ];

  // Categorías únicas para filtro
  const categorias = ['TODAS', ...new Set(medicamentosQuemados.map(m => m.Categoria))];

  // Filtrar y ordenar
  let filteredMedicamentos = medicamentosQuemados.filter(med => {
    const matchesSearch = 
      med.MedNombreComercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.MedNombreGenerico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.MedCodigoNacional?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.MedPrincipioActivo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'TODAS' || med.Categoria === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Ordenar
  filteredMedicamentos.sort((a, b) => {
    switch(sortBy) {
      case 'nombre': return a.MedNombreComercial.localeCompare(b.MedNombreComercial);
      case 'categoria': return a.Categoria.localeCompare(b.Categoria);
      case 'fecha': return new Date(b.MedCreado) - new Date(a.MedCreado);
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
    const statusConfig = {
      'ACTIVO': { color: 'success', text: 'Activo' },
      'INACTIVO': { color: 'danger', text: 'Inactivo' },
      'DESCONTINUADO': { color: 'warning', text: 'Descontinuado' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', text: status };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const getRecetaBadge = (requiereReceta) => {
    return requiereReceta ? 
      <CBadge color="danger">Con Receta</CBadge> : 
      <CBadge color="success">Sin Receta</CBadge>;
  };

  const getCategoryBadge = (categoria) => {
    const categoryColors = {
      'Analgésico': 'primary',
      'Antibiótico': 'warning',
      'Antihipertensivo': 'info',
      'Antidiabético': 'success',
      'Gastrointestinal': 'secondary',
      'Cardiovascular': 'danger',
      'Respiratorio': 'info',
      'Antiinflamatorio': 'warning'
    };
    return <CBadge color={categoryColors[categoria] || 'secondary'}>{categoria}</CBadge>;
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
              {currentMedicamentos.length > 0 ? (
                currentMedicamentos.map((med) => (
                  <CTableRow key={med.id}>
                    <CTableDataCell>
                      <strong>{med.MedCodigoNacional}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{med.MedNombreComercial}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{med.MedNombreGenerico}</CTableDataCell>
                    <CTableDataCell>{med.MedPrincipioActivo}</CTableDataCell>
                    <CTableDataCell>{med.MedConcentracion}</CTableDataCell>
                    <CTableDataCell>{med.FormaFarmaceutica}</CTableDataCell>
                    <CTableDataCell>{med.Laboratorio}</CTableDataCell>
                    <CTableDataCell>{getCategoryBadge(med.Categoria)}</CTableDataCell>
                    <CTableDataCell>{getRecetaBadge(med.MedRequiereReceta)}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(med.MedEstado)}</CTableDataCell>
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
        {totalPages > 1 && (
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