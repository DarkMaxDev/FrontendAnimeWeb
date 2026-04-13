import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import API from '../api';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', // Cambiado de 'nombre' a 'username'
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ahora enviamos { username, email, password } que es lo que pide tu modelo
      await API.post('/auth/register', formData);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      // Si el error es porque el username o email ya existen, el backend avisará aquí
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
                // Cambiado para actualizar 'username'
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
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
    <Mail 
      size={18} 
      style={{ 
        position: 'absolute', 
        left: '12px', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: '#666',
        zIndex: 1 // Para que el icono no quede detrás del fondo
      }} 
    />
    <input 
      type="email" 
      placeholder="Correo electrónico" 
      className="login-input"
      style={{ 
        paddingLeft: '40px', 
        width: '100%',
        backgroundColor: '#f0f7ff', 
        color: '#000',             
        border: 'none',           
        height: '45px',          
        borderRadius: '5px'        
      }}
      onChange={(e) => setFormData({...formData, email: e.target.value})} 
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