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
  const dropdownRef = useRef(null);

  // 🔥 FIX REAL: evita spam al backend con limiter
  const fetchCategories = async () => {
    try {
      const cached = sessionStorage.getItem('categories');

      if (cached) {
        setCategories(JSON.parse(cached));
        return;
      }

      const res = await API.get('/categories');

      const data = res.data || [];

      setCategories(data);

      // sessionStorage (mejor que localStorage para evitar bugs viejos)
      sessionStorage.setItem('categories', JSON.stringify(data));

    } catch (err) {
      console.error("Error cargando categorías:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();

    const updateUserData = () => {
      const loggedInUser = localStorage.getItem('user');

      if (loggedInUser) {
        try {
          setUser(JSON.parse(loggedInUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUserData();

    window.addEventListener('storage', updateUserData);
    window.addEventListener('loginStateChange', updateUserData);

    return () => {
      window.removeEventListener('storage', updateUserData);
      window.removeEventListener('loginStateChange', updateUserData);
    };
  }, []);

  const rawRole = user?.role || localStorage.getItem('role');
  const isAdmin =
    rawRole?.replace(/"/g, '').trim().toLowerCase() === 'admin';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${query}`);
      setQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem('categories'); // 🔥 FIX IMPORTANTE
    setUser(null);

    navigate('/login');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          AnimeWeb
        </Link>

        {/* CATEGORÍAS */}
        <div className="dropdown" ref={dropdownRef}>
          <button
            className={`nav-link dropdown-btn ${openMenu ? 'active' : ''}`}
            onClick={() => setOpenMenu(!openMenu)}
          >
            Categorías ▾
          </button>

          {openMenu && (
            <div className="dropdown-menu animate-fade-in">
              {categories.map((cat) => (
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

        {/* SEARCH */}
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

        {/* ACTIONS */}
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