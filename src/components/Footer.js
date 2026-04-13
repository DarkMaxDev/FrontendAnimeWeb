import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-left">
          <Link to="/" className="footer-logo">
            <Play size={18} fill="white" />
            Anime<span>Web</span>
          </Link>

          <p className="footer-desc">
            Disfruta de tus animes favoritos en HD, sin límites y siempre actualizado.
          </p>
        </div>

        <div className="footer-links">
          <h4>Explorar</h4>
          <Link to="/">Inicio</Link>
          <Link to="/favoritos">Favoritos</Link>
          <Link to="/buscar">Buscar</Link>
        </div>

        <div className="footer-links">
          <h4>Cuenta</h4>
          <Link to="/perfil">Perfil</Link>
          <Link to="/admin">Admin</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {year} AnimeWeb</p>
        <span>
          Hecho con <Heart size={14} color="#e50914" fill="#e50914" /> 
        </span>
      </div>

    </footer>
  );
};

export default Footer;