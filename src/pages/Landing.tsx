import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="grid" style={{ gap: '1.2rem' }}>
      <section className="card" aria-labelledby="t1">
        <h1 id="t1">CCycle — conoce tu ciclo con calma</h1>
        <p className="muted">Registro menstrual voluntario, calendario claro, análisis orientativo y bienestar. Sin diagnósticos ni promesas exactas.</p>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          <Link className="btn" to="/registro">Crear cuenta</Link>
          <Link className="btn btn-secundario" to="/entrar">Entrar</Link>
        </div>
        <p className="muted" style={{ fontSize: '.9rem' }}>CCycle no es método anticonceptivo ni garantiza días seguros. Ante síntomas intensos, busca atención profesional.</p>
      </section>
      <div className="grid grid-3">
        <article className="card"><h2>📅 Calendario</h2><p>Menstruación registrada vs estimada, ventana fértil orientativa y leyenda con símbolos.</p></article>
        <article className="card"><h2>📊 Análisis</h2><p>Duración media, variabilidad y método explicado. Sin IA para los cálculos.</p></article>
        <article className="card"><h2>💜 Bienestar</h2><p>Recomendaciones generales y mensajes de apoyo con IA opcional y respaldo local.</p></article>
      </div>
    </div>
  );
}
