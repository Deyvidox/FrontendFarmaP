import React, { useState, useEffect } from 'react';
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
  CDropdownItem,
  CSpinner,
  CAlert,
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
  cilCheckCircle,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getMedicineInventory } from 'src/services/api';
import '../../css/medicamentos/Medicamentos.css';

const MedicamentoInventario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUbicacion, setFilterUbicacion] = useState('TODAS');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const itemsPerPage = 8;

  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga de inventario desde API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getMedicineInventory();
        setInventario(response?.message?.inventory || []);
      } catch (err) {
        console.error('Error cargando inventario:', err);
        setError(err.message || 'Error al cargar inventario');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Mapeo de estados del backend a español
  const mapStockStatus = (status) => {
    const statusMap = {
      'Optimal': 'OPTIMO',
      'Low Stock': 'BAJO',
      'Out of Stock': 'AGOTADO',
      'Overstock': 'SOBRANTE',
    };
    return statusMap[status] || status;
  };

  const mapLotStatus = (status) => {
    const statusMap = {
      'Available': 'DISPONIBLE',
      'Reserved': 'RESERVADO',
      'Expired': 'VENCIDO',
      'Depleted': 'AGOTADO',
      'Quarantined': 'CUARENTENA',
    };
    return statusMap[status] || status;
  };

  // Ubicaciones y estados únicos desde los datos reales
  const ubicaciones = ['TODAS', ...new Set(inventario.map(i => i.location))];
  const estados = ['TODOS', ...new Set(inventario.map(i => mapStockStatus(i.stock_status)))];

  // Cálculo de estadísticas
  const totalItems = inventario.length;
  const totalUnidades = inventario.reduce((sum, item) => sum + (item.total_quantity || 0), 0);
  const unidadesDisponibles = inventario.reduce((sum, item) => sum + (item.available_quantity || 0), 0);
  const itemsOptimos = inventario.filter(item => mapStockStatus(item.stock_status) === 'OPTIMO').length;
  const itemsCriticos = inventario.filter(item => mapStockStatus(item.stock_status) === 'CRITICO' || mapStockStatus(item.stock_status) === 'BAJO').length;

  // Filtrado
  let filteredInventario = inventario.filter(item => {
    const stockStatusSpanish = mapStockStatus(item.stock_status);
    const matchesSearch =
      (item.medicine || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.lot_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUbicacion = filterUbicacion === 'TODAS' || item.location === filterUbicacion;
    const matchesEstado = filterEstado === 'TODOS' || stockStatusSpanish === filterEstado;
    return matchesSearch && matchesUbicacion && matchesEstado;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventario = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);

  // Funciones auxiliares de presentación
  const getEstadoStockBadge = (stockStatus) => {
    const estado = mapStockStatus(stockStatus);
    const config = {
      'OPTIMO': { color: 'success', icon: cilCheckCircle, text: 'Óptimo' },
      'BAJO': { color: 'warning', icon: cilWarning, text: 'Bajo' },
      'AGOTADO': { color: 'dark', icon: cilMinus, text: 'Agotado' },
      'SOBRANTE': { color: 'info', icon: cilStorage, text: 'Sobrante' },
    };
    const { color, icon, text } = config[estado] || { color: 'secondary', icon: cilStorage, text: estado };
    return (
      <CBadge color={color}>
        <CIcon icon={icon} className="me-1" />
        {text}
      </CBadge>
    );
  };

  const getEstadoLoteBadge = (lotStatus) => {
    const estado = mapLotStatus(lotStatus);
    const config = {
      'DISPONIBLE': { color: 'success', text: 'Disponible' },
      'RESERVADO': { color: 'warning', text: 'Reservado' },
      'VENCIDO': { color: 'dark', text: 'Vencido' },
      'AGOTADO': { color: 'dark', text: 'Agotado' },
      'CUARENTENA': { color: 'info', text: 'Cuarentena' },
    };
    const { color, text } = config[estado] || { color: 'secondary', text: estado };
    return <CBadge color={color}>{text}</CBadge>;
  };

  const calcularPorcentajeStock = (disponible, minimo, maximo) => {
    if (!maximo || !minimo || maximo <= minimo) return 0;
    return Math.max(0, Math.min(100, ((disponible - minimo) / (maximo - minimo)) * 100));
  };

  const getProgressColor = (porcentaje) => {
    if (porcentaje <= 20) return 'danger';
    if (porcentaje <= 50) return 'warning';
    if (porcentaje <= 80) return 'info';
    return 'success';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p className="mt-3">Cargando inventario de medicamentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medicamento-inventario-container">
        <CAlert color="danger">{error}</CAlert>
      </div>
    );
  }

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
            <CProgress className="mt-3" color="info" value={(unidadesDisponibles / totalUnidades) * 100} style={{ height: '4px' }} />
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
            <CProgress className="mt-3" color="info" value={(itemsOptimos / totalItems) * 100} style={{ height: '4px' }} />
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
            <CProgress className="mt-3" color="info" value={(itemsCriticos / totalItems) * 100} style={{ height: '4px' }} />
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
                    const disponible = item.available_quantity || 0;
                    const minimo = item.minimum_stock || 0;
                    const maximo = item.maximum_stock || 1;
                    const porcentajeStock = calcularPorcentajeStock(disponible, minimo, maximo);

                    return (
                      <CTableRow key={item.id}>
                        <CTableDataCell>
                          <strong>{item.lot_number}</strong>
                        </CTableDataCell>
                        <CTableDataCell>{item.medicine}</CTableDataCell>
                        <CTableDataCell>{item.location}</CTableDataCell>
                        <CTableDataCell>
                          {item.expiration_date
                            ? new Date(item.expiration_date).toLocaleDateString('es-ES')
                            : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{item.total_quantity}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong
                            className={
                              disponible <= minimo
                                ? 'text-danger'
                                : disponible <= minimo * 2
                                  ? 'text-warning'
                                  : 'text-success'
                            }
                          >
                            {disponible}
                          </strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-warning">{item.reserved_quantity || 0}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="text-info">{item.delivered_quantity || 0}</span>
                        </CTableDataCell>
                        <CTableDataCell>{getEstadoStockBadge(item.stock_status)}</CTableDataCell>
                        <CTableDataCell>{getEstadoLoteBadge(item.lot_status)}</CTableDataCell>
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
                            Mín: {minimo} | Máx: {maximo}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2 justify-content-center">
                            <CButton
                              color="success"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => console.log('Agregar stock a:', item)}
                              title="Agregar stock"
                              disabled={mapLotStatus(item.lot_status) !== 'DISPONIBLE'}
                            >
                              <CIcon icon={cilPlus} />
                            </CButton>
                            <CButton
                              color="warning"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => console.log('Ajustar stock de:', item)}
                              title="Ajustar stock"
                              disabled={mapLotStatus(item.lot_status) !== 'DISPONIBLE'}
                            >
                              <CIcon icon={cilSwapHorizontal} />
                            </CButton>
                            <CButton
                              color="info"
                              size="sm"
                              className="medicamento-action-btn"
                              onClick={() => console.log('Ver movimientos de:', item)}
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
                <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
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
                <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
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