import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setToken } from 'src/services/api';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

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
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">FarmaPatria</h2>
          <p className="login-subtitle">Sistema de Gestión</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="form-input"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-button-container">
            <button type="submit" className="login-btn">
              Iniciar Sesión
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;