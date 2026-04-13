import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Añadimos LogIn a la importación
import { Search, Heart, Settings, LogOut, LogIn } from 'lucide-react'; 
import API from '../api';
import './Navbar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  
  // Estado para el usuario (puedes usar un Context o leer localStorage)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Error cargando categorías");
      }
    };
    fetchCategories();
    
    // Escuchar cambios en el storage por si el login ocurre en otra pestaña
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${query}`);
      setQuery('');
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AnimeWeb
        </Link>

        <div className="dropdown">
          <button 
            className="nav-link dropdown-btn"
            onClick={() => setOpenMenu(!openMenu)}
          >
            Categorías ▾
          </button>

          {openMenu && (
            <div className="dropdown-menu">
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
          {/* Solo mostramos favoritos si hay usuario */}
          {user && (
            <Link to="/favoritos" className="nav-link">
              <Heart size={20} />
              <span>Favoritos</span>
            </Link>
          )}
          
          {/* Solo mostramos Admin si el usuario tiene rol admin */}
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              <Settings size={20} />
              <span>Admin</span>
            </Link>
          )}

          {user ? (
            <button className="logout-btn" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          ) : (
            <Link to="/regis" className="nav-link login-btn">
              <LogIn size={20} />
              <span>Ingresar</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;