import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Datos quemados para acceso rápido
    if (usuario === 'David' && password === '123') {
      // Guardar en localStorage
      localStorage.setItem('usuarioLogueado', JSON.stringify({
        id: 1,
        usuario: 'David',
        correo: 'david@ejemplo.com'
      }));
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
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
            <label className="form-label">Usuario</label>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="form-input"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
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

          <div className="login-info">
            <p className="demo-credentials">
              <strong>Acceso rápido:</strong><br />
              Usuario: <span className="demo-text">David</span><br />
              Contraseña: <span className="demo-text">123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;