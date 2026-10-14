import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Ajustes() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [usual, setUsual] = useState('');
  const [period, setPeriod] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [exported, setExported] = useState('');

  useEffect(() => {
    apiFetch('/api/v1/profile').then((p) => {
      setName(p.display_name || '');
      setUsual(p.cycle_settings?.usual_cycle_length?.toString() || '');
      setPeriod(p.cycle_settings?.usual_period_length?.toString() || '');
    }).catch(() => {});
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      if (name) await apiFetch('/api/v1/profile', { method: 'PATCH', body: JSON.stringify({ display_name: name }) });
      await apiFetch('/api/v1/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          usual_cycle_length: usual ? Number(usual) : null,
          usual_period_length: period ? Number(period) : null
        })
      });
      setMsg('Preferencias guardadas.');
    } catch (e) { setErr(e instanceof Error ? e.message : 'Error'); }
  };

  const exportar = async () => {
    const d = await apiFetch('/api/v1/export');
    setExported(JSON.stringify(d, null, 2).slice(0, 4000));
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ccycle-datos.json';
    a.click();
  };

  const eliminar = async () => {
    if (!confirm('¿Eliminar tu cuenta y todos tus datos? Esta acción no se puede deshacer.')) return;
    if (!confirm('Confirma de nuevo: se borrarán periodos, diario, mensajes y vínculos.')) return;
    await apiFetch('/api/v1/account', { method: 'DELETE' });
    await supabase.auth.signOut();
    nav('/');
  };

  return (
    <div className="grid">
      <section className="card" aria-labelledby="t">
        <h1 id="t">Ajustes y perfil</h1>
        <p className="muted">{user?.email}</p>
        <form onSubmit={save}>
          <label htmlFor="n">Nombre visible</label>
          <input id="n" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          <div className="grid grid-2">
            <div><label htmlFor="u">Duración habitual del ciclo (15-60, opcional)</label><input id="u" className="input" type="number" min={15} max={60} value={usual} onChange={(e) => setUsual(e.target.value)} /></div>
            <div><label htmlFor="p">Duración habitual del periodo (1-15, opcional)</label><input id="p" className="input" type="number" min={1} max={15} value={period} onChange={(e) => setPeriod(e.target.value)} /></div>
          </div>
          {err && <p className="form-error" role="alert">{err}</p>}
          {msg && <p className="form-ok" role="status">{msg}</p>}
          <button className="btn" style={{ marginTop: '.7rem' }}>Guardar</button>
        </form>
      </section>
      <section className="card" aria-labelledby="d">
        <h2 id="d">Tus datos</h2>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secundario" onClick={exportar}>Exportar mis datos (JSON)</button>
          <button className="btn btn-secundario" onClick={eliminar} style={{ borderColor: '#a4262c', color: '#a4262c' }}>Eliminar cuenta y datos</button>
        </div>
        {exported && <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto', background: 'var(--fondo)', padding: '.6rem', borderRadius: 8 }}>{exported}…</pre>}
        <p className="muted">Al eliminar: se borran perfil, periodos, diario, predicciones, mensajes, consentimientos y se revocan invitaciones y vínculos. Proceso documentado en Privacidad.</p>
      </section>
    </div>
  );
}
