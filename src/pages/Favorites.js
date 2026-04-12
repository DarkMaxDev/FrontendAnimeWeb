import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import API from '../api';
import './Favorites.css';

const Favorites = () => {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavs = async () => {
    try {
      const res = await API.get('/animes/mis-favoritos');
      setFavs(res.data);
    } catch (err) {
      console.error("Error al cargar favoritos", err);
      setFavs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  // ❌ Quitar favorito
  const removeFav = async (id) => {
    try {
      await API.post(`/animes/favoritos/${id}`);
      setFavs(prev => prev.filter(a => a._id !== id));
    } catch {
      alert("Error al quitar favorito");
    }
  };

  if (loading) return <div className="favorites-container">Cargando tus favoritos...</div>;

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Mis Animes Favoritos ❤️</h1>

      {favs.length === 0 ? (
        <div className="empty-message">
          <p>Aún no has guardado ningún anime.</p>
          <Link to="/" className="explore-link">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favs.map(anime => (
            <div key={anime._id} className="fav-card">

              <div className="fav-img-wrapper">
                
                {/* ❌ BOTÓN ENCIMA DE LA IMAGEN */}
                <button
                  className="remove-btn"
                  onClick={() => removeFav(anime._id)}
                >
                  ✖
                </button>

                <img 
                  src={anime.imagen} 
                  alt={anime.titulo} 
                  className="fav-img" 
                />
              </div>

              <h3>{anime.titulo}</h3>

              <Link to={`/anime/${anime._id}`}>
                <button className="fav-btn-view">
                  <Play size={14} style={{marginRight: '6px'}} />
                  Ver ahora
                </button>
              </Link>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;