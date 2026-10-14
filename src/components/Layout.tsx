import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, THEME_OPTIONS } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, mode, setMode } = useTheme();
  const [offline, setOffline] = useState(!navigator.onLine);
  const nav = useNavigate();

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const logout = async () => { await signOut(); nav('/'); };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="logo" to={user ? '/panel' : '/'} aria-label="CCycle inicio">C<span>Cycle</span></Link>
          <nav className="main-nav" aria-label="Principal">
            {!user && <NavLink to="/">Inicio</NavLink>}
            {user && <>
              <NavLink to="/panel">Panel</NavLink>
              <NavLink to="/calendario">Calendario</NavLink>
              <NavLink to="/diario">Diario</NavLink>
              <NavLink to="/analisis">Análisis</NavLink>
              <NavLink to="/recomendaciones">Consejos</NavLink>
              <NavLink to="/mensajes">Mensajes</NavLink>
              <NavLink to="/pareja">Pareja</NavLink>
              <NavLink to="/ajustes">Ajustes</NavLink>
            </>}
          </nav>
          <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
            <label className="muted" htmlFor="theme-sel" style={{ fontSize: '.8rem' }}>Tema</label>
            <select id="theme-sel" className="select" style={{ width: 'auto' }} value={theme} onChange={(e) => setTheme(e.target.value as never)} aria-label="Selector de tema">
              {THEME_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <button className="btn btn-secundario" onClick={() => setMode(mode === 'claro' ? 'oscuro' : 'claro')} aria-label="Cambiar modo claro oscuro" style={{ minHeight: 44 }}>
              {mode === 'oscuro' ? '☾' : '☀'}
            </button>
            {user
              ? <button className="btn btn-secundario" onClick={logout}>Salir</button>
              : <Link className="btn" to="/entrar">Entrar</Link>}
          </div>
        </div>
      </header>
      {offline && <div role="status" style={{ background: '#fff3cd', padding: '.5rem', textAlign: 'center' }}>Sin conexión: verás recursos guardados. Los cambios se sincronizarán al reconectar.</div>}
      <main id="contenido" className="page">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="page">
          <span><strong>CCycle</strong> · Tus datos, tus decisiones.</span>
          <Link to="/privacidad">Privacidad y consentimiento</Link>
          <span className="muted">Las estimaciones son orientativas, no médicas ni anticonceptivas.</span>
        </div>
      </footer>
    </div>
  );
}
