import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import API from '../api';
import './Home.css';

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Evita fugas de memoria

    const fetchAnimes = async () => {
      try {
        const res = await API.get('/animes');
        if (isMounted) setAnimes(res.data);
      } catch (err) {
        console.error("Error cargando animes", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnimes();
    return () => { isMounted = false; };
  }, []); // Array vacío importante para evitar el error 429

  if (loading) return <div className="home-container" style={{color: 'white', padding: '100px', textAlign: 'center'}}>Cargando catálogo...</div>;

  return (
    <div className="home-container">
      {/* HERO */}
      <div className="hero">
        <img src="https://i0.wp.com/elpalomitron.com/wp-content/uploads/2020/01/pel%C3%ADcula-Fatestay-night-Heavens-Feel-III.-spring-song-destacada-El-Palomitr%C3%B3n.jpg?resize=1200%2C600&ssl=1" alt="banner" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Bienvenidos a AnimeWeb</h1>
          <div className="hero-tags"><span>Disfruta tu visita</span></div>
        </div>
      </div>

      {/* EPISODIOS RECIENTES */}
      <h2 className="section-title">Episodios recientes</h2>
      <div className="scroll-container">
        {animes.length > 0 ? animes.slice(0, 8).map(anime => {
          const episodio = anime.episodios?.[0];
          if (!episodio) return null;
          return (
            <Link key={`${anime._id}-${episodio.numero}`} to={`/anime/${anime._id}?ep=${episodio.numero}`} className="scroll-card">
              <img src={anime.imagen} alt={anime.titulo} />
              <p>{anime.titulo} - Ep {episodio.numero}</p>
            </Link>
          );
        }) : <p style={{color: '#888', padding: '20px'}}>No hay episodios recientes disponibles.</p>}
      </div>

      <h2 className="home-title">Animes en Tendencia</h2>
      <div className="home-grid">
        {animes.map(anime => (
          <div key={anime._id} className="anime-card">
            <Link to={`/anime/${anime._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="anime-img-wrapper">
                <img src={anime.imagen} alt={anime.titulo} className="anime-img" loading="lazy" />
              </div>
              <div className="anime-card-body">
                <h3 className="anime-card-title" title={anime.titulo}>{anime.titulo}</h3>
                <p className="anime-status">
                  {anime.enEmision ? (
                    <><span style={{ color: '#2ecc71' }}>●</span> En Emisión</>
                  ) : (
                    <><span style={{ color: '#e74c3c' }}>●</span> Finalizado</>
                  )}
                </p>
                <button className="btn-home-view">
                  <PlayCircle size={14} style={{ marginRight: '5px' }} />
                  VER AHORA
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;