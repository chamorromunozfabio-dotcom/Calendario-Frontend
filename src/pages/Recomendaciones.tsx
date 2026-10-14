import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/supabaseClient';

export default function Recomendaciones() {
  const [focus, setFocus] = useState('bienestar');
  const [items, setItems] = useState<{ id: string; title: string; body: string; reason: string; source: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    try { const r = await apiFetch('/api/v1/recommendations'); setItems(r.items); } catch { /* */ }
  };
  useEffect(() => { load(); }, []);

  const gen = async () => {
    setLoading(true); setErr('');
    try {
      await apiFetch('/api/v1/ai/recommendations', { method: 'POST', body: JSON.stringify({ focus }) });
      await load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid">
      <section className="card" aria-labelledby="t">
        <h1 id="t">Recomendaciones de bienestar</h1>
        <p className="muted">Generales y educativas: alimentación equilibrada, hidratación, descanso, autocuidado y manejo del estrés. Sin dietas estrictas ni suplementos. Ante síntomas intensos o persistentes, busca atención profesional.</p>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <select className="select" style={{ width: 'auto' }} value={focus} onChange={(e) => setFocus(e.target.value)} aria-label="Enfoque">
            <option value="bienestar">Bienestar general</option>
            <option value="nutricion">Alimentación</option>
            <option value="descanso">Descanso</option>
            <option value="educativa">Fases del ciclo</option>
          </select>
          <button className="btn" onClick={gen} disabled={loading}>{loading ? 'Generando…' : 'Generar con IA'}</button>
        </div>
        {err && <p className="form-error" role="alert">{err}</p>}
      </section>
      {items.length === 0
        ? <p className="estado-vacio">Sin recomendaciones aún. Genera la primera arriba.</p>
        : items.map((r) => (
          <article key={r.id} className="card">
            <h2>{r.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{r.body}</p>
            <p className="muted">Por qué la ves: {r.reason} · Fuente: {r.source === 'groq' ? 'IA (Groq)' : 'respaldo local'}</p>
          </article>
        ))}
    </div>
  );
}
