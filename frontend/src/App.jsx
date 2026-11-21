import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimalDetail from './pages/AnimalDetail';
import SubmitAnimal from './pages/SubmitAnimal';
import MyRequests from './pages/MyRequests';
import Profile from './pages/Profile';
import Ongs from './pages/Ongs';
import OngProfile from './pages/OngProfile';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/ong/Dashboard';
import ManageAnimals from './pages/ong/ManageAnimals';
import CreateAnimal from './pages/ong/CreateAnimal';
import EditAnimal from './pages/ong/EditAnimal';
import ReviewAnimals from './pages/ong/ReviewAnimals';
import OngRequests from './pages/ong/OngRequests';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ongs" element={<Ongs />} />
              <Route path="/ong/:id" element={<OngProfile />} />
              <Route path="/usuario/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/animal/:id" element={<AnimalDetail />} />
              <Route path="/enviar-animal" element={<ProtectedRoute><SubmitAnimal /></ProtectedRoute>} />
              <Route path="/minhas-solicitacoes" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/painel" element={<ProtectedRoute role="ONG"><Dashboard /></ProtectedRoute>} />
              <Route path="/painel/animais" element={<ProtectedRoute role="ONG"><ManageAnimals /></ProtectedRoute>} />
              <Route path="/painel/novo" element={<ProtectedRoute role="ONG"><CreateAnimal /></ProtectedRoute>} />
              <Route path="/painel/editar/:id" element={<ProtectedRoute role="ONG"><EditAnimal /></ProtectedRoute>} />
              <Route path="/painel/avaliacoes" element={<ProtectedRoute role="ONG"><ReviewAnimals /></ProtectedRoute>} />
              <Route path="/painel/solicitacoes" element={<ProtectedRoute role="ONG"><OngRequests /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}