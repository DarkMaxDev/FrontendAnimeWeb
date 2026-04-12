import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Clock, Tv, Send, MessageSquare, List, Heart } from 'lucide-react';
import API from '../api';
import './Detail.css';

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const epNumero = query.get('ep');

  const [anime, setAnime] = useState(null);
  const [episodios, setEpisodios] = useState([]);
  const [videoActual, setVideoActual] = useState('');
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [episodioSeleccionado, setEpisodioSeleccionado] = useState(null);

  //  Cambiar episodio
  const cambiarEpisodio = (ep) => {
    setVideoActual(ep.linkVideo);
    setEpisodioSeleccionado(ep._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //  Agregar comentario
  const handleComentar = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/animes/${id}/comentar`, { texto: nuevoTexto });

      setAnime(prev => ({
        ...prev,
        comentarios: res.data
      }));

      setNuevoTexto('');
    } catch {
      alert("Inicia sesión para comentar");
    }
  };

  //  Eliminar comentario
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/animes/${id}/comentario/${commentId}`);

      setAnime(prev => ({
        ...prev,
        comentarios: prev.comentarios.filter(c => c._id !== commentId)
      }));

    } catch (err) {
      console.error(err);
      alert("No puedes eliminar este comentario");
    }
  };

  //  Favoritos
  const toggleFavorito = async () => {
    try {
      await API.post(`/animes/favoritos/${anime._id}`);
      alert(" Favorito actualizado");
    } catch {
      alert("Inicia sesión");
    }
  };

  // 📥 Cargar anime
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await API.get(`/animes/${id}`);
        const listaEps = res.data.episodios || [];

        setAnime(res.data);
        setEpisodios(listaEps);

        if (listaEps.length > 0) {
          const epInicial = epNumero
            ? listaEps.find(e => e.numero === Number(epNumero)) 
            : listaEps[0];

          if (epInicial) {
            setVideoActual(epInicial.linkVideo);
            setEpisodioSeleccionado(epInicial._id);
          }
        } else {
          setVideoActual(res.data.linkTrailer);
        }

      } catch (err) {
        console.error("Error al cargar el detalle", err);
      }
    };

    fetchAnime();
  }, [id, epNumero]);

  if (!anime) return <div className="loading">Cargando información...</div>;

  return (
    <div className="detail-container">
      <div className="detail-layout">

        <main className="main-col">

          {/*  VIDEO */}
          <section className="video-wrapper">
            <iframe
              src={videoActual}
              title={anime.titulo}
              allowFullScreen
            />
          </section>

          {/* ℹ INFO */}
          <section className="info-box">
            <h1 className="anime-title">{anime.titulo}</h1>

            <div className="meta-info">
              <span className="tag-item">
                <Clock size={16} color="#e50914"/> {episodios.length} CAPÍTULOS
              </span>
              <span className="tag-item">
                <Tv size={16} color="#e50914"/> {anime.enEmision ? 'EN EMISIÓN' : 'FINALIZADO'}
              </span>
            </div>

            <p className="anime-description">
              {anime.description || anime.descripcion}
            </p>

            <div className="categories-container">
              {anime.categorias?.map(cat => (
                <span key={cat._id} className="cat-badge">
                  {cat.nombre}
                </span>
              ))}
            </div>

            {/*  FAVORITO */}
            <button className="fav-btn-detail" onClick={toggleFavorito}>
              <Heart size={18} /> Añadir a favoritos
            </button>

          </section>

          {/*  EPISODIOS */}
          <section className="episodes-container">
            <div className="episodes-header">
              <List size={20} color="#e50914" />
              <h3 className="episodes-title">LISTA DE EPISODIOS</h3>
            </div>

            <div className="episodes-grid">
              {episodios.length > 0 ? (
                [...episodios].sort((a, b) => a.numero - b.numero).map(ep => (
                  <div
                    key={ep._id}
                    className={`episode-item ${episodioSeleccionado === ep._id ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => cambiarEpisodio(ep)}
                      className="episode-btn-action"
                    >
                      EPISODIO {ep.numero}
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay episodios disponibles.</p>
              )}
            </div>
          </section>

          {/*  COMENTARIOS */}
          <section className="comments-section">

            <div className="comments-header">
              <MessageSquare size={20} color="#e50914" />
              <h3>COMENTARIOS</h3>
            </div>

            <form onSubmit={handleComentar} className="comment-form">
              <textarea
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
                placeholder="Escribe un comentario..."
                required
                className="comment-textarea"
              />

              <button type="submit" className="send-btn">
                <Send size={14} /> Publicar
              </button>
            </form>

            <div className="comments-list">
              {anime.comentarios?.length === 0 ? (
                <p className="no-comments">Sé el primero en comentar 👀</p>
              ) : (
                anime.comentarios.slice().reverse().map(c => (
                  <div key={c._id} className="comment-card">

                    <div className="comment-header">
                      <strong>{c.usuario?.username || 'Usuario'}</strong>
                    </div>

                    <p className="comment-text">{c.texto}</p>

                    <button
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      ✖
                    </button>

                  </div>
                ))
              )}
            </div>

          </section>

        </main>

      </div>
    </div>
  );
};

export default Detail;