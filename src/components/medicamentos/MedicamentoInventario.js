import React, { useState, useEffect } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CInputGroup,
  CFormInput, CInputGroupText, CPagination, CPaginationItem, CButton,
  CRow, CCol, CProgress, CDropdown, CDropdownToggle, CDropdownMenu,
  CDropdownItem, CSpinner, CAlert, CModal, CModalHeader, CModalTitle,
  CModalBody, CModalFooter, CForm, CFormLabel, CFormSelect
} from '@coreui/react';
import { cilStorage, cilSearch, cilFilter, cilChartPie, cilPlus, cilChartLine, cilPencil, cilWarning, cilCheckCircle, cilMinus, cilSwapHorizontal, cilChart } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getMedicineInventory, createInventoryMovement, getLotMovements } from 'src/services/api';
import '../../css/medicamentos/Medicamentos.css';
import HelpButton from '../common/HelpButton';

const MedicamentoInventario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUbicacion, setFilterUbicacion] = useState('TODAS');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const itemsPerPage = 8;

  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [movementModal, setMovementModal] = useState(false);
  const [movementType, setMovementType] = useState('ENTRY'); // ENTRY or ADJUSTMENT
  const [selectedLot, setSelectedLot] = useState(null);
  const [movementForm, setMovementForm] = useState({ quantity: 1, reason: '', document_reference: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);
  const [movements, setMovements] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchInventory();
  }, []);

  const mapStockStatus = (status) => {
    const statusMap = { 'Optimal': 'OPTIMO', 'Low Stock': 'BAJO', 'Out of Stock': 'AGOTADO', 'Overstock': 'SOBRANTE' };
    return statusMap[status] || status;
  };

  const mapLotStatus = (status) => {
    const statusMap = { 'Available': 'DISPONIBLE', 'Reserved': 'RESERVADO', 'Expired': 'VENCIDO', 'Depleted': 'AGOTADO', 'Quarantined': 'CUARENTENA' };
    return statusMap[status] || status;
  };

  const ubicaciones = ['TODAS', ...new Set(inventario.map(i => i.location))];
  const estados = ['TODOS', ...new Set(inventario.map(i => mapStockStatus(i.stock_status)))];

  const totalItems = inventario.length;
  const totalUnidades = inventario.reduce((sum, item) => sum + (item.total_quantity || 0), 0);
  const unidadesDisponibles = inventario.reduce((sum, item) => sum + (item.available_quantity || 0), 0);
  const itemsOptimos = inventario.filter(item => mapStockStatus(item.stock_status) === 'OPTIMO').length;
  const itemsCriticos = inventario.filter(item => mapStockStatus(item.stock_status) === 'CRITICO' || mapStockStatus(item.stock_status) === 'BAJO').length;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventario = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);

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

  const handleMovementClick = (item, type) => {
    setSelectedLot(item);
    setMovementType(type);
    setMovementForm({ quantity: 1, reason: '', document_reference: '' });
    setMovementModal(true);
  };

  const handleMovementSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await createInventoryMovement({
        lot_id: selectedLot.id,
        movement_type: movementType,
        quantity: movementForm.quantity,
        reason: movementForm.reason,
        document_reference: movementForm.document_reference
      });
      setMovementModal(false);
      fetchInventory();
    } catch (err) {
      alert(err.message || 'Error registrando movimiento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleHistoryClick = async (item) => {
    setSelectedLot(item);
    setHistoryModal(true);
    setHistoryLoading(true);
    try {
      const response = await getLotMovements(item.id);
      setMovements(response?.message?.movements || []);
    } catch (err) {
      alert('Error cargando historial de movimientos');
    } finally {
      setHistoryLoading(false);
    }
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
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-primary h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-primary mb-1 fw-bold">{totalItems}</div>
              <small className="text-muted">Lotes Totales</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-success h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-success mb-1 fw-bold">{unidadesDisponibles.toLocaleString()}</div>
              <small className="text-muted">Unidades Disponibles</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-warning h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-warning mb-1 fw-bold">{itemsOptimos}</div>
              <small className="text-muted">Lotes Óptimos</small>
            </div>
          </div>
        </CCol>
        <CCol xs={12} sm={6} lg={3} className="mb-3">
          <div className="card text-center border-danger h-100" style={{minHeight:'90px'}}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="h4 text-danger mb-1 fw-bold">{itemsCriticos}</div>
              <small className="text-muted">Lotes Críticos/Bajos</small>
            </div>
          </div>
        </CCol>
      </CRow>

      <CCard className="medicamento-card">
        <CCardHeader className="medicamento-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilStorage} className="me-2" />
              Control de Inventario
              <HelpButton title="Manual de Usuario – Control de Inventario">
                <div>
                  <p>Gestión del stock físico de medicamentos por lotes y ubicaciones.</p>
                  <h6>Detalle de Inventario</h6>
                  <div className="card p-3 mb-3 bg-light">
                    <div className="row small">
                      <div className="col-3 fw-bold">(1) Medicamento / Lote</div>
                      <div className="col-2 fw-bold">(2) Ubicación</div>
                      <div className="col-2 fw-bold">(3) Cantidades</div>
                      <div className="col-2 fw-bold">(4) Nivel</div>
                      <div className="col-3 fw-bold">(5) Movimientos</div>
                    </div>
                    <hr/>
                    <div className="row small text-muted">
                      <div className="col-3">Aspirina<br/><small>Lote: AS-09</small></div>
                      <div className="col-2">Estante A</div>
                      <div className="col-2">Disponible: 100</div>
                      <div className="col-2"><span className="badge bg-success">Óptimo</span></div>
                      <div className="col-3">➕ ➖ 📋</div>
                    </div>
                  </div>
                  <ol>
                    <li><strong>Med/Lote:</strong> Identificación del producto y su lote específico.</li>
                    <li><strong>Ubicación:</strong> Dónde se almacena físicamente.</li>
                    <li><strong>Cantidades:</strong> Disponible (libre), Reservada (en donaciones pendientes).</li>
                    <li><strong>Nivel:</strong> Indicador visual (Óptimo, Bajo, Agotado).</li>
                    <li><strong>Movimientos:</strong>
                      <ul>
                        <li><strong>➕ (Verde):</strong> Agregar stock directo.</li>
                        <li><strong>➖ (Naranja):</strong> Ajustar/reducir por pérdida o daño.</li>
                        <li><strong>📋 (Azul):</strong> Ver historial de movimientos.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </HelpButton>
            </h5>
          </div>
        </CCardHeader>
        <CCardBody className="medicamento-card-body">
          <div className="medicamento-filters mb-4">
            <CRow className="g-3">
              <CCol md={6}>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                  <CFormInput
                    placeholder="Buscar por medicamento, lote o ubicación..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="medicamento-form-input"
                  />
                  {searchTerm && (
                    <CButton color="secondary" variant="outline" onClick={() => { setSearchTerm(''); setCurrentPage(1); }}>&#x2715;</CButton>
                  )}
                </CInputGroup>
                {searchTerm && <div className="text-muted small mt-1">{filteredInventario.length} resultado(s) de {inventario.length} total</div>}
              </CCol>
              <CCol md={3}>
                <CDropdown>
                  <CDropdownToggle color="secondary" className="w-100">
                    <CIcon icon={cilFilter} className="me-2" />
                    {filterUbicacion === 'TODAS' ? 'Todas Ubicaciones' : filterUbicacion}
                  </CDropdownToggle>
                  <CDropdownMenu className="w-100">
                    {ubicaciones.map((ubic, index) => (
                      <CDropdownItem key={index} onClick={() => { setFilterUbicacion(ubic); setCurrentPage(1); }}>
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
                      <CDropdownItem key={index} onClick={() => { setFilterEstado(estado); setCurrentPage(1); }}>
                        {estado}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
            </CRow>
          </div>

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
                        <CTableDataCell><strong>{item.lot_number}</strong></CTableDataCell>
                        <CTableDataCell>{item.medicine}</CTableDataCell>
                        <CTableDataCell>{item.location}</CTableDataCell>
                        <CTableDataCell>
                          {item.expiration_date ? new Date(item.expiration_date).toLocaleDateString('es-ES') : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell><strong>{item.total_quantity}</strong></CTableDataCell>
                        <CTableDataCell>
                          <strong className={disponible <= minimo ? 'text-danger' : disponible <= minimo * 2 ? 'text-warning' : 'text-success'}>
                            {disponible}
                          </strong>
                        </CTableDataCell>
                        <CTableDataCell><span className="text-warning">{item.reserved_quantity || 0}</span></CTableDataCell>
                        <CTableDataCell><span className="text-info">{item.delivered_quantity || 0}</span></CTableDataCell>
                        <CTableDataCell>{getEstadoStockBadge(item.stock_status)}</CTableDataCell>
                        <CTableDataCell>{getEstadoLoteBadge(item.lot_status)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CProgress className="flex-grow-1 me-2" value={porcentajeStock} color={getProgressColor(porcentajeStock)} style={{ height: '8px' }} />
                            <small className="text-muted">{Math.round(porcentajeStock)}%</small>
                          </div>
                          <div className="small text-muted">Mín: {minimo} | Máx: {maximo}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2 justify-content-center">
                            <CButton color="info" variant="outline" size="sm" onClick={() => handleHistoryClick(item)} title="Ver movimientos históricos">
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
                        <p className="text-muted">No hay elementos en el inventario que coincidan con tu búsqueda</p>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInventario.length)} de {filteredInventario.length} registros
              </div>
              <CPagination>
                <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</CPaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <CPaginationItem key={index + 1} active={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>{index + 1}</CPaginationItem>
                ))}
                <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de Movimiento */}
      <CModal visible={movementModal} onClose={() => setMovementModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{movementType === 'ENTRY' ? 'Agregar Stock' : 'Ajustar Stock'} - {selectedLot?.lot_number}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleMovementSubmit}>
          <CModalBody>
            <CAlert color="info">Medicamento: {selectedLot?.medicine}</CAlert>
            <div className="mb-3">
              <CFormLabel>Cantidad (positiva para agregar, negativa para reducir en ajuste)</CFormLabel>
              <CFormInput 
                type="number" 
                value={movementForm.quantity} 
                onChange={(e) => setMovementForm({...movementForm, quantity: parseInt(e.target.value) || 0})}
                required 
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Motivo / Observación</CFormLabel>
              <CFormInput 
                type="text" 
                value={movementForm.reason} 
                onChange={(e) => setMovementForm({...movementForm, reason: e.target.value})}
                required 
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Referencia de Documento (opcional)</CFormLabel>
              <CFormInput 
                type="text" 
                value={movementForm.document_reference} 
                onChange={(e) => setMovementForm({...movementForm, document_reference: e.target.value})}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setMovementModal(false)}>Cancelar</CButton>
            <CButton color="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <CSpinner size="sm"/> : 'Confirmar'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Modal de Historial */}
      <CModal visible={historyModal} onClose={() => setHistoryModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Movimientos - Lote {selectedLot?.lot_number}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {historyLoading ? (
            <div className="text-center py-4"><CSpinner color="primary"/></div>
          ) : movements.length > 0 ? (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Origen</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Documento / Motivo</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {movements.map(m => {
                  const isEntry = m.movement_type === 'ENTRY';
                  const isExit = m.movement_type === 'EXIT';
                  const origen = isEntry
                    ? (m.document_reference?.startsWith('DON') ? '📦 Donación' : m.document_reference?.startsWith('SOL') ? '🏭 Solicitud Proveedor' : '➕ Entrada Manual')
                    : isExit
                    ? '🚚 Entrega a Beneficiario'
                    : '🔧 Ajuste Manual';
                  return (
                    <CTableRow key={m.id}>
                      <CTableDataCell>{new Date(m.created_at).toLocaleString('es-ES')}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={isEntry ? 'success' : isExit ? 'danger' : 'warning'}>
                          {isEntry ? 'ENTRADA' : isExit ? 'SALIDA' : 'AJUSTE'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell><small>{origen}</small></CTableDataCell>
                      <CTableDataCell>
                        <strong className={m.quantity > 0 ? 'text-success' : 'text-danger'}>
                          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                        </strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {m.document_reference && <div><small className="text-muted">Ref: {m.document_reference}</small></div>}
                        {m.reason}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          ) : (
            <CAlert color="info">No hay movimientos registrados para este lote.</CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setHistoryModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default MedicamentoInventario;