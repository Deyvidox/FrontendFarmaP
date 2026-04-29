import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setToken } from 'src/services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <div className="login-card">
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

          {/* Right login form panel */}
          <div className="login-form-panel">
            <div className="form-content">
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
                      type="email"
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