const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const getToken = () => localStorage.getItem('FarmaPatriaToken')

const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

// Traducciones de mensajes comunes del backend a español
const ERROR_TRANSLATIONS = {
  'invalid credentials': 'Usuario o contraseña incorrectos',
  'invalid login or password': 'Usuario o contraseña incorrectos',
  'wrong password': 'La contraseña ingresada es incorrecta',
  'user not found': 'No se encontró una cuenta con ese usuario o correo',
  'email not found': 'No se encontró una cuenta con ese correo electrónico',
  'account is disabled': 'Tu cuenta ha sido deshabilitada. Contacta al administrador',
  'account is suspended': 'Tu cuenta está suspendida temporalmente. Contacta al administrador',
  'account is inactive': 'Tu cuenta está inactiva. Contacta al administrador',
  'user is inactive': 'Tu cuenta está inactiva. Contacta al administrador',
  'user is suspended': 'Tu cuenta está suspendida temporalmente',
  'unauthorized': 'No tienes autorización. Inicia sesión nuevamente',
  'token expired': 'Tu sesión ha expirado. Inicia sesión nuevamente',
  'invalid token': 'Sesión inválida. Inicia sesión nuevamente',
  'forbidden': 'No tienes permisos para realizar esta acción',
  'not found': 'El recurso solicitado no fue encontrado',
  'internal server error': 'Error interno del servidor. Intenta más tarde',
  'bad request': 'Solicitud incorrecta. Verifica los datos ingresados',
  'conflict': 'Ya existe un registro con esos datos',
  'email already exists': 'Ya existe una cuenta con ese correo electrónico',
  'username already exists': 'El nombre de usuario ya está en uso',
  'validation error': 'Error de validación. Verifica los campos del formulario',
  'too many requests': 'Demasiados intentos. Espera un momento antes de reintentar',
  'service unavailable': 'El servicio no está disponible en este momento. Intenta más tarde',
}

const translateApiError = (message) => {
  if (!message || typeof message !== 'string') return 'Ocurrió un error inesperado'
  const lower = message.toLowerCase().trim()
  // Buscar coincidencia exacta primero
  if (ERROR_TRANSLATIONS[lower]) return ERROR_TRANSLATIONS[lower]
  // Buscar coincidencia parcial
  for (const [key, translation] of Object.entries(ERROR_TRANSLATIONS)) {
    if (lower.includes(key)) return translation
  }
  // Si viene en inglés genérico del HTTP status, traducir
  if (lower === 'ok') return message
  // Devolver el mensaje original si no se encontró traducción
  return message
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) {
    const rawMessage = body?.message || body?.error || response.statusText || 'Error en la petición'
    const errorStr = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage)
    throw new Error(translateApiError(errorStr))
  }
  return body
}

const request = async (path, options = {}) => {
  const url = `${API_BASE}${path}`
  try {
    const response = await fetch(url, {
      ...options,
      headers: buildHeaders(options.headers),
    })
    return parseResponse(response)
  } catch (err) {
    // Errores de red (sin internet, servidor caído, timeout, CORS, etc.)
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet o intenta más tarde.')
    }
    if (err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado y fue cancelada. Intenta nuevamente.')
    }
    // Re-lanzar errores ya traducidos del parseResponse
    throw err
  }
}

// ============================================================
// AUTH
// ============================================================
export const login = async ({ email, password }) => {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ login: email, password }),
  })
}

export const registerUser = async (userData) => {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const setToken = (token) => {
  localStorage.setItem('FarmaPatriaToken', token)
}

export const clearToken = () => {
  localStorage.removeItem('FarmaPatriaToken')
}

// ============================================================
// ROLES
// ============================================================
export const getRoles = async () => {
  return request('/roles')
}

// ============================================================
// USUARIOS
// ============================================================
export const getUsers = async () => {
  return request('/users')
}

export const getUserById = async (id) => {
  return request(`/users/${id}`)
}

export const updateUser = async (id, data) => {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteUser = async (id) => {
  return request(`/users/${id}`, { method: 'DELETE' })
}

export const getUserStats = async () => {
  return request('/users/stats')
}

export const getUserProfile = async () => {
  return request('/users/profile')
}

export const updateUserProfile = async (data) => {
  return request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============================================================
// BENEFICIARIOS
// ============================================================
export const getBeneficiaries = async () => {
  return request('/beneficiaries')
}

export const getBeneficiaryById = async (id) => {
  return request(`/beneficiaries/${id}`)
}

export const createBeneficiary = async (data) => {
  return request('/beneficiaries', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateBeneficiary = async (id, data) => {
  return request(`/beneficiaries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteBeneficiary = async (id) => {
  return request(`/beneficiaries/${id}`, { method: 'DELETE' })
}

export const saveBeneficiaryMedicalHistory = async (id, data) => {
  return request(`/beneficiaries/${id}/medical-history`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const saveBeneficiaryMedicines = async (id, data) => {
  return request(`/beneficiaries/${id}/medicines`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const addBeneficiaryDisease = async (id, data) => {
  return request(`/beneficiaries/${id}/diseases`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const addBeneficiaryVulnerability = async (id, data) => {
  return request(`/beneficiaries/${id}/vulnerabilities`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// NUEVA FUNCIÓN: obtener beneficiarios por medicamento
export const getBeneficiariesByMedicine = async (medicineId) => {
  return request(`/beneficiaries/medicine/${medicineId}`)
}

// ============================================================
// MEDICAMENTOS
// ============================================================
export const getMedicines = async () => {
  return request('/medicines')
}

export const getMedicineById = async (id) => {
  return request(`/medicines/${id}`)
}

export const createMedicine = async (data) => {
  return request('/medicines', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateMedicine = async (id, data) => {
  return request(`/medicines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteMedicine = async (id) => {
  return request(`/medicines/${id}`, { method: 'DELETE' })
}

export const getMedicineAlerts = async () => {
  return request('/medicines/alerts')
}

export const getMedicineInventory = async () => {
  return request('/medicines/inventory')
}

export const getLotById = async (id) => {
  return request(`/medicines/lots/${id}`)
}

export const retireLot = async (id) => {
  return request(`/medicines/lots/${id}/retire`, { method: 'PUT' })
}

export const createInventoryMovement = async (data) => {
  return request('/medicines/inventory/movements', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const getLotMovements = async (lotId) => {
  return request(`/medicines/inventory/movements/${lotId}`)
}

// ============================================================
// DONACIONES
// ============================================================
export const getDonations = async () => {
  return request('/donations')
}

export const getDonationById = async (id) => {
  return request(`/donations/${id}`)
}

export const createDonation = async (data) => {
  return request('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateDonation = async (id, data) => {
  return request(`/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteDonation = async (id) => {
  return request(`/donations/${id}`, { method: 'DELETE' })
}

export const getDonors = async () => {
  return request('/donations/donors')
}

export const createDonor = async (data) => {
  return request('/donations/donors', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateDonor = async (id, data) => {
  return request(`/donations/donors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteDonor = async (id) => {
  return request(`/donations/donors/${id}`, { method: 'DELETE' })
}


// ============================================================
// SOLICITUDES
// ============================================================
export const getRequests = async () => {
  return request('/requests')
}

export const getRequestById = async (id) => {
  return request(`/requests/${id}`)
}

export const createRequest = async (data) => {
  return request('/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateRequest = async (id, data) => {
  return request(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============================================================
// ENTREGAS
// ============================================================
export const getDeliveries = async () => {
  return request('/deliveries')
}

export const getDeliveryById = async (id) => {
  return request(`/deliveries/${id}`)
}

export const createDelivery = async (data) => {
  return request('/deliveries', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateDelivery = async (id, data) => {
  return request(`/deliveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const notifyDelivery = async (id) => {
  return request(`/deliveries/${id}/notify`, { method: 'POST' })
}

export const deleteDelivery = async (id) => {
  return request(`/deliveries/${id}`, { method: 'DELETE' })
}

// ============================================================
// CATÁLOGOS AUXILIARES
// ============================================================
export const getCommunities = async () => {
  return request('/catalogs/communities')
}

export const createCommunity = async (data) => {
  return request('/catalogs/communities', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateCommunity = async (id, data) => {
  return request(`/catalogs/communities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteCommunity = async (id) => {
  return request(`/catalogs/communities/${id}`, { method: 'DELETE' })
}

export const getLaboratories = async () => {
  return request('/catalogs/laboratories')
}

export const getPharmaceuticalForms = async () => {
  return request('/catalogs/pharmaceutical-forms')
}

export const getMedicineCategories = async () => {
  return request('/catalogs/medicine-categories')
}

export const getDonorTypes = async () => {
  return request('/catalogs/donor-types')
}

export const getDonationTypes = async () => {
  return request('/catalogs/donation-types')
}

export const getVulnerabilityTypes = async () => {
  return request('/catalogs/vulnerability-types')
}

export const getDiseases = async () => {
  return request('/catalogs/diseases')
}

// ============================================================
// DASHBOARD
// ============================================================
export const getDashboardStats = async () => {
  return request('/dashboard/stats')
}

// ============================================================
// SOLICITUDES A PROVEEDORES
// ============================================================
export const getProviderRequests = async () => {
  return request('/provider-requests')
}

export const getProviderRequestById = async (id) => {
  return request(`/provider-requests/${id}`)
}

export const createProviderRequest = async (data) => {
  return request('/provider-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateProviderRequest = async (id, data) => {
  return request(`/provider-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteProviderRequest = async (id) => {
  return request(`/provider-requests/${id}`, { method: 'DELETE' })
}

export const getProviders = async () => {
  return request('/providers')
}

export const getProviderById = async (id) => {
  return request(`/providers/${id}`)
}

export const createProvider = async (data) => {
  return request('/providers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateProvider = async (id, data) => {
  return request(`/providers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteProvider = async (id) => {
  return request(`/providers/${id}`, { method: 'DELETE' })
}