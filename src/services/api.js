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

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) {
    const errorMessage = body?.message || body?.error || response.statusText || 'Error en la petición'
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage))
  }
  return body
}

const request = async (path, options = {}) => {
  const url = `${API_BASE}${path}`
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers),
  })
  return parseResponse(response)
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
  return request('/provider-requests/providers')
}
