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

// Componente para proteger la ruta de Admin corregido
const AdminRoute = ({ children }) => {
  // Obtenemos el rol y limpiamos comillas o espacios accidentales
  const rawRole = localStorage.getItem('role');
  const role = rawRole ? rawRole.replace(/"/g, '').trim().toLowerCase() : null;

  // Verificación por consola para que puedas revisar si hay problemas (F12)
  console.log("Accediendo a ruta protegida. Rol actual:", role);

  return role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/regis" element={<Register />} />
            <Route path="/anime/:id" element={<Detail />} />
            <Route path="/categoria/:id" element={<Categoria />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/buscar" element={<SearchResults />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;