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

const AdminRoute = ({ children }) => {
  const rawRole = localStorage.getItem('role');
  
  // Si no hay nada en el storage todavía
  if (!rawRole) {
    console.log("Ruta protegida: No se encontró ningún rol aún.");
    return <Navigate to="/login" />;
  }

  const role = rawRole.replace(/"/g, '').trim().toLowerCase();
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

           {/* Quitamos el AdminRoute para que no te bloquee el paso */}
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;