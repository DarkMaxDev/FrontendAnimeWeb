import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin'; 
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import SearchResults from './pages/SearchResults';
import Register from './pages/Register';
import Categoria from './pages/Categoria';

// Componente para proteger la ruta de Admin
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* El Navbar debe estar dentro del Router para que funcionen los Links */}
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* IMPORTANTE: Cambié /register a /regis para que coincida con tu Navbar y Login */}
            <Route path="/regis" element={<Register />} />
            
            <Route path="/anime/:id" element={<Detail />} />
            <Route path="/categoria/:id" element={<Categoria />} />
            <Route path="/buscar" element={<SearchResults />} />

            {/* Rutas Privadas */}
            <Route path="/favoritos" element={<Favorites />} />
            
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Ruta por defecto (404) - Redirige al Home si la ruta no existe */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;