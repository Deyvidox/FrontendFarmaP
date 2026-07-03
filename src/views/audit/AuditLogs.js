import React, { useState, useEffect, useCallback } from 'react'
import {
    CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow,
    CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CInputGroup,
    CFormInput, CInputGroupText, CPagination, CPaginationItem, CButton,
    CRow, CCol, CFormSelect, CSpinner, CAlert
} from '@coreui/react'
import { cilHistory, cilSearch, cilFilter, cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getAuditLogs } from 'src/services/api'
import HelpButton from '../../components/common/HelpButton';
import '../../css/audit/AuditLogs.css'

const AuditLogs = () => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterModule, setFilterModule] = useState('')
    const [filterAction, setFilterAction] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const itemsPerPage = 20

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                module: filterModule || undefined,
                action: filterAction || undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined
            }
            const response = await getAuditLogs(params)
            const data = response?.message
            setLogs(data?.logs || [])
            setTotalPages(data?.pagination?.totalPages || 1)
            setTotalRecords(data?.pagination?.total || 0)
        } catch (err) {
            console.error('Error cargando bitácora:', err)
            setError(err.message || 'Error al cargar la bitácora')
        } finally {
            setLoading(false)
        }
    }, [currentPage, filterModule, filterAction, startDate, endDate])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
    }

    const handleClearFilters = () => {
        setFilterModule('')
        setFilterAction('')
        setStartDate('')
        setEndDate('')
        setSearchTerm('')
        setCurrentPage(1)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleString('es-ES')
    }

    const getActionBadge = (action) => {
        const map = {
            'CREATE': 'success',
            'UPDATE': 'warning',
            'DELETE': 'danger',
            'LOGIN': 'info',
            'LOGOUT': 'secondary'
        }
        return <CBadge color={map[action] || 'primary'}>{action}</CBadge>
    }

    const truncateEntityId = (id) => id ? id.substring(0, 8) + '...' : '—'

    const moduleOptions = ['', 'users', 'beneficiaries', 'medicines', 'donations', 'requests', 'deliveries', 'inventories', 'providers', 'donors']
    const actionOptions = ['', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']

    // Filtrar localmente por término de búsqueda
    const filteredLogs = logs.filter(log => {
        if (!searchTerm) return true
        const q = searchTerm.toLowerCase()
        return (
            (log.affected_entity || '').toLowerCase().includes(q) ||
            (log.user_name || '').toLowerCase().includes(q) ||
            (log.client_ip || '').includes(q)
        )
    })

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 d-flex align-items-center">
                        <CIcon icon={cilHistory} className="me-2" />
                        Bitácora de Auditoría
                        <HelpButton title="Manual de Usuario – Bitácora de Auditoría">
                            <div>
                                <p><strong>¿Qué hace esta pantalla?</strong><br />
                                    Registra todas las acciones importantes realizadas en el sistema, permitiendo rastrear quién hizo qué y cuándo.</p>
                                <h6>🧪 Ejemplo de registros</h6>
                                <div className="card p-3 mb-3 bg-light">
                                    <div className="row small">
                                        <div className="col-3 fw-bold">(1) Fecha/Hora</div>
                                        <div className="col-2 fw-bold">(2) Usuario</div>
                                        <div className="col-2 fw-bold">(3) Módulo</div>
                                        <div className="col-2 fw-bold">(4) Acción</div>
                                        <div className="col-3 fw-bold">(5) Entidad</div>
                                    </div>
                                    <hr />
                                    <div className="row small text-muted">
                                        <div className="col-3">12/10/2023 09:30</div>
                                        <div className="col-2">María López</div>
                                        <div className="col-2">medicines</div>
                                        <div className="col-2"><span className="badge bg-success">CREATE</span></div>
                                        <div className="col-3">Medicamento (ID: A1B2...)</div>
                                    </div>
                                </div>
                                <h6>📋 Uso y funcionalidades</h6>
                                <ol>
                                    <li><strong>Filtros por módulo/acción:</strong> Seleccione para ver solo ciertos tipos de eventos.</li>
                                    <li><strong>Rango de fechas:</strong> Acote la búsqueda a un período específico.</li>
                                    <li><strong>Búsqueda por texto:</strong> Busque por nombre de entidad, usuario o IP.</li>
                                    <li><strong>Paginación:</strong> Navegue entre páginas si hay muchos registros.</li>
                                </ol>
                                <p><strong>⚠️ Nota:</strong> Los datos de la bitácora son de solo lectura. No se pueden modificar ni eliminar.</p>
                            </div>
                        </HelpButton>
                    </h5>
                </div>
            </CCardHeader>
            <CCardBody>
                {/* Filtros */}
                <CRow className="mb-3 g-3">
                    <CCol md={2}>
                        <CFormSelect value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                            <option value="">Todos los módulos</option>
                            {moduleOptions.filter(m => m !== '').map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                        <CFormSelect value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
                            <option value="">Todas las acciones</option>
                            {actionOptions.filter(a => a !== '').map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                        <CFormInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Fecha inicio" />
                    </CCol>
                    <CCol md={2}>
                        <CFormInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Fecha fin" />
                    </CCol>
                    <CCol md={4}>
                        <CInputGroup>
                            <CFormInput
                                placeholder="Buscar por entidad, usuario, IP..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                            <CButton color="secondary" variant="outline" onClick={handleClearFilters}>
                                Limpiar
                            </CButton>
                            <CButton color="primary" onClick={handleSearch}>
                                <CIcon icon={cilSearch} />
                            </CButton>
                        </CInputGroup>
                    </CCol>
                </CRow>

                {/* Tabla */}
                {loading ? (
                    <div className="text-center py-5"><CSpinner color="primary" /><p>Cargando bitácora...</p></div>
                ) : error ? (
                    <CAlert color="danger">{error}</CAlert>
                ) : (
                    <>
                        <div className="text-muted small mb-2">{totalRecords} registros encontrados</div>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                                    <CTableHeaderCell>Usuario</CTableHeaderCell>
                                    <CTableHeaderCell>Módulo</CTableHeaderCell>
                                    <CTableHeaderCell>Acción</CTableHeaderCell>
                                    <CTableHeaderCell>Entidad</CTableHeaderCell>
                                    <CTableHeaderCell>ID Entidad</CTableHeaderCell>
                                    <CTableHeaderCell>IP</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map(log => (
                                        <CTableRow key={log.id}>
                                            <CTableDataCell><small>{formatDate(log.created_at)}</small></CTableDataCell>
                                            <CTableDataCell>{log.user_name || log.user_email || 'Sistema'}</CTableDataCell>
                                            <CTableDataCell>{log.module}</CTableDataCell>
                                            <CTableDataCell>{getActionBadge(log.action)}</CTableDataCell>
                                            <CTableDataCell>{log.affected_entity}</CTableDataCell>
                                            <CTableDataCell><small>{truncateEntityId(log.entity_id)}</small></CTableDataCell>
                                            <CTableDataCell>{log.client_ip || '—'}</CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan="7" className="text-center py-4">
                                            No se encontraron registros de auditoría.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-3">
                                <CPagination>
                                    <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</CPaginationItem>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <CPaginationItem key={i + 1} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</CPaginationItem>
                                    ))}
                                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</CPaginationItem>
                                </CPagination>
                            </div>
                        )}
                    </>
                )}
            </CCardBody>
        </CCard>
    )
}

export default AuditLogs