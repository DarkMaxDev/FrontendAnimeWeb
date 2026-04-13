import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import './Categoria.css';

const Categoria = () => {
  const { id } = useParams();
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/animes');

        const filtrados = res.data.filter(anime =>
          anime.categorias?.some(c =>
            (c._id || c) === id 
          )
        );

        setAnimes(filtrados);
      } catch (err) {
        console.error("Error cargando categoría", err);
      }
    };

    fetch();
  }, [id]);

  return (
    <div className="categoria-container">
      <h2 className="categoria-title">Animes de la categoría</h2>

      <div className="categoria-grid">
        {animes.map(a => (
          <Link
            key={a._id}
            to={`/anime/${a._id}`}
            className="categoria-card"
          >
            <div className="categoria-img">
              <img src={a.imagen} alt={a.titulo} />
            </div>

            <h3>{a.titulo}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categoria;