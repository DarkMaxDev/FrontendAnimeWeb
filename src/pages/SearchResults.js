import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api';
import './SearchResults.css'; // Asegúrate de crear este CSS o usar tus clases globales

const SearchResults = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Extraemos el query de la URL (?q=valor)
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Llamada al endpoint de búsqueda que definimos en el Backend
        const res = await API.get(`/animes/buscar?q=${query}`);
        setResultados(res.data);
      } catch (err) {
        console.error("Error en la búsqueda:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) return <div className="loading">Buscando animes...</div>;

  return (
    <div className="search-results-container">
      <h2 className="results-title">
        Resultados para: <span>"{query}"</span>
      </h2>

      <div className="anime-grid">
        {resultados.length > 0 ? (
          resultados.map((anime) => (
            <Link key={anime._id} to={`/anime/${anime._id}`} className="anime-card">
              <div className="card-image-wrapper">
                <img src={anime.imagen} alt={anime.titulo} />
                <div className="card-overlay">
                  <span className="play-icon">▶</span>
                </div>
              </div>
              <div className="card-info">
                <h3 className="card-title">{anime.titulo}</h3>
                <p className="card-meta">{anime.enEmision ? 'En Emisión' : 'Finalizado'}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron resultados para tu búsqueda.</p>
            <Link to="/" className="back-home">Volver al inicio</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;