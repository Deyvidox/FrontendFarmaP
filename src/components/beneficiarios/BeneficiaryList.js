import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilMedicalCross, cilSearch, cilPencil, cilTrash, cilWarning, cilFilter, cilHeart, cilInfo } from '@coreui/icons';
import { getBeneficiaryById, updateBeneficiary, deleteBeneficiary, getMedicines, saveBeneficiaryMedicalHistory, saveBeneficiaryMedicines } from 'src/services/api';
import '../../css/beneficiarios/Beneficiaries.css';
import HelpButton from '../common/HelpButton';
import ToastNotification from '../common/ToastNotification';

const BeneficiaryList = ({ beneficiaries, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('nombre');

  const CRITERIA_OPTIONS = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'cedula', label: 'Cédula' },
    { value: 'comunidad', label: 'Comunidad' },
    { value: 'prioridad', label: 'Prioridad' },
  ];

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    switch (searchCriteria) {
      case 'cedula': return (b.identification_number || '').toLowerCase().includes(q);
      case 'comunidad': return (b.community_name || '').toLowerCase().includes(q);
      case 'prioridad': return (b.priority_level || '').toLowerCase().includes(q);
      case 'nombre':
      default:
        return `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase().includes(q);
    }
  });

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBenef, setSelectedBenef] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: false, message: '', type })
    setTimeout(() => setToast({ show: true, message, type }), 20)
  };
  const [modalTab, setModalTab] = useState('enfermedades');
  const [detailModal, setDetailModal] = useState(false);

  const [medicinesCatalog, setMedicinesCatalog] = useState([]);
  const [editEnfermedades, setEditEnfermedades] = useState([]);
  const [editMedicamentos, setEditMedicamentos] = useState([]);

  const [nuevaEnfermedad, setNuevaEnfermedad] = useState('');
  const [estadoEnfermedad, setEstadoEnfermedad] = useState('ESTABLE');
  const [obsEnfermedad, setObsEnfermedad] = useState('');

  const [selectedMedId, setSelectedMedId] = useState('');
  const [dosisInput, setDosisInput] = useState('');

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const medRes = await getMedicines();
        setMedicinesCatalog(medRes?.message?.medicines || []);
      } catch (err) {
        console.error('Error cargando catálogo de medicinas:', err);
      }
    };
    fetchCatalogs();
  }, []);

  const getPriorityColor = (priority) => {
    if (!priority) return 'secondary';
    switch (priority.toUpperCase()) {
      case 'HIGH': case 'ALTA': return 'danger';
      case 'MEDIUM': case 'MEDIA': return 'warning';
      case 'LOW': case 'BAJA': return 'success';
      default: return 'secondary';
    }
  };

  const handleViewClick = async (benef) => {
    setModalLoading(true);
    setViewModal(true);
    try {
      const res = await getBeneficiaryById(benef.id);
      const fullData = res?.message?.beneficiary || {};
      setSelectedBenef({
        ...benef,
        ...fullData,
        enfermedades: fullData.enfermedades || benef.enfermedades || [],
        vulnerabilidades: fullData.vulnerabilidades || benef.vulnerabilidades || [],
        medicinas_requeridas: fullData.medicinas_requeridas || benef.medicinas_requeridas || []
      });
    } catch (err) {
      setSelectedBenef({
        ...benef,
        enfermedades: benef.enfermedades || [],
        vulnerabilidades: benef.vulnerabilidades || [],
        medicinas_requeridas: benef.medicinas_requeridas || []
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDetailClick = (benef) => {
    setSelectedBenef(benef);
    setDetailModal(true);
  };

  const handleEditClick = async (benef) => {
    setModalLoading(true);
    setEditModal(true);
    try {
      const res = await getBeneficiaryById(benef.id);
      const b = res?.message?.beneficiary || benef;
      setSelectedBenef(b);
      setEditForm({
        identification_number: b.identification_number || '',
        first_name: b.first_name || '',
        last_name: b.last_name || '',
        birth_date: b.birth_date ? b.birth_date.split('T')[0] : '',
        gender: b.gender || '',
        phone_personal: b.phone_personal || '',
        email: b.email || '',
        detailed_address: b.detailed_address || '',
        emergency_contact: b.emergency_contact || '',
        emergency_phone: b.emergency_phone || '',
        dependents: b.dependents || 0,
        occupation: b.occupation || '',
        priority_level: b.priority_level || 'Low',
        community_id: b.community_id || ''
      });
      setEditEnfermedades((b.enfermedades || []).map(e => ({
        nombre: e.nombre,
        estado: e.estado || 'ESTABLE',
        observaciones: e.observaciones || ''
      })));
      setEditMedicamentos((b.medicinas_requeridas || []).map(m => ({
        medicine_id: m.medicine_id,
        nombre_comercial: m.nombre_comercial,
        nombre_generico: m.nombre_generico,
        dosis: m.dosis || ''
      })));
      setNuevaEnfermedad('');
      setEstadoEnfermedad('ESTABLE');
      setObsEnfermedad('');
      setSelectedMedId('');
      setDosisInput('');
    } catch (err) {
      setSelectedBenef(benef);
      setEditForm({
        identification_number: benef.identification_number || '',
        first_name: benef.first_name || '',
        last_name: benef.last_name || '',
        birth_date: '',
        gender: benef.gender || '',
        phone_personal: benef.phone_personal || '',
        email: benef.email || '',
        detailed_address: '',
        emergency_contact: '',
        emergency_phone: '',
        dependents: 0,
        occupation: '',
        priority_level: benef.priority_level || 'Low',
        community_id: benef.community_id || ''
      });
      setEditEnfermedades([]);
      setEditMedicamentos([]);
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
      await updateBeneficiary(selectedBenef.id, editForm);

      try {
        await saveBeneficiaryMedicalHistory(selectedBenef.id, {
          diseases: editEnfermedades.map(e => ({
            disease_id: e.nombre,
            current_status: e.estado,
            observations: e.observaciones
          })),
          vulnerabilities: selectedBenef.vulnerabilidades ? selectedBenef.vulnerabilidades.map(v => ({
            vulnerability_type_id: v.vulnerability_type_id,
            observations: v.observaciones
          })) : []
        });

        if (editMedicamentos.length >= 0) {
          await saveBeneficiaryMedicines(selectedBenef.id, {
            medicines: editMedicamentos.map(m => ({
              medicine_id: m.medicine_id,
              dosage_instructions: m.dosis
            }))
          });
        }
      } catch (medicalErr) {
        console.error("Error guardando datos médicos", medicalErr);
      }

      setEditModal(false);
      if (onRefresh) onRefresh();
      showToast('Beneficiario actualizado exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error actualizando beneficiario', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEnfermedad = () => {
    if (!nuevaEnfermedad.trim()) return;
    setEditEnfermedades([...editEnfermedades, {
      nombre: nuevaEnfermedad.trim(),
      estado: estadoEnfermedad,
      observaciones: obsEnfermedad.trim()
    }]);
    setNuevaEnfermedad('');
    setEstadoEnfermedad('ESTABLE');
    setObsEnfermedad('');
  };

  const handleRemoveEnfermedad = (index) => {
    setEditEnfermedades(editEnfermedades.filter((_, i) => i !== index));
  };

  const handleAddMedicamento = () => {
    if (!selectedMedId) return;
    if (editMedicamentos.find(m => m.medicine_id === selectedMedId)) return;
    const medObj = medicinesCatalog.find(m => m.id === selectedMedId);
    setEditMedicamentos([...editMedicamentos, {
      medicine_id: medObj.id,
      nombre_comercial: medObj.commercial_name,
      nombre_generico: medObj.generic_name,
      dosis: dosisInput.trim()
    }]);
    setSelectedMedId('');
    setDosisInput('');
  };

  const handleRemoveMedicamento = (medicineId) => {
    setEditMedicamentos(editMedicamentos.filter(m => m.medicine_id !== medicineId));
  };

  const handleDeleteClick = (benef) => {
    setSelectedBenef(benef);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteBeneficiary(selectedBenef.id);
      setDeleteModal(false);
      if (onRefresh) onRefresh();
      showToast('Beneficiario eliminado exitosamente', 'success');
    } catch (err) {
      showToast(err.message || 'Error eliminando beneficiario', 'danger');
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
      <CCard className="beneficiary-card">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Lista de Beneficiarios
            <HelpButton title="Manual de Usuario – Lista de Beneficiarios">
              <div>
                <p><strong>¿Qué hace esta pantalla?</strong><br />
                  Muestra todos los beneficiarios registrados. Permite buscar, filtrar y realizar acciones como ver detalle, editar o eliminar.</p>
                <h6>🧪 Ejemplo de cómo se ve la tabla</h6>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f8f9fa', color: '#212529', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#e9ecef' }}>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Cédula</th>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Nombre Completo</th>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Comunidad</th>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Teléfono</th>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Prioridad</th>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Estado</th>
                        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>V-11111111</td>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Rosa Flores <br /><small style={{ color: '#6c757d' }}>Edad: 76 años</small></td>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>Barrio 23 de Enero, Libertador</td>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>+584121111111</td>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#fd7e14', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>MEDIA</span></td>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}><span style={{ background: '#198754', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Activo</span></td>
                        <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>👁️ ✏️ 🗑️</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '0.85rem', marginTop: '5px' }}><em>La tabla incluye paginación y muestra 5 registros por página. Filtre con la barra de búsqueda superior.</em></p>
                <h6>📋 Uso y funcionalidades</h6>
                <ol>
                  <li><strong>Barra de búsqueda:</strong> Escriba parte del nombre, cédula o comunidad. La tabla se filtra automáticamente tras 300ms. Mínimo 2 caracteres.</li>
                  <li><strong>Columnas:</strong>
                    <ul>
                      <li><strong>Cédula:</strong> Documento de identidad único. No editable desde aquí.</li>
                      <li><strong>Nombre Completo + Edad:</strong> Calculada automáticamente desde la fecha de nacimiento.</li>
                      <li><strong>Comunidad:</strong> Sector y municipio asignados.</li>
                      <li><strong>Teléfono:</strong> Principal de contacto.</li>
                      <li><strong>Prioridad:</strong> ALTA (rojo), MEDIA (naranja), BAJA (verde). Indica urgencia de atención.</li>
                      <li><strong>Estado:</strong> Activo (verde) o Inactivo (gris). Solo los activos reciben entregas.</li>
                    </ul>
                  </li>
                  <li><strong>Acciones por fila:</strong>
                    <ul>
                      <li><strong>👁️ Ver:</strong> Abre un modal con todos los datos del beneficiario, incluyendo enfermedades y medicamentos asignados. Solo lectura.</li>
                      <li><strong>✏️ Editar:</strong> Permite modificar cualquier campo del beneficiario. Sigue las mismas validaciones del formulario de registro.</li>
                      <li><strong>🗑️ Eliminar:</strong> Cambia el estado a "Inactivo". No se borra físicamente. Se requiere confirmación. Los beneficiarios inactivos no aparecen en nuevas entregas.</li>
                    </ul>
                  </li>
                  <li><strong>Ordenamiento:</strong> Haga clic en los encabezados de columna (Cédula, Nombre, Prioridad) para ordenar ascendente/descendente.</li>
                  <li><strong>Paginación:</strong> Navegue entre páginas con los botones "Anterior" y "Siguiente". La etiqueta "Mostrando X de Y beneficiarios" indica el total.</li>
                </ol>
                <p><strong>⚠️ Nota:</strong> No se puede eliminar un beneficiario que tenga entregas pendientes. Debe cancelar esas entregas primero.</p>
              </div>
            </HelpButton>
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3} xs={12} className="mb-2 mb-md-0">
              <CFormSelect
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
              >
                {CRITERIA_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={9} xs={12}>
              <CInputGroup>
                <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                <CFormInput
                  placeholder={`Buscar por ${CRITERIA_OPTIONS.find(o => o.value === searchCriteria)?.label || 'nombre'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <CButton color="secondary" variant="outline" onClick={() => setSearchTerm('')}>&#x2715;</CButton>
                )}
              </CInputGroup>
            </CCol>
          </CRow>
          {searchTerm && (
            <div className="text-muted small mb-2">
              {filteredBeneficiaries.length} resultado(s) encontrado(s) de {beneficiaries.length} total
            </div>
          )}
          <CTable hover responsive className="beneficiary-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Cédula</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nombre Completo</CTableHeaderCell>
                <CTableHeaderCell scope="col">Comunidad</CTableHeaderCell>
                <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                <CTableHeaderCell scope="col">Prioridad</CTableHeaderCell>
                <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredBeneficiaries.map((beneficiary) => (
                <CTableRow key={beneficiary.id}>
                  <CTableDataCell data-label="Cédula">
                    <strong>{beneficiary.identification_number}</strong>
                  </CTableDataCell>
                  <CTableDataCell data-label="Nombre">
                    {beneficiary.first_name} {beneficiary.last_name}
                    {beneficiary.age !== null && beneficiary.age !== undefined && (
                      <div className="text-muted small">Edad: {beneficiary.age} años</div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell data-label="Comunidad">
                    {beneficiary.community_name || 'N/A'}
                    {beneficiary.municipality && (
                      <div className="text-muted small">{beneficiary.municipality}</div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell data-label="Teléfono">{beneficiary.phone_personal || 'N/A'}</CTableDataCell>
                  <CTableDataCell data-label="Prioridad">
                    <CBadge color={getPriorityColor(beneficiary.priority_level)}>
                      {(() => {
                        const p = beneficiary.priority_level || '';
                        if (p.toUpperCase() === 'HIGH') return 'ALTA';
                        if (p.toUpperCase() === 'MEDIUM') return 'MEDIA';
                        if (p.toUpperCase() === 'LOW') return 'BAJA';
                        return p;
                      })()}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell data-label="Estado">
                    <span className={`beneficiary-status ${(beneficiary.status || 'Active').toLowerCase()}`}>
                      {(() => {
                        const s = beneficiary.status || 'Active';
                        if (s.toLowerCase() === 'active') return 'Activo';
                        if (s.toLowerCase() === 'inactive') return 'Inactivo';
                        return s;
                      })()}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell data-label="Acciones">
                    <div className="d-flex gap-1">
                      <CButton color="info" variant="outline" size="sm" className="beneficiary-action-btn-secondary"
                        title="Ver Detalles" onClick={() => handleDetailClick(beneficiary)}>
                        <CIcon icon={cilInfo} />
                      </CButton>
                      <CButton color="warning" variant="outline" size="sm" className="beneficiary-action-btn-secondary"
                        title="Editar" onClick={() => handleEditClick(beneficiary)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" variant="outline" size="sm" className="beneficiary-action-btn-secondary"
                        title="Eliminar" onClick={() => handleDeleteClick(beneficiary)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {filteredBeneficiaries.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center py-4 text-muted">
                    {searchTerm ? `No se encontraron beneficiarios con el criterio "${searchTerm}"` : 'No hay beneficiarios registrados'}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Ver Datos Médicos (Planilla) */}
      <CModal size="lg" visible={viewModal} onClose={() => setViewModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilMedicalCross} className="me-2" />
            Planilla – {selectedBenef?.first_name} {selectedBenef?.last_name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /></div>
          ) : selectedBenef ? (
            <CTabs activeTab={modalTab} onActiveTabChange={setModalTab}>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink data-tab="enfermedades">
                    <CIcon icon={cilMedicalCross} className="me-1" />
                    Enfermedades ({(selectedBenef.enfermedades || []).length})
                  </CNavLink>
                </CNavItem>

                <CNavItem>
                  <CNavLink data-tab="medicamentos">
                    <CIcon icon={cilHeart} className="me-1" />
                    Medicamentos ({(selectedBenef.medicinas_requeridas || []).length})
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane data-tab="enfermedades">
                  {selectedBenef.enfermedades && selectedBenef.enfermedades.length > 0 ? (
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Enfermedad</CTableHeaderCell>
                          <CTableHeaderCell>Estado</CTableHeaderCell>
                          <CTableHeaderCell>Observaciones</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {selectedBenef.enfermedades.map((e, i) => (
                          <CTableRow key={e.id || i}>
                            <CTableDataCell>{e.nombre}</CTableDataCell>
                            <CTableDataCell><CBadge color="info">{e.estado || 'ESTABLE'}</CBadge></CTableDataCell>
                            <CTableDataCell className="small text-muted">{e.observaciones || '—'}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  ) : (
                    <p className="text-muted">Sin enfermedades registradas.</p>
                  )}
                </CTabPane>

                <CTabPane data-tab="medicamentos">
                  {selectedBenef.medicinas_requeridas && selectedBenef.medicinas_requeridas.length > 0 ? (
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Nombre Comercial</CTableHeaderCell>
                          <CTableHeaderCell>Nombre Genérico</CTableHeaderCell>
                          <CTableHeaderCell>Dosis</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {selectedBenef.medicinas_requeridas.map((m, i) => (
                          <CTableRow key={m.id || i}>
                            <CTableDataCell>{m.nombre_comercial}</CTableDataCell>
                            <CTableDataCell>{m.nombre_generico}</CTableDataCell>
                            <CTableDataCell>{m.dosis || '—'}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  ) : (
                    <p className="text-muted">Sin medicamentos requeridos.</p>
                  )}
                </CTabPane>
              </CTabContent>
            </CTabs>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Detalle */}
      <CModal size="lg" visible={detailModal} onClose={() => setDetailModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilInfo} className="me-2" />Detalle – {selectedBenef?.first_name} {selectedBenef?.last_name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBenef ? (
            <CRow className="g-3">
              <CCol md={6}>
                <div className="mb-2"><strong>Cédula / Identificación:</strong> {selectedBenef.identification_number || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Nombre:</strong> {selectedBenef.first_name || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Apellido:</strong> {selectedBenef.last_name || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Fecha Nacimiento:</strong> {selectedBenef.birth_date || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Género:</strong> {selectedBenef.gender || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Prioridad:</strong> {selectedBenef.priority_level || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Teléfono:</strong> {selectedBenef.phone_personal || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Email:</strong> {selectedBenef.email || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Contacto de Emergencia:</strong> {selectedBenef.emergency_contact || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Teléfono Emergencia:</strong> {selectedBenef.emergency_phone || '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Dependientes:</strong> {selectedBenef.dependents ?? '—'}</div>
              </CCol>
              <CCol md={6}>
                <div className="mb-2"><strong>Profesión/Trabajo:</strong> {selectedBenef.occupation || '—'}</div>
              </CCol>
              <CCol md={12}>
                <div className="mb-2"><strong>Dirección Detallada:</strong> {selectedBenef.detailed_address || '—'}</div>
              </CCol>
            </CRow>
          ) : (
            <p className="text-muted">Cargando datos...</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailModal(false)}>Cerrar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar */}
      <CModal size="lg" visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader>
          <CModalTitle><CIcon icon={cilPencil} className="me-2" />Editar Beneficiario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /></div>
          ) : (
            <CForm id="edit-beneficiary-form" onSubmit={submitEdit}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Cédula / Identificación</CFormLabel>
                    <CFormInput name="identification_number" value={editForm.identification_number || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-3">
                    <CFormLabel>Nombre *</CFormLabel>
                    <CFormInput name="first_name" value={editForm.first_name || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-3">
                    <CFormLabel>Apellido *</CFormLabel>
                    <CFormInput name="last_name" value={editForm.last_name || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Fecha Nacimiento *</CFormLabel>
                    <CFormInput type="date" name="birth_date" value={editForm.birth_date || ''} onChange={handleEditChange} required />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Género *</CFormLabel>
                    <CFormSelect name="gender" value={editForm.gender || ''} onChange={handleEditChange} required>
                      <option value="">Seleccione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Prioridad *</CFormLabel>
                    <CFormSelect name="priority_level" value={editForm.priority_level || 'Low'} onChange={handleEditChange} required>
                      <option value="Low">Baja</option>
                      <option value="Medium">Media</option>
                      <option value="High">Alta</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Teléfono *</CFormLabel>
                    <CFormInput name="phone_personal" value={editForm.phone_personal || ''} onChange={handleEditChange} required />
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
                    <CFormLabel>Contacto de Emergencia</CFormLabel>
                    <CFormInput name="emergency_contact" value={editForm.emergency_contact || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Teléfono Emergencia</CFormLabel>
                    <CFormInput name="emergency_phone" value={editForm.emergency_phone || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Dependientes</CFormLabel>
                    <CFormInput type="number" name="dependents" value={editForm.dependents || 0} onChange={handleEditChange} min="0" />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Profesión/Trabajo</CFormLabel>
                    <CFormInput type="text" name="occupation" value={editForm.occupation || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
                <CCol md={12}>
                  <div className="mb-3">
                    <CFormLabel>Dirección Detallada</CFormLabel>
                    <CFormInput name="detailed_address" value={editForm.detailed_address || ''} onChange={handleEditChange} />
                  </div>
                </CCol>
              </CRow>

              <h6 className="mt-4 border-bottom pb-2">
                <CIcon icon={cilMedicalCross} className="me-2" />
                Enfermedades
              </h6>
              <CRow className="align-items-end mb-3">
                <CCol md={4}>
                  <div className="mb-2">
                    <CFormLabel>Enfermedad</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Ej: Hipertensión..."
                      value={nuevaEnfermedad}
                      onChange={(e) => setNuevaEnfermedad(e.target.value)}
                    />
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-2">
                    <CFormLabel>Estado</CFormLabel>
                    <CFormSelect value={estadoEnfermedad} onChange={(e) => setEstadoEnfermedad(e.target.value)}>
                      <option value="ESTABLE">Estable</option>
                      <option value="MODERADO">Moderado</option>
                      <option value="GRAVE">Grave</option>
                      <option value="CRÍTICO">Crítico</option>
                      <option value="CONTROLADO">Controlado</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="mb-2">
                    <CFormLabel>Observaciones</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Detalles (opcional)"
                      value={obsEnfermedad}
                      onChange={(e) => setObsEnfermedad(e.target.value)}
                    />
                  </div>
                </CCol>
                <CCol md={2}>
                  <div className="mb-2">
                    <CButton color="success" className="w-100 text-white" type="button" onClick={handleAddEnfermedad}>
                      Agregar
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              {editEnfermedades.length > 0 && (
                <div className="mb-3">
                  {editEnfermedades.map((enf, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border">
                      <div>
                        <span className="fw-bold">{enf.nombre}</span>
                        <CBadge color={enf.estado === 'CRÍTICO' ? 'danger' : enf.estado === 'GRAVE' ? 'warning' : enf.estado === 'MODERADO' ? 'info' : 'success'} className="ms-2">{enf.estado}</CBadge>
                        {enf.observaciones && <small className="text-muted ms-2">— {enf.observaciones}</small>}
                      </div>
                      <CButton color="danger" variant="ghost" size="sm" type="button" onClick={() => handleRemoveEnfermedad(i)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  ))}
                </div>
              )}

              <h6 className="mt-4 border-bottom pb-2">
                <CIcon icon={cilMedicalCross} className="me-2" />
                Medicamentos Requeridos
              </h6>
              <CRow className="align-items-end mb-3">
                <CCol md={5}>
                  <div className="mb-2">
                    <CFormLabel>Medicamento</CFormLabel>
                    <CFormSelect value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)}>
                      <option value="">Seleccione medicamento...</option>
                      {medicinesCatalog.map(m => (
                        <option key={m.id} value={m.id}>{m.commercial_name} ({m.generic_name})</option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={5}>
                  <div className="mb-2">
                    <CFormLabel>Dosificación</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Ej: 1 tableta cada 8 horas"
                      value={dosisInput}
                      onChange={(e) => setDosisInput(e.target.value)}
                    />
                  </div>
                </CCol>
                <CCol md={2}>
                  <div className="mb-2">
                    <CButton color="success" className="w-100 text-white" type="button" onClick={handleAddMedicamento}>
                      Agregar
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              {editMedicamentos.length > 0 && (
                <div className="mb-3">
                  {editMedicamentos.map((med) => (
                    <div key={med.medicine_id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border">
                      <div>
                        <span className="fw-bold">{med.nombre_comercial}</span>
                        <small className="text-muted ms-2">({med.nombre_generico})</small>
                        {med.dosis && <span className="text-primary ms-2">— {med.dosis}</span>}
                      </div>
                      <CButton color="danger" variant="ghost" size="sm" type="button" onClick={() => handleRemoveMedicamento(med.medicine_id)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  ))}
                </div>
              )}
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>Cancelar</CButton>
          <CButton color="primary" type="submit" form="edit-beneficiary-form" disabled={actionLoading || modalLoading}>
            {actionLoading ? <><CSpinner size="sm" className="me-1" />Guardando...</> : 'Guardar Cambios'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Eliminar */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle><CIcon icon={cilTrash} className="me-2" />Eliminar Beneficiario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBenef && (
            <p>¿Deseas eliminar al beneficiario <strong>{selectedBenef.first_name} {selectedBenef.last_name}</strong>? Su estado cambiará a <strong>Inactivo</strong>.</p>
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

export default BeneficiaryList;