import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin'; 
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import SearchResults from './pages/SearchResults';
import Categoria from './pages/Categoria';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
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
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}

export default App;