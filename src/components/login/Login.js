import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setToken, registerUser, getRoles } from 'src/services/api';
import '../../css/login/Login.css';

const Login = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Register state
  const [regForm, setRegForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    identification_number: '',
    date_of_birth: '',
    phone: '',
    address: '',
    role_id: '',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // Cargar roles al montar
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        const rolesData = response?.message?.roles || [];
        setRoles(rolesData);
        if (rolesData.length > 0) {
          setRegForm((prev) => ({ ...prev, role_id: rolesData[0].id }));
        }
      } catch (err) {
        // Silenciar error de roles — no bloquear el flujo
      }
    };
    fetchRoles();
  }, []);

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      const token = response?.message?.token;
      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }
      setToken(token);
      localStorage.setItem('FarmaPatriaUser', JSON.stringify({ email }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);

    try {
      await registerUser(regForm);
      setRegSuccess('Usuario registrado exitosamente. Ya puedes iniciar sesión.');
      setRegForm({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        identification_number: '',
        date_of_birth: '',
        phone: '',
        address: '',
        role_id: roles.length > 0 ? roles[0].id : '',
      });
      // Cambiar al login después de 2 segundos
      setTimeout(() => {
        setActiveTab('login');
        setRegSuccess('');
      }, 2000);
    } catch (err) {
      setRegError(err.message || 'Error al registrar usuario');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-container">
        <div className={`login-card ${activeTab === 'register' ? 'login-card--register' : ''}`}>
          {/* Left decorative panel */}
          <div className="login-brand-panel">
            <div className="brand-content">
              <div className="brand-logo-wrapper">
                <img src="/logo.png" alt="FarmaPatria Logo" className="brand-logo" />
              </div>
              <h1 className="brand-title">FarmaPatria</h1>
              <p className="brand-tagline">Sistema de Gestión de Donaciones Farmacéuticas</p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">💊</span>
                  <span className="feature-text">Control de Medicamentos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span className="feature-text">Gestión de Beneficiarios</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📦</span>
                  <span className="feature-text">Seguimiento de Entregas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="login-form-panel">
            <div className="form-content">
              {/* Tab switcher */}
              <div className="auth-tabs" id="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
                  onClick={() => { setActiveTab('login'); setRegError(''); setRegSuccess(''); }}
                  id="tab-login"
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  id="tab-register"
                >
                  Crear Usuario
                </button>
              </div>

              {/* ===== LOGIN FORM ===== */}
              {activeTab === 'login' && (
                <div className="auth-panel" key="login-panel">
                  <div className="form-header">
                    <h2 className="form-title">Bienvenido</h2>
                    <p className="form-subtitle">Ingresa tus credenciales para acceder</p>
                  </div>

                  <form className="login-form" onSubmit={handleLogin} id="login-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="login-email">Correo electrónico</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                          id="login-email"
                          type="text"
                          className="form-input"
                          placeholder="correo@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="login-password">Contraseña</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Ingresa tu contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          id="toggle-password"
                        >
                          {showPassword ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="error-alert" role="alert" id="login-error">
                        <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
                      disabled={loading}
                      id="login-submit"
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          <span>Ingresando...</span>
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ===== REGISTER FORM ===== */}
              {activeTab === 'register' && (
                <div className="auth-panel" key="register-panel">
                  <div className="form-header">
                    <h2 className="form-title">Crear Usuario</h2>
                    <p className="form-subtitle">Completa los datos para registrar un nuevo usuario</p>
                  </div>

                  <form className="login-form register-form" onSubmit={handleRegister} id="register-form">
                    {/* Nombre y Apellido en fila */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-first-name">Nombre</label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <input
                            id="reg-first-name"
                            type="text"
                            className="form-input"
                            placeholder="Nombre"
                            name="first_name"
                            value={regForm.first_name}
                            onChange={handleRegChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-last-name">Apellido</label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <input
                            id="reg-last-name"
                            type="text"
                            className="form-input"
                            placeholder="Apellido"
                            name="last_name"
                            value={regForm.last_name}
                            onChange={handleRegChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-username">Usuario</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                          id="reg-username"
                          type="text"
                          className="form-input"
                          placeholder="nombre_usuario"
                          name="username"
                          value={regForm.username}
                          onChange={handleRegChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-email">Correo electrónico</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                          id="reg-email"
                          type="email"
                          className="form-input"
                          placeholder="correo@ejemplo.com"
                          name="email"
                          value={regForm.email}
                          onChange={handleRegChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Contraseña */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-password">Contraseña</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                          id="reg-password"
                          type={showRegPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Mínimo 8 caracteres"
                          name="password"
                          value={regForm.password}
                          onChange={handleRegChange}
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password-btn"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          aria-label={showRegPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          id="toggle-reg-password"
                        >
                          {showRegPassword ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Cédula */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-identification">Cédula / Identificación</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        <input
                          id="reg-identification"
                          type="text"
                          className="form-input"
                          placeholder="V-12345678"
                          name="identification_number"
                          value={regForm.identification_number}
                          onChange={handleRegChange}
                        />
                      </div>
                    </div>

                    {/* Fecha de nacimiento y Teléfono en fila */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-dob">Fecha de Nacimiento</label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <input
                            id="reg-dob"
                            type="date"
                            className="form-input"
                            name="date_of_birth"
                            value={regForm.date_of_birth}
                            onChange={handleRegChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-phone">Teléfono</label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <input
                            id="reg-phone"
                            type="text"
                            className="form-input"
                            placeholder="0412-1234567"
                            name="phone"
                            value={regForm.phone}
                            onChange={handleRegChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-address">Dirección</label>
                      <div className="input-wrapper">
                        <svg className="input-icon input-icon--top" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <input
                          id="reg-address"
                          type="text"
                          className="form-input"
                          placeholder="Dirección completa"
                          name="address"
                          value={regForm.address}
                          onChange={handleRegChange}
                        />
                      </div>
                    </div>

                    {/* Rol */}
                    {roles.length > 0 && (
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-role">Rol</label>
                        <div className="input-wrapper">
                          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <select
                            id="reg-role"
                            className="form-input form-select"
                            name="role_id"
                            value={regForm.role_id}
                            onChange={handleRegChange}
                            required
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {regError && (
                      <div className="error-alert" role="alert" id="register-error">
                        <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <span>{regError}</span>
                      </div>
                    )}

                    {regSuccess && (
                      <div className="success-alert" role="alert" id="register-success">
                        <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="9 12 12 15 16 10" />
                        </svg>
                        <span>{regSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`login-btn ${regLoading ? 'login-btn--loading' : ''}`}
                      disabled={regLoading}
                      id="register-submit"
                    >
                      {regLoading ? (
                        <>
                          <span className="spinner"></span>
                          <span>Registrando...</span>
                        </>
                      ) : (
                        'Crear Usuario'
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="form-footer">
                <p className="footer-text">
                  © {new Date().getFullYear()} FarmaPatria. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;