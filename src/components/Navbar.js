import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Settings, LogOut } from 'lucide-react';
import API from '../api';
import './Navbar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${query}`);
      setQuery('');
    }
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
          <Link to="/favoritos" className="nav-link">
            <Heart size={20} />
            <span>Favoritos</span>
          </Link>
          
          <Link to="/admin" className="nav-link">
            <Settings size={20} />
            <span>Admin</span>
          </Link>

          <button className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;