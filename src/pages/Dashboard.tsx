import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/supabaseClient';

interface Analytics { cycles: { avg: number | null; count: number; regularity: string }; prediction: { next_period_start: string | null; fertile_from: string | null; fertile_to: string | null; ovulation_date: string | null; confidence: string } | null; records_used: { period_starts: number }; issues: string[] }

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [entries, setEntries] = useState<{ total: number }>({ total: 0 });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [a, e] = await Promise.all([
          apiFetch('/api/v1/analytics'),
          apiFetch('/api/v1/entries?limit=1')
        ]);
        setData(a); setEntries(e);
      } catch (e) { setErr(e instanceof Error ? e.message : 'Error'); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <p role="status">Cargando tu panel…</p>;
  if (err) return <p className="form-error" role="alert">{err}. Revisa que el backend esté en marcha ({import.meta.env.VITE_API_URL}).</p>;

  const p = data?.prediction;
  return (
    <div className="grid">
      <section className="card" aria-labelledby="h">
        <h1 id="h">Tu ciclo de un vistazo</h1>
        <p className="muted">Estimaciones orientativas, no certezas médicas.</p>
        <div className="grid grid-3">
          <article className="card"><h2>📍 Día y registros</h2><p>{entries.total} periodos registrados · {data?.records_used.period_starts ?? 0} inicios usados</p><Link to="/diario">Registrar</Link></article>
          <article className="card"><h2>🩸 Próxima menstruación (estimada)</h2><p><strong>{p?.next_period_start ?? 'Sin datos suficientes'}</strong></p><span className="badge">predicción</span></article>
          <article className="card"><h2>🌸 Ventana fértil (estimada)</h2><p>{p?.fertile_from && p?.fertile_to ? `${p.fertile_from} → ${p.fertile_to} · Ovulación ${p.ovulation_date}` : 'Sin datos suficientes'}</p><span className="badge">orientativo</span></article>
        </div>
        {data?.issues?.length ? <ul>{data.issues.map((i) => <li key={i}>{i}</li>)}</ul> : null}
      </section>
      <nav className="grid grid-3" aria-label="Accesos rápidos">
        {[['/calendario', '📅 Calendario'], ['/diario', '✍️ Registro diario'], ['/analisis', '📊 Análisis'], ['/recomendaciones', '💡 Recomendaciones'], ['/mensajes', '💜 Mensajes'], ['/ajustes', '⚙️ Configuración']].map(([to, l]) => (
          <Link key={to} className="card" to={to} style={{ textDecoration: 'none' }}><strong>{l}</strong></Link>
        ))}
      </nav>
    </div>
  );
}
