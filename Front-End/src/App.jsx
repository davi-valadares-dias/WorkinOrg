import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { RotaProtegida } from "./components/RotaProtegida"

import Treinos from "./pages/Treinos/index.jsx"
import MontarTreino from "./pages/Montar-Treinos/index.jsx"
import TreinoAtual from "./pages/Lista-Treinos/index.jsx"
import Cardio from "./pages/Cardio/index.jsx"
import Perfil from "./pages/Perfil/index.jsx"
import Executar from "./pages/Executar/index.jsx"
import TreinoMontado from "./pages/TreinoMontado/index.jsx"
import Login from "./pages/Login/index.jsx"
import Admin from "./pages/Admin/index.jsx"
import Boletos from "./pages/Boletos/index.jsx"
import Progresso from "./pages/Progresso/index.jsx"
import Historico from "./pages/Histórico/index.jsx"
import DefinirSeries from "./pages/Definir-Séries/index.jsx"
import MeusTreinos from "./pages/Meus-Treinos/index.jsx"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppContent() {
  const navigate = useNavigate();
  const { isAutenticado, isAdmin, logout, usuario, admin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Se não está autenticado, mostrar apenas login
  if (!isAutenticado) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Se é admin
  if (isAdmin) {
    return (
      <div className="app-container admin-layout">
        <nav className="menu admin-menu">
          <div className="menu-left">
            <button className="menu-btn" onClick={() => navigate('/admin')}>🏠 Admin</button>
            <span className="user-name">Bem-vindo, {admin?.nome}!</span>
          </div>
          <div className="menu-right">
            <button className="menu-btn logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="pagina admin-pagina">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<RotaProtegida requerAdmin={true}><Admin /></RotaProtegida>} />
            <Route path="/montar-treinos/:usuarioId" element={<RotaProtegida requerAdmin={true}><MontarTreino /></RotaProtegida>} />
            <Route path="/login" element={<Navigate to="/admin" />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>
    );
  }

  // Se é usuário comum
  return (
    <div className="app-container">
      <nav className="menu">
        <div className="menu-left">
          <button className="menu-btn" onClick={() => navigate('/')}>🏠 Menu</button>
          <span className="user-name">Bem-vindo, {usuario?.nome}!</span>
        </div>
        <div className="menu-cards">
          <Link to="/meus-treinos" className="menu-card">Meus Treinos</Link>
          <Link to="/montar" className="menu-card">Montar Treino</Link>
          <Link to="/cardio" className="menu-card">Cardio</Link>
          <Link to="/executar" className="menu-card">Executar Treino</Link>
        </div>
        <div className="menu-right">
          <button className="menu-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="pagina">
        <Routes>
          <Route path="/" element={<RotaProtegida><Treinos /></RotaProtegida>} />
          <Route path="/meus-treinos" element={<RotaProtegida><MeusTreinos /></RotaProtegida>} />
          <Route path="/montar" element={<RotaProtegida><MontarTreino /></RotaProtegida>} />
          <Route path="/definir-series" element={<RotaProtegida><DefinirSeries /></RotaProtegida>} />
          <Route path="/treino-atual" element={<RotaProtegida><TreinoAtual /></RotaProtegida>} />
          <Route path="/treino-montado" element={<RotaProtegida><TreinoMontado /></RotaProtegida>} />
          <Route path="/cardio" element={<RotaProtegida><Cardio /></RotaProtegida>} />
          <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
          <Route path="/executar" element={<RotaProtegida><Executar /></RotaProtegida>} />
          <Route path="/boletos" element={<RotaProtegida><Boletos /></RotaProtegida>} />
          <Route path="/progresso" element={<RotaProtegida><Progresso /></RotaProtegida>} />
          <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
