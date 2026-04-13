import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import API from '../api';
import './Login.css'; // Reutilizamos el CSS de Login para mantener la estética

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
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
          <div className="login-input-group">
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input 
                type="text" 
                placeholder="Nombre de usuario" 
                className="login-input"
                style={{ paddingLeft: '40px', width: '100%' }}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="login-input"
                style={{ paddingLeft: '40px', width: '100%' }}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                className="login-input"
                style={{ paddingLeft: '40px', width: '100%' }}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            <UserPlus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            REGISTRARME
          </button>
        </form>

        <div className="login-footer">
          ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 'bold' }}>Inicia sesión aquí</span>
        </div>
      </div>
    </div>
  );
};

export default Register;