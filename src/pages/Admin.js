import { useState, useEffect } from 'react';
import API from '../api';
import './Admin.css';

const Admin = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    linkTrailer: '',
    enEmision: true,
    categorias: [],
    episodios: []
  });

  const [episodioActual, setEpisodioActual] = useState({
    numero: '',
    tituloEpisodio: '',
    linkVideo: ''
  });

  const [allCategories, setAllCategories] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get('/categories');
        const animeRes = await API.get('/animes');

        setAllCategories(catRes.data || []);
        setAnimes(animeRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 CARGAR DATOS EN FORM AL EDITAR
  const handleEdit = (anime) => {
    setFormData({
      titulo: anime.titulo || '',
      descripcion: anime.descripcion || '',
      imagen: anime.imagen || '',
      linkTrailer: anime.linkTrailer || '',
      enEmision: anime.enEmision ?? true,
      categorias: anime.categorias?.map(c => c._id || c) || [],
      episodios: anime.episodios || []
    });

    setEditingId(anime._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ➕ AGREGAR EPISODIO
  const agregarEpisodio = () => {
    if (!episodioActual.numero || !episodioActual.linkVideo) return;

    const nuevo = {
      ...episodioActual,
      numero: Number(episodioActual.numero)
    };

    setFormData(prev => ({
      ...prev,
      episodios: [...prev.episodios, nuevo]
    }));

    setEpisodioActual({ numero: '', tituloEpisodio: '', linkVideo: '' });
  };

  // ❌ ELIMINAR EPISODIO
  const eliminarEpisodio = (index) => {
    setFormData(prev => ({
      ...prev,
      episodios: prev.episodios.filter((_, i) => i !== index)
    }));
  };

  // 💾 GUARDAR / ACTUALIZAR
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      episodios: formData.episodios.map(ep => ({
        numero: Number(ep.numero),
        tituloEpisodio: ep.tituloEpisodio,
        linkVideo: ep.linkVideo
      })),
      totalCapitulos: formData.episodios.length
    };

    try {
      if (editingId) {
        await API.put(`/animes/${editingId}`, payload);
      } else {
        await API.post('/animes', payload);
      }

      // reset form
      setFormData({
        titulo: '',
        descripcion: '',
        imagen: '',
        linkTrailer: '',
        enEmision: true,
        categorias: [],
        episodios: []
      });

      setEditingId(null);

      const res = await API.get('/animes');
      setAnimes(res.data || []);

    } catch (err) {
      console.error(err);
    }
  };

  const filteredAnimes = animes.filter(a =>
    a.titulo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="admin-form">

        <h2>Panel Admin</h2>

        <input
          placeholder="Título"
          value={formData.titulo}
          onChange={e => setFormData({ ...formData, titulo: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
        />

        <input
          placeholder="Imagen"
          value={formData.imagen}
          onChange={e => setFormData({ ...formData, imagen: e.target.value })}
        />

        <input
          placeholder="Trailer"
          value={formData.linkTrailer}
          onChange={e => setFormData({ ...formData, linkTrailer: e.target.value })}
        />

        {/* CATEGORÍAS */}
        <h3>Categorías</h3>

        <div className="categories">
          {allCategories.map(cat => (
            <label key={cat._id} className="category-item">
              <input
                type="checkbox"
                checked={formData.categorias.includes(cat._id)}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setFormData(prev => ({
                    ...prev,
                    categorias: checked
                      ? [...prev.categorias, cat._id]
                      : prev.categorias.filter(id => id !== cat._id)
                  }));
                }}
              />
              {cat.nombre}
            </label>
          ))}
        </div>

        {/* EPISODIOS */}
        <h3>Episodios</h3>

        <input
          type="number"
          placeholder="Número"
          value={episodioActual.numero}
          onChange={e =>
            setEpisodioActual({ ...episodioActual, numero: e.target.value })
          }
        />

        <input
          placeholder="Título episodio"
          value={episodioActual.tituloEpisodio}
          onChange={e =>
            setEpisodioActual({ ...episodioActual, tituloEpisodio: e.target.value })
          }
        />

        <input
          placeholder="Video URL"
          value={episodioActual.linkVideo}
          onChange={e =>
            setEpisodioActual({ ...episodioActual, linkVideo: e.target.value })
          }
        />

        <button type="button" className="btn-secondary" onClick={agregarEpisodio}>
          Agregar Episodio
        </button>

        <div>
          {formData.episodios.map((ep, i) => (
            <div key={i} className="episode-item">
              Ep {ep.numero} - {ep.tituloEpisodio}

              <button
                type="button"
                onClick={() => eliminarEpisodio(i)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          {editingId ? "Actualizar Anime" : "Crear Anime"}
        </button>

      </form>

      {/* LISTA */}
      <div className="admin-list">

        <input
          className="search-input"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filteredAnimes.map(anime => (
          <div key={anime._id} className="admin-card">

            <img src={anime.imagen} alt={anime.titulo} />

            <div>
              <h4>{anime.titulo}</h4>

              <button onClick={() => handleEdit(anime)}>
                ✏️
              </button>

              <button onClick={() => API.delete(`/animes/${anime._id}`)}>
                🗑
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default Admin;