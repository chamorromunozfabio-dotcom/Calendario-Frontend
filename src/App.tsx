import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import { Forgot, Login, Register } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import Diario from './pages/Diario';
import Analisis from './pages/Analisis';
import Recomendaciones from './pages/Recomendaciones';
import Mensajes from './pages/Mensajes';
import Pareja from './pages/Pareja';
import Ajustes from './pages/Ajustes';
import Privacidad from './pages/Privacidad';
import { useAuth } from './contexts/AuthContext';

function Protegida({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Cargando…</p>;
  if (!user) return <Navigate to="/entrar" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<Forgot />} />
          <Route path="/restablecer" element={<Forgot />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/panel" element={<Protegida><Dashboard /></Protegida>} />
          <Route path="/calendario" element={<Protegida><CalendarPage /></Protegida>} />
          <Route path="/diario" element={<Protegida><Diario /></Protegida>} />
          <Route path="/analisis" element={<Protegida><Analisis /></Protegida>} />
          <Route path="/recomendaciones" element={<Protegida><Recomendaciones /></Protegida>} />
          <Route path="/mensajes" element={<Protegida><Mensajes /></Protegida>} />
          <Route path="/pareja" element={<Protegida><Pareja /></Protegida>} />
          <Route path="/ajustes" element={<Protegida><Ajustes /></Protegida>} />
          <Route path="*" element={<p>404 — Página no encontrada. <a href="/">Volver</a></p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
