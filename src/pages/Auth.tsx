import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function validEmail(v: string) { return /.+@.+\..+/.test(v); }

export function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!validEmail(email)) { setErr('Escribe un correo válido.'); return; }
    if (pw.length < 6) { setErr('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    try { await signIn(email, pw); nav('/panel'); }
    catch (e) { setErr(e instanceof Error ? e.message : 'No se pudo entrar.'); }
    finally { setLoading(false); }
  };
  return (
    <section className="card" aria-labelledby="t" style={{ maxWidth: 480, marginInline: 'auto' }}>
      <h1 id="t">Entrar a CCycle</h1>
      <form onSubmit={submit} noValidate>
        <label htmlFor="email">Correo</label>
        <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="pw">Contraseña</label>
        <input id="pw" className="input" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {err && <p className="form-error" role="alert">{err}</p>}
        <div style={{ marginTop: '.8rem', display: 'flex', gap: '.6rem' }}>
          <button className="btn" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
          <Link className="btn btn-secundario" to="/registro">Crear cuenta</Link>
        </div>
      </form>
      <p><Link to="/recuperar">¿Olvidaste tu contraseña?</Link></p>
    </section>
  );
}

export function Register() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!validEmail(email)) { setErr('Escribe un correo válido.'); return; }
    if (pw.length < 8) { setErr('Usa al menos 8 caracteres.'); return; }
    try {
      const r = await signUp(email, pw);
      if (r.needsConfirm) setMsg('Revisa tu correo para confirmar la cuenta y luego entra.');
      else nav('/panel');
    } catch (e) { setErr(e instanceof Error ? e.message : 'No se pudo registrar.'); }
  };
  return (
    <section className="card" aria-labelledby="t2" style={{ maxWidth: 480, marginInline: 'auto' }}>
      <h1 id="t2">Crear cuenta</h1>
      <form onSubmit={submit} noValidate>
        <label htmlFor="e2">Correo</label>
        <input id="e2" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="p2">Contraseña (mín. 8)</label>
        <input id="p2" className="input" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {err && <p className="form-error" role="alert">{err}</p>}
        {msg && <p className="form-ok" role="status">{msg}</p>}
        <button className="btn" style={{ marginTop: '.8rem' }}>Registrarme</button>
      </form>
      <p className="muted">Al registrarte aceptas el tratamiento de datos descrito en Privacidad (Ley 1581 de 2012).</p>
    </section>
  );
}

export function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mensaje genérico para no enumerar cuentas
    try { await resetPassword(email); } catch { /* no revelar */ }
    setMsg('Si el correo existe, recibirás instrucciones. Revisa también spam.');
  };
  return (
    <section className="card" style={{ maxWidth: 480, marginInline: 'auto' }}>
      <h1>Recuperar contraseña</h1>
      <form onSubmit={submit}>
        <label htmlFor="e3">Correo</label>
        <input id="e3" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn" style={{ marginTop: '.8rem' }}>Enviar enlace</button>
      </form>
      {msg && <p className="form-ok" role="status">{msg}</p>}
    </section>
  );
}
