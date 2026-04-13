import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Settings, LogOut, LogIn } from 'lucide-react'; 
import API from '../api';
import './Navbar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Para cerrar el menú al hacer clic fuera

  useEffect(() => {
    const initNavbar = async () => {
      // 1. Cargar Categorías
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Error cargando categorías");
      }

      // 2. Cargar Usuario inicial
      const updateUserData = () => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
          try {
            setUser(JSON.parse(loggedInUser));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      };

      updateUserData();

      // Escuchar cambios de storage y eventos personalizados de login
      window.addEventListener('storage', updateUserData);
      window.addEventListener('loginStateChange', updateUserData);
      
      return () => {
        window.removeEventListener('storage', updateUserData);
        window.removeEventListener('loginStateChange', updateUserData);
      };
    };

    initNavbar();

    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rawRole = user?.role || localStorage.getItem('role');
  const isAdmin = rawRole?.replace(/"/g, '').trim().toLowerCase() === 'admin';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${query}`);
      setQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
    // Forzamos el reload para limpiar estados globales y proteger rutas
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">AnimeWeb</Link>

        {/* Categorías con Ref para detectar clics fuera */}
        <div className="dropdown" ref={dropdownRef}>
          <button 
            className={`nav-link dropdown-btn ${openMenu ? 'active' : ''}`} 
            onClick={() => setOpenMenu(!openMenu)}
          >
            Categorías ▾
          </button>
          {openMenu && (
            <div className="dropdown-menu animate-fade-in">
              {categories.map(cat => (
                <Link 
                  key={cat._id} 
                  to={`/categoria/${cat._id}`} 
                  className="dropdown-item" 
                  onClick={() => setOpenMenu(false)}
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>

        <form className="navbar-search-wrapper" onSubmit={handleSearch}>
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Buscar anime..." 
            className="navbar-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="navbar-actions">
          {user && (
            <Link to="/favoritos" className="nav-link">
              <Heart size={20} />
              <span className="nav-text">Favoritos</span>
            </Link>
          )}
          
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              <Settings size={20} />
              <span className="nav-text">Admin</span>
            </Link>
          )}

          {user ? (
            <button className="logout-btn-nav" onClick={handleLogout}>
              <LogOut size={20} />
              <span className="nav-text">Salir</span>
            </button>
          ) : (
            <Link to="/login" className="nav-link login-btn-nav">
              <LogIn size={20} />
              <span className="nav-text">Ingresar</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;