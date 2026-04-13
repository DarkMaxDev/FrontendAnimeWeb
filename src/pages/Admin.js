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

  // 📥 Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get('/categories');
        const animeRes = await API.get('/animes');

        setAllCategories(catRes.data);
        setAnimes(animeRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🎬 Agregar episodio
  const agregarEpisodio = () => {
    if (!episodioActual.numero || !episodioActual.linkVideo) {
      alert('Completa número y link');
      return;
    }

    setFormData(prev => ({
      ...prev,
      episodios: [...prev.episodios, episodioActual]
    }));

    setEpisodioActual({
      numero: '',
      tituloEpisodio: '',
      linkVideo: ''
    });
  };

  // ❌ Eliminar episodio
  const eliminarEpisodio = (index) => {
    const nuevos = formData.episodios.filter((_, i) => i !== index);
    setFormData({ ...formData, episodios: nuevos });
  };

  // ✏️ Editar anime
  const handleEdit = (anime) => {
    setFormData({
      titulo: anime.titulo,
      descripcion: anime.descripcion,
      imagen: anime.imagen,
      linkTrailer: anime.linkTrailer,
      enEmision: anime.enEmision,
      categorias: anime.categorias?.map(c => c._id || c) || [],
      episodios: anime.episodios || []
    });

    setEditingId(anime._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🗑 Eliminar anime
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este anime?")) return;

    try {
      await API.delete(`/animes/${id}`);
      setAnimes(animes.filter(a => a._id !== id));
    } catch {
      alert("Error al eliminar");
    }
  };

  // 🚀 Crear / actualizar
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      imagen: formData.imagen,
      linkTrailer: formData.linkTrailer,
      enEmision: formData.enEmision,
      categorias: formData.categorias,

      episodios: formData.episodios.map(ep => ({
        numero: Number(ep.numero),
        tituloEpisodio: ep.tituloEpisodio,
        linkVideo: ep.linkVideo
      })),

      totalCapitulos: formData.episodios.length
    };

    console.log("ENVIANDO:", payload); // 👈 debug

    if (editingId) {
      await API.put(`/animes/${editingId}`, payload);
      alert("✏️ Anime actualizado");
    } else {
      await API.post('/animes', payload);
      alert(" Anime agregado");
    }

    // RESET
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
    setAnimes(res.data);

  } catch (err) {
    console.error("ERROR BACKEND:", err.response?.data || err);
    alert(" Error en la operación (ver consola)");
  }
};
  const filteredAnimes = animes.filter(anime =>
    anime.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">

      <form onSubmit={handleSubmit} className="admin-form">
        <h2> Panel Admin</h2>

        <input
          type="text"
          placeholder="Título"
          value={formData.titulo}
          onChange={e => setFormData({...formData, titulo: e.target.value})}
          required
        />

        <textarea
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={e => setFormData({...formData, descripcion: e.target.value})}
        />

        <input
          type="text"
          placeholder="Imagen URL"
          value={formData.imagen}
          onChange={e => setFormData({...formData, imagen: e.target.value})}
          required
        />

        <input
          type="text"
          placeholder="Trailer"
          value={formData.linkTrailer}
          onChange={e => setFormData({...formData, linkTrailer: e.target.value})}
        />

        <label>Categorías:</label>
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

        <h3>Episodios</h3>

        <input
          type="number"
          placeholder="Número"
          value={episodioActual.numero}
          onChange={e => setEpisodioActual({...episodioActual, numero: e.target.value})}
        />

        <input
          type="text"
          placeholder="Título episodio"
          value={episodioActual.tituloEpisodio}
          onChange={e => setEpisodioActual({...episodioActual, tituloEpisodio: e.target.value})}
        />

        <input
          type="text"
          placeholder="Video URL"
          value={episodioActual.linkVideo}
          onChange={e => setEpisodioActual({...episodioActual, linkVideo: e.target.value})}
        />

        <button type="button" onClick={agregarEpisodio} className="btn-secondary">
           Agregar Episodio
        </button>

        <div className="episode-list">
          {formData.episodios.map((ep, i) => (
            <div key={i} className="episode-item">
              Ep {ep.numero} - {ep.tituloEpisodio}
              <button onClick={() => eliminarEpisodio(i)}>✖</button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          {editingId ? "✏️ Actualizar Anime" : "🚀 Crear Anime"}
        </button>
      </form>

      <div className="admin-list">
        <h2> Animes</h2>

        <input
          type="text"
          placeholder="Buscar anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {filteredAnimes.map(anime => (
          <div key={anime._id} className="admin-card">
            <img src={anime.imagen} alt="" />

            <div>
              <h4>{anime.titulo}</h4>

              <button onClick={() => handleEdit(anime)}>✏️</button>
              <button onClick={() => handleDelete(anime._id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Admin;