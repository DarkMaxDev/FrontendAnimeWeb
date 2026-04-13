import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import API from '../api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      
      // Limpieza de seguridad
      localStorage.clear();
      
      // Guardado consistente
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // Importante: que el backend envíe 'admin'
      localStorage.setItem('user', JSON.stringify(res.data.user || { role: res.data.role }));
      
      navigate('/'); 
      window.location.reload(); 
    } catch (err) {
      alert('Error: Credenciales incorrectas.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2>INICIAR SESIÓN</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <Mail size={18} className="input-icon-login" />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className="login-input"
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="login-input-group">
            <Lock size={18} className="input-icon-login" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="login-input"
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            <LogIn size={18} style={{ marginRight: '8px' }} />
            ENTRAR
          </button>
        </form>
        <div className="login-footer">
          ¿Nuevo? <span onClick={() => navigate('/regis')} style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 'bold' }}>Regístrate aquí</span>
        </div>
      </div>
    </div>
  );
};

export default Login;