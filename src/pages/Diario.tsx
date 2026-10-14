import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/supabaseClient';
import { SYMPTOM_OPTIONS } from '../lib/cycle';

export default function Diario() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState('');
  const [sleep, setSleep] = useState('');
  const [stress, setStress] = useState('');
  const [syms, setSyms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [routine, setRoutine] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [items, setItems] = useState<{ id: string; log_date: string; mood?: string }[]>([]);

  const load = async () => {
    try { const r = await apiFetch('/api/v1/logs?limit=30'); setItems(r.items); } catch { /* */ }
  };
  useEffect(() => { load(); }, []);

  const toggle = (s: string) => setSyms((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      await apiFetch('/api/v1/logs', {
        method: 'POST',
        body: JSON.stringify({
          log_date: date,
          mood: mood || null,
          energy: energy ? Number(energy) : null,
          sleep_hours: sleep ? Number(sleep) : null,
          stress: stress ? Number(stress) : null,
          symptoms: syms,
          routine_changes: routine || null,
          notes: notes || null
        })
      });
      setMsg('Registro diario guardado. Todo es opcional: puedes omitir lo que quieras.');
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Error'); }
  };

  return (
    <div className="grid grid-2">
      <section className="card" aria-labelledby="t">
        <h1 id="t">Registro diario (opcional)</h1>
        <p className="muted">Cuenta solo si te apetece. Explicamos cada campo y ninguno es obligatorio.</p>
        <form onSubmit={save}>
          <label htmlFor="d">Fecha</label>
          <input id="d" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <label htmlFor="m">Ánimo (opcional): cómo te sientes en general</label>
          <select id="m" className="select" value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">Omitir</option>
            <option value="muy_bajo">Muy bajo</option>
            <option value="bajo">Bajo</option>
            <option value="neutral">Neutral</option>
            <option value="bien">Bien</option>
            <option value="muy_bien">Muy bien</option>
          </select>
          <div className="grid grid-2">
            <div><label htmlFor="en">Energía 1-5</label><input id="en" className="input" type="number" min={1} max={5} value={energy} onChange={(e) => setEnergy(e.target.value)} /></div>
            <div><label htmlFor="st">Estrés 1-5</label><input id="st" className="input" type="number" min={1} max={5} value={stress} onChange={(e) => setStress(e.target.value)} /></div>
          </div>
          <label htmlFor="sl">Horas de sueño</label>
          <input id="sl" className="input" type="number" step={0.5} min={0} max={24} value={sleep} onChange={(e) => setSleep(e.target.value)} />
          <fieldset style={{ border: '1px solid var(--borde)', borderRadius: 10, marginTop: '.7rem' }}>
            <legend>Síntomas (opcional)</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {SYMPTOM_OPTIONS.map((s) => (
                <label key={s} style={{ fontWeight: 400, display: 'flex', gap: '.3rem', alignItems: 'center', border: '1px solid var(--borde)', borderRadius: 999, padding: '.3rem .7rem' }}>
                  <input type="checkbox" checked={syms.includes(s)} onChange={() => toggle(s)} /> {s}
                </label>
              ))}
            </div>
          </fieldset>
          <label htmlFor="r">Cambios de rutina (opcional)</label>
          <input id="r" className="input" value={routine} onChange={(e) => setRoutine(e.target.value)} placeholder="Ej. viaje, ejercicio nuevo…" maxLength={1000} />
          <label htmlFor="n">Notas personales (opcional, privadas)</label>
          <textarea id="n" className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} />
          {err && <p className="form-error" role="alert">{err}</p>}
          {msg && <p className="form-ok" role="status">{msg}</p>}
          <button className="btn" style={{ marginTop: '.7rem' }}>Guardar día</button>
        </form>
      </section>
      <section className="card" aria-labelledby="h">
        <h2 id="h">Últimos días</h2>
        {items.length === 0 ? <p className="estado-vacio">Aún no hay registros. Cuando guardes el primero aparecerá aquí.</p> : (
          <ul>{items.map((i) => <li key={i.id}>{i.log_date} · {i.mood ?? 'sin ánimo'}</li>)}</ul>
        )}
      </section>
    </div>
  );
}
