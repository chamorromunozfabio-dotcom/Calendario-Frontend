import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/supabaseClient';

type Tone = 'tranquilo' | 'alegre' | 'motivador' | 'reflexivo';

export default function Mensajes() {
  const [tone, setTone] = useState<Tone>('tranquilo');
  const [current, setCurrent] = useState<{ message: string; source: string } | null>(null);
  const [favs, setFavs] = useState<{ id: string; message: string; tone: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try { const r = await apiFetch('/api/v1/messages/favorites'); setFavs(r.items); } catch { /* */ }
  };
  useEffect(() => { load(); }, []);

  const otro = async () => {
    setLoading(true);
    try { setCurrent(await apiFetch('/api/v1/ai/support-message', { method: 'POST', body: JSON.stringify({ tone }) })); }
    catch { /* */ }
    finally { setLoading(false); }
  };
  const guardar = async () => {
    if (!current) return;
    await apiFetch('/api/v1/messages/favorites', { method: 'POST', body: JSON.stringify({ message: current.message, tone }) });
    load();
  };
  const borrar = async (id: string) => {
    await apiFetch(`/api/v1/messages/favorites/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="grid grid-2">
      <section className="card" aria-labelledby="t">
        <h1 id="t">Mensajes de bienestar</h1>
        <p className="muted">Apoyo general, no terapia. Puedes no recibir personalización: usa el tono que prefieras o ninguno.</p>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {(['tranquilo', 'alegre', 'motivador', 'reflexivo'] as Tone[]).map((t) => (
            <button key={t} className={tone === t ? 'btn' : 'btn btn-secundario'} onClick={() => setTone(t)} aria-pressed={tone === t}>{t}</button>
          ))}
        </div>
        <div style={{ marginTop: '.8rem' }}>
          <button className="btn" onClick={otro} disabled={loading}>{loading ? '…' : '💜 Pedir mensaje'}</button>
        </div>
        {current && (
          <blockquote style={{ borderLeft: '4px solid var(--rosa)', paddingLeft: '.8rem', marginTop: '1rem' }}>
            <p>{current.message}</p>
            <p className="muted">Fuente: {current.source === 'groq' ? 'IA' : 'respaldo local'}</p>
            <button className="btn btn-secundario" onClick={guardar}>Guardar en favoritos</button>
          </blockquote>
        )}
      </section>
      <section className="card" aria-labelledby="f">
        <h2 id="f">Favoritos</h2>
        {favs.length === 0 ? <p className="estado-vacio">Sin favoritos todavía.</p> : (
          <ul>{favs.map((f) => (
            <li key={f.id} style={{ marginBottom: '.5rem' }}>{f.message} <em>({f.tone})</em>{' '}
              <button className="btn btn-secundario" onClick={() => borrar(f.id)} style={{ minHeight: 36 }}>Quitar</button>
            </li>
          ))}</ul>
        )}
      </section>
    </div>
  );
}
