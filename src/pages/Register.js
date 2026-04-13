import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import API from '../api';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', // Coincide con tu modelo de MongoDB
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2>CREAR CUENTA</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo: Usuario */}
          <div className="login-input-group">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              placeholder="Nombre de usuario" 
              className="login-input"
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required
            />
          </div>

          {/* Campo: Email */}
          <div className="login-input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className="login-input"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="login-input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="login-input"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            <UserPlus size={18} className="btn-icon" />
            REGISTRARME
          </button>
        </form>

        <div className="login-footer">
          ¿Ya tienes cuenta? <span className="footer-link" onClick={() => navigate('/login')}>Inicia sesión aquí</span>
        </div>
      </div>
    </div>
  );
};

export default Register;