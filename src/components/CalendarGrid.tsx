import { useState } from 'react';
import { buildMonthGrid } from '../lib/cycle';

export interface CalDay {
  date: string;
  in_month: boolean;
  weekday: number;
  kinds: string[];
  symbols: string[];
}

export default function CalendarGrid({
  year, month, days, selected, onSelect, onMonth
}: {
  year: number; month: number; days: CalDay[]; selected: string | null;
  onSelect: (iso: string) => void; onMonth: (y: number, m: number) => void;
}) {
  const [listView, setListView] = useState(false);
  const grid = days.length ? days : buildMonthGrid(year, month).map((c) => ({ date: c.date, in_month: c.inMonth, weekday: c.weekday, kinds: [], symbols: [] }));
  const label = new Date(year, month - 1, 1).toLocaleDateString('es', { month: 'long', year: 'numeric' });
  const prev = () => { const d = new Date(year, month - 2, 1); onMonth(d.getFullYear(), d.getMonth() + 1); };
  const next = () => { const d = new Date(year, month, 1); onMonth(d.getFullYear(), d.getMonth() + 1); };
  const today = () => { const n = new Date(); onMonth(n.getFullYear(), n.getMonth() + 1); onSelect(n.toISOString().slice(0, 10)); };

  return (
    <section aria-label={`Calendario de ${label}`}>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{label}</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '.4rem' }}>
          <button className="btn btn-secundario" onClick={prev} aria-label="Mes anterior">‹</button>
          <button className="btn btn-secundario" onClick={today}>Hoy</button>
          <button className="btn btn-secundario" onClick={next} aria-label="Mes siguiente">›</button>
          <button className="btn btn-secundario" onClick={() => setListView((v) => !v)} aria-pressed={listView}>
            {listView ? 'Ver cuadrícula' : 'Ver lista'}
          </button>
        </div>
      </div>
      {!listView ? (
        <div className="cal-grid" role="grid" aria-label="Días del mes" style={{ marginTop: '.8rem' }}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => <div key={d} className="cal-dow" role="columnheader">{d}</div>)}
          {grid.map((g) => (
            <button
              key={g.date}
              role="gridcell"
              aria-selected={selected === g.date}
              aria-label={`${g.date}${g.kinds.length ? ', ' + g.kinds.join(', ') : ''}`}
              className={`cal-day ${g.in_month ? '' : 'fuera'} ${selected === g.date ? 'seleccionado' : ''} ${g.kinds.map((k) => 'k-' + k).join(' ')}`}
              onClick={() => onSelect(g.date)}
            >
              <div>{Number(g.date.slice(8, 10))}</div>
              <div className="simb" aria-hidden="true">{g.symbols.join(' ')}</div>
            </button>
          ))}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {grid.filter((g) => g.in_month).map((g) => (
            <li key={g.date} style={{ borderBottom: '1px solid var(--borde)', padding: '.4rem 0' }}>
              <button className="btn btn-secundario" onClick={() => onSelect(g.date)} style={{ minHeight: 40 }}>
                {g.date} {g.symbols.join(' ')} {g.kinds.join(', ')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
