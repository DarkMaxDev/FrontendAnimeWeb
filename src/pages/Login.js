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
      
      // Limpiamos cualquier rastro de sesiones anteriores
      localStorage.clear();
      
      // Guardamos la información que el backend nos responde
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user', JSON.stringify(res.data.user || { role: res.data.role }));
      
      // Redirigimos al Home
      navigate('/'); 
      
      // Recargamos para que el App y el Navbar lean los nuevos datos del localStorage
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
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className="login-input"
                style={{ paddingLeft: '40px', width: '100%' }}
                onChange={(e) => setEmail(e.target.value)} 
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
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            <LogIn size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            ENTRAR
          </button>
        </form>

        <div className="login-footer">
          ¿Nuevo en AnimeFlow? <span onClick={() => navigate('/regis')} style={{ cursor: 'pointer', color: '#ff4757', fontWeight: 'bold' }}>Regístrate aquí</span>
        </div>
      </div>
    </div>
  );
};

export default Login;