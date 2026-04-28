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
    credentials: 'include',
    ...options,
    headers: buildHeaders(options.headers),
  })
  return parseResponse(response)
}

export const login = async ({ email, password }) => {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export const registerUser = async (userData) => {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const getBeneficiaries = async () => {
  return request('/api/beneficiaries/beneficiaries')
}

export const createBeneficiary = async (beneficiaryData) => {
  return request('/api/beneficiaries/register', {
    method: 'POST',
    body: JSON.stringify(beneficiaryData),
  })
}

export const createRequest = async (requestData) => {
  return request('/api/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  })
}

export const getRoles = async () => {
  return request('/roles')
}

export const setToken = (token) => {
  localStorage.setItem('FarmaPatriaToken', token)
}

export const clearToken = () => {
  localStorage.removeItem('FarmaPatriaToken')
}
