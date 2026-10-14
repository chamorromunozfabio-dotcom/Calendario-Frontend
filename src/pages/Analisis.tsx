import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiFetch } from '../lib/supabaseClient';

interface A { cycles: { avg: number | null; count: number; min: number | null; max: number | null; variability: number | null; regularity: string }; cycle_history: { from: string; to: string; days: number }[]; prediction: Record<string, string | number | string[] | null> & { confidence: string; warnings: string[]; disclaimer: string }; records_used: { period_starts: number; cycles: number }; issues: string[]; method: string; limitations: string }

export default function Analisis() {
  const [a, setA] = useState<A | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    apiFetch('/api/v1/analytics').then(setA).catch((e) => setErr(e.message));
  }, []);
  if (err) return <p className="form-error" role="alert">{err}</p>;
  if (!a) return <p role="status">Calculando…</p>;
  const chartData = a.cycle_history.map((h, i) => ({ ciclo: `#${i + 1}`, días: h.days }));
  return (
    <div className="grid">
      <section className="card" aria-labelledby="t">
        <h1 id="t">Análisis y proyecciones</h1>
        <p><span className="badge">estadístico</span> <span className="badge">sin IA</span></p>
        <p>Ciclos usados: <strong>{a.records_used.cycles}</strong> ({a.records_used.period_starts} inicios). Media: <strong>{a.cycles.avg ?? '—'} días</strong> · Variabilidad: {a.cycles.variability ?? '—'} · {a.cycles.regularity}</p>
        <p className="muted">Método: {a.method}</p>
        <p className="muted">Límites: {a.limitations}</p>
        {a.issues.map((i) => <p key={i} className="form-error">⚠ {i}</p>)}
      </section>
      <section className="card" aria-labelledby="g">
        <h2 id="g">Duración por ciclo (observado)</h2>
        {chartData.length === 0
          ? <p className="estado-vacio">Necesitas al menos 2 periodos para ver la gráfica.</p>
          : <div style={{ width: '100%', height: 260 }}><ResponsiveContainer><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ciclo" /><YAxis /><Tooltip /><Bar dataKey="días" fill="#8e5a7d" /></BarChart></ResponsiveContainer></div>}
      </section>
      <section className="card" aria-labelledby="pr">
        <h2 id="pr">Próxima estimación (orientativa, confianza {a.prediction.confidence})</h2>
        <p>🩸 Periodo: {String(a.prediction.next_period_start ?? '—')} · 🌸 Fértil: {String(a.prediction.fertile_from ?? '—')} → {String(a.prediction.fertile_to ?? '—')} · ★ Ovulación: {String(a.prediction.ovulation_date ?? '—')}</p>
        <p className="muted">{a.prediction.disclaimer}</p>
        <p><strong>CCycle no debe usarse como método anticonceptivo ni garantiza días seguros.</strong></p>
      </section>
    </div>
  );
}
