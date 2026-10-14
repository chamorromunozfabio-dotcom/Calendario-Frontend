import { useCallback, useEffect, useState } from 'react';
import CalendarGrid, { type CalDay } from '../components/CalendarGrid';
import { apiFetch } from '../lib/supabaseClient';
import { validateEntry, SYMPTOM_OPTIONS } from '../lib/cycle';

interface CalResp { grid: CalDay[]; legend: Record<string, string>; prediction: { next_period_start: string | null } | null; disclaimer: string }

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<CalResp | null>(null);
  const [selected, setSelected] = useState<string | null>(new Date().toISOString().slice(0, 10));
  const [detail, setDetail] = useState<CalDay | null>(null);
  const [entries, setEntries] = useState<never[]>([]);
  const [form, setForm] = useState({ start: '', end: '', flow: '', pain: '', notes: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(async (y: number, m: number) => {
    try {
      const r: CalResp = await apiFetch(`/api/v1/calendar?year=${y}&month=${m}`);
      setData(r);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Error'); }
  }, []);

  useEffect(() => { load(year, month); }, [year, month, load]);
  useEffect(() => {
    setDetail(data?.grid.find((g) => g.date === selected) ?? null);
    const loadEntries = async () => {
      try { const r = await apiFetch('/api/v1/entries?limit=200'); setEntries(r.items); } catch { /* noop */ }
    };
    loadEntries();
  }, [data, selected]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setMsg('');
    const v = validateEntry(form.start || selected || '', form.end || undefined);
    if (v) { setErr(v); return; }
    try {
      await apiFetch('/api/v1/entries', {
        method: 'POST',
        body: JSON.stringify({
          start_date: form.start || selected,
          end_date: form.end || null,
          flow_intensity: form.flow || null,
          pain_level: form.pain ? Number(form.pain) : null,
          notes: form.notes || null
        })
      });
      setMsg('Registro guardado.');
      setForm({ start: '', end: '', flow: '', pain: '', notes: '' });
      load(year, month);
    } catch (e) { setErr(e instanceof Error ? e.message : 'No se pudo guardar.'); }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este registro?')) return;
    await apiFetch(`/api/v1/entries/${id}`, { method: 'DELETE' });
    load(year, month);
  };

  return (
    <div className="grid">
      <CalendarGrid
        year={year} month={month} days={data?.grid ?? []} selected={selected}
        onSelect={setSelected}
        onMonth={(y, m) => { setYear(y); setMonth(m); }}
      />
      {data && (
        <section className="card" aria-label="Leyenda">
          <h2>Leyenda</h2>
          <ul>{Object.entries(data.legend).map(([k, v]) => <li key={k}>{v}</li>)}</ul>
          <p className="muted">{data.disclaimer}</p>
        </section>
      )}
      <div className="grid grid-2">
        <section className="card" aria-labelledby="d">
          <h2 id="d">Día seleccionado: {selected}</h2>
          {detail ? <p>Marcas: {detail.kinds.join(', ') || 'sin marcas'} {detail.symbols.join(' ')}</p> : <p className="muted">Elige un día.</p>}
          <h3>Registros de periodo</h3>
          {(entries as { id: string; start_date: string; end_date: string | null }[]).slice(0, 8).map((en) => (
            <div key={en.id} style={{ display: 'flex', gap: '.5rem', alignItems: 'center', padding: '.3rem 0' }}>
              <span>🩸 {en.start_date} → {en.end_date ?? '—'}</span>
              <button className="btn btn-secundario" onClick={() => remove(en.id)} style={{ minHeight: 36 }}>Eliminar</button>
            </div>
          ))}
        </section>
        <section className="card" aria-labelledby="r">
          <h2 id="r">Registrar menstruación</h2>
          <p className="muted">Solo confirmamos lo que tú registras. Las estimaciones nunca se convierten solas en eventos.</p>
          <form onSubmit={save}>
            <label htmlFor="s">Inicio</label>
            <input id="s" className="input" type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            <label htmlFor="e2">Fin (opcional)</label>
            <input id="e2" className="input" type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            <label htmlFor="f">Intensidad (opcional)</label>
            <select id="f" className="select" value={form.flow} onChange={(e) => setForm({ ...form, flow: e.target.value })}>
              <option value="">Omitir</option>
              <option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option>
              <option value="abundante">Abundante</option>
              <option value="muy_abundante">Muy abundante</option>
            </select>
            <label htmlFor="pa">Dolor 0-10 (opcional)</label>
            <input id="pa" className="input" type="number" min={0} max={10} value={form.pain} onChange={(e) => setForm({ ...form, pain: e.target.value })} />
            <label htmlFor="n">Notas (opcional)</label>
            <textarea id="n" className="textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={2000} />
            {err && <p className="form-error" role="alert">{err}</p>}
            {msg && <p className="form-ok" role="status">{msg}</p>}
            <button className="btn" style={{ marginTop: '.7rem' }}>Guardar</button>
          </form>
          <p className="muted">Síntomas frecuentes que puedes anotar en Diario: {SYMPTOM_OPTIONS.slice(0, 5).join(', ')}…</p>
        </section>
      </div>
    </div>
  );
}
