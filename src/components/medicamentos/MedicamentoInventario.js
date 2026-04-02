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
  CButton,
  CRow,
  CCol,
  CProgress,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import { 
  cilStorage, 
  cilSearch, 
  cilPlus, 
  cilMinus,
  cilSwapHorizontal,
  cilFilter,
  cilChart,
  cilWarning,
  cilCheckCircle
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import '../../css/medicamentos/Medicamentos.css';

const MedicamentoInventario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUbicacion, setFilterUbicacion] = useState('TODAS');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const itemsPerPage = 8;

  // Datos quemados de inventario
  const inventarioQuemado = [
    {
      id: 1,
      LoteNumero: 'LOT-2024-001',
      Medicamento: 'Paracetamol 500mg',
      Ubicacion: 'Estante A1',
      FechaVencimiento: '2024-03-15',
      CantidadTotal: 1000,
      CantidadDisponible: 500,
      CantidadReservada: 200,
      CantidadEntregada: 300,
      StockMinimo: 100,
      StockMaximo: 1500,
      EstadoStock: 'OPTIMO',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 2,
      LoteNumero: 'LOT-2024-002',
      Medicamento: 'Amoxicilina 250mg',
      Ubicacion: 'Estante B2',
      FechaVencimiento: '2024-04-20',
      CantidadTotal: 800,
      CantidadDisponible: 300,
      CantidadReservada: 250,
      CantidadEntregada: 250,
      StockMinimo: 80,
      StockMaximo: 1000,
      EstadoStock: 'BAJO',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 3,
      LoteNumero: 'LOT-2023-045',
      Medicamento: 'Losartán 50mg',
      Ubicacion: 'Estante C3',
      FechaVencimiento: '2024-02-28',
      CantidadTotal: 500,
      CantidadDisponible: 0,
      CantidadReservada: 0,
      CantidadEntregada: 500,
      StockMinimo: 50,
      StockMaximo: 600,
      EstadoStock: 'AGOTADO',
      EstadoLote: 'RETIRADO'
    },
    {
      id: 4,
      LoteNumero: 'LOT-2024-003',
      Medicamento: 'Insulina NPH',
      Ubicacion: 'Refrigerador 1',
      FechaVencimiento: '2024-05-10',
      CantidadTotal: 400,
      CantidadDisponible: 200,
      CantidadReservada: 100,
      CantidadEntregada: 100,
      StockMinimo: 40,
      StockMaximo: 500,
      EstadoStock: 'OPTIMO',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 5,
      LoteNumero: 'LOT-2024-004',
      Medicamento: 'Omeprazol 20mg',
      Ubicacion: 'Estante A2',
      FechaVencimiento: '2024-03-05',
      CantidadTotal: 1200,
      CantidadDisponible: 400,
      CantidadReservada: 300,
      CantidadEntregada: 500,
      StockMinimo: 120,
      StockMaximo: 1500,
      EstadoStock: 'CRITICO',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 6,
      LoteNumero: 'LOT-2024-005',
      Medicamento: 'Atorvastatina 40mg',
      Ubicacion: 'Estante B1',
      FechaVencimiento: '2024-06-30',
      CantidadTotal: 600,
      CantidadDisponible: 250,
      CantidadReservada: 150,
      CantidadEntregada: 200,
      StockMinimo: 60,
      StockMaximo: 800,
      EstadoStock: 'BAJO',
      EstadoLote: 'DISPONIBLE'
    },
    {
      id: 7,
      LoteNumero: 'LOT-2023-050',
      Medicamento: 'Salbutamol Inhalador',
      Ubicacion: 'Estante D4',
      FechaVencimiento: '2024-01-15',
      CantidadTotal: 300,
      CantidadDisponible: 0,
      CantidadReservada: 0,
      CantidadEntregada: 300,
      StockMinimo: 30,
      StockMaximo: 400,
      EstadoStock: 'AGOTADO',
      EstadoLote: 'RETIRADO'
    },
    {
      id: 8,
      LoteNumero: 'LOT-2024-006',
      Medicamento: 'Diclofenaco Gel 1%',
      Ubicacion: 'Estante C2',
      FechaVencimiento: '2024-04-01',
      CantidadTotal: 700,
      CantidadDisponible: 350,
      CantidadReservada: 200,
      CantidadEntregada: 150,
      StockMinimo: 70,
      StockMaximo: 900,
      EstadoStock: 'OPTIMO',
      EstadoLote: 'DISPONIBLE'
    }
  ];

  // Ubicaciones únicas
  const ubicaciones = ['TODAS', ...new Set(inventarioQuemado.map(i => i.Ubicacion))];
  
  // Estados únicos
  const estados = ['TODOS', ...new Set(inventarioQuemado.map(i => i.EstadoStock))];

  // Calcular estadísticas
  const totalItems = inventarioQuemado.length;
  const totalUnidades = inventarioQuemado.reduce((sum, item) => sum + item.CantidadTotal, 0);
  const unidadesDisponibles = inventarioQuemado.reduce((sum, item) => sum + item.CantidadDisponible, 0);
  const itemsOptimos = inventarioQuemado.filter(item => item.EstadoStock === 'OPTIMO').length;
  const itemsCriticos = inventarioQuemado.filter(item => item.EstadoStock === 'CRITICO' || item.EstadoStock === 'BAJO').length;

  // Filtrar inventario
  let filteredInventario = inventarioQuemado.filter(item => {
    const matchesSearch = 
      item.Medicamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.LoteNumero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUbicacion = filterUbicacion === 'TODAS' || item.Ubicacion === filterUbicacion;
    const matchesEstado = filterEstado === 'TODOS' || item.EstadoStock === filterEstado;
    
    return matchesSearch && matchesUbicacion && matchesEstado;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventario = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);

  // Funciones auxiliares
  const getEstadoStockBadge = (estado) => {
    const estadoConfig = {
      'OPTIMO': { color: 'success', icon: cilCheckCircle, text: 'Óptimo' },
      'BAJO': { color: 'warning', icon: cilWarning, text: 'Bajo' },
      'CRITICO': { color: 'danger', icon: cilWarning, text: 'Crítico' },
      'AGOTADO': { color: 'dark', icon: cilMinus, text: 'Agotado' }
    };
    
    const config = estadoConfig[estado] || { color: 'secondary', icon: cilStorage, text: estado };
    return (
      <CBadge color={config.color}>
        <CIcon icon={config.icon} className="me-1" />
        {config.text}
      </CBadge>
    );
  };

  const getEstadoLoteBadge = (estado) => {
    const estadoConfig = {
      'DISPONIBLE': { color: 'success', text: 'Disponible' },
      'RESERVADO': { color: 'warning', text: 'Reservado' },
      'ENTREGADO': { color: 'info', text: 'Entregado' },
      'RETIRADO': { color: 'danger', text: 'Retirado' },
      'VENCIDO': { color: 'dark', text: 'Vencido' }
    };
    
    const config = estadoConfig[estado] || { color: 'secondary', text: estado };
    return <CBadge color={config.color}>{config.text}</CBadge>;
  };

  const calcularPorcentajeStock = (disponible, minimo, maximo) => {
    const rango = maximo - minimo;
    const posicion = disponible - minimo;
    return Math.max(0, Math.min(100, (posicion / rango) * 100));
  };

  const getProgressColor = (porcentaje) => {
    if (porcentaje <= 20) return 'danger';
    if (porcentaje <= 50) return 'warning';
    if (porcentaje <= 80) return 'info';
    return 'success';
  };

  // Handlers
  const handleAgregarStock = (item) => {
    console.log('Agregar stock a:', item);
  };

  const handleAjustarStock = (item) => {
    console.log('Ajustar stock de:', item);
  };

  const handleVerMovimientos = (item) => {
    console.log('Ver movimientos de:', item);
  };

  return (
    <div className="medicamento-inventario-container">
      {/* Resumen del inventario */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-primary">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{totalItems}</div>
                <div>Lotes Totales</div>
              </div>
              <CIcon icon={cilStorage} height={48} className="text-white opacity-50" />
            </CCardBody>
            <CProgress className="mt-3" color="info" value={100} style={{ height: '4px' }} />
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-success">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{unidadesDisponibles.toLocaleString()}</div>
                <div>Unidades Disponibles</div>
              </div>
              <CIcon icon={cilCheckCircle} height={48} className="text-white opacity-50" />
            </CCardBody>
            <CProgress className="mt-3" color="info" value={(unidadesDisponibles / totalUnidades * 100)} style={{ height: '4px' }} />
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-warning">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{itemsOptimos}</div>
                <div>Lotes Óptimos</div>
              </div>
              <CIcon icon={cilChart} height={48} className="text-white opacity-50" />
            </CCardBody>
            <CProgress className="mt-3" color="info" value={(itemsOptimos / totalItems * 100)} style={{ height: '4px' }} />
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <CCard className="text-white bg-danger">
            <CCardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{itemsCriticos}</div>
                <div>Lotes Críticos/Bajos</div>
              </div>
              <CIcon icon={cilWarning} height={48} className="text-white opacity-50" />
            </CCardBody>
            <CProgress className="mt-3" color="info" value={(itemsCriticos / totalItems * 100)} style={{ height: '4px' }} />
          </CCard>
        </CCol>
      </CRow>

      {/* Tabla de inventario */}
      <CCard className="medicamento-card">
        <CCardHeader className="medicamento-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilStorage} className="me-2" />
              Control de Inventario
            </h5>
          </div>
        </CCardHeader>
        <CCardBody className="medicamento-card-body">
          {/* Filtros */}
          <div className="medicamento-filters mb-4">
            <CRow className="g-3">
              <CCol md={6}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Buscar por medicamento, lote o ubicación..."
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
                    {filterUbicacion === 'TODAS' ? 'Todas Ubicaciones' : filterUbicacion}
                  </CDropdownToggle>
                  <CDropdownMenu className="w-100">
                    {ubicaciones.map((ubic, index) => (
                      <CDropdownItem 
                        key={index} 
                        onClick={() => {
                          setFilterUbicacion(ubic);
                          setCurrentPage(1);
                        }}
                      >
                        {ubic}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
              <CCol md={3}>
                <CDropdown>
                  <CDropdownToggle color="secondary" className="w-100">
                    <CIcon icon={cilFilter} className="me-2" />
                    {filterEstado === 'TODOS' ? 'Todos Estados' : filterEstado}
                  </CDropdownToggle>
                  <CDropdownMenu className="w-100">
                    {estados.map((estado, index) => (
                      <CDropdownItem 
                        key={index} 
                        onClick={() => {
                          setFilterEstado(estado);
                          setCurrentPage(1);
                        }}
                      >
                        {estado}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
            </CRow>
          </div>

          {/* Tabla */}
          <div className="table-responsive">
            <CTable hover responsive className="medicamento-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Lote</CTableHeaderCell>
                  <CTableHeaderCell>Medicamento</CTableHeaderCell>
                  <CTableHeaderCell>Ubicación</CTableHeaderCell>
                  <CTableHeaderCell>Vencimiento</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Disponible</CTableHeaderCell>
                  <CTableHeaderCell>Reservado</CTableHeaderCell>
                  <CTableHeaderCell>Entregado</CTableHeaderCell>
                  <CTableHeaderCell>Estado Stock</CTableHeaderCell>
                  <CTableHeaderCell>Estado Lote</CTableHeaderCell>
                  <CTableHeaderCell>Nivel Stock</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentInventario.length > 0 ? (
                  currentInventario.map((item) => {
                    const porcentajeStock = calcularPorcentajeStock(
                      item.CantidadDisponible, 
                      item.StockMinimo, 
                      item.StockMaximo
                    );
                    
                    return (
                      <CTableRow key={item.id}>
                        <CTableDataCell>
                          <strong>{item.LoteNumero}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{item.Medicamento}</CTableDataCell>
                        <CTableDataCell>{item.Ubicacion}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(item.FechaVencimiento).toLocaleDateString('es-ES')}
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{item.CantidadTotal}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong className={
                            item.CantidadDisponible <= item.StockMinimo ? 'text-danger' :
                            item.CantidadDisponible <= item.StockMinimo * 2 ? 'text-warning' :
                            'text-success'
                          }>
                            {item.CantidadDisponible}
                          </strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-warning">{item.CantidadReservada}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-info">{item.CantidadEntregada}</span>
                        </CTableDataCell>
                        <CTableDataCell>{getEstadoStockBadge(item.EstadoStock)}</CTableDataCell>
                        <CTableDataCell>{getEstadoLoteBadge(item.EstadoLote)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CProgress 
                              className="flex-grow-1 me-2" 
                              value={porcentajeStock}
                              color={getProgressColor(porcentajeStock)}
                              style={{ height: '8px' }}
                            />
                            <small className="text-muted">{Math.round(porcentajeStock)}%</small>
                          </div>
                          <div className="small text-muted">
                            Mín: {item.StockMinimo} | Máx: {item.StockMaximo}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2 justify-content-center">
                            <CButton
                              color="success"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => handleAgregarStock(item)}
                              title="Agregar stock"
                              disabled={item.EstadoLote !== 'DISPONIBLE'}
                            >
                              <CIcon icon={cilPlus} />
                            </CButton>
                            <CButton
                              color="warning"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => handleAjustarStock(item)}
                              title="Ajustar stock"
                              disabled={item.EstadoLote !== 'DISPONIBLE'}
                            >
                              <CIcon icon={cilSwapHorizontal} />
                            </CButton>
                            <CButton
                              color="info"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => handleVerMovimientos(item)}
                              title="Ver movimientos"
                            >
                              <CIcon icon={cilStorage} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="12" className="text-center py-5">
                      <div className="medicamento-empty-state">
                        <CIcon icon={cilStorage} className="medicamento-empty-state-icon" />
                        <h5>No se encontraron registros</h5>
                        <p className="text-muted">
                          No hay elementos en el inventario que coincidan con tu búsqueda
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
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInventario.length)} de {filteredInventario.length} registros
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
    </div>
  );
};

export default MedicamentoInventario;