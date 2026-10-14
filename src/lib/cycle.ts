/** Utilidades de calendario: cuadrícula, bisiestos, zonas horarias (solo fecha local ISO). */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate(); // month 1-12
}

export interface DayCell {
  date: string;
  inMonth: boolean;
  weekday: number; // 0=lunes..6=domingo (ISO simplificado)
}

/** Genera cuadrícula completa de semanas empezando en lunes, con días adyacentes. */
export function buildMonthGrid(year: number, month: number): DayCell[] {
  const first = new Date(year, month - 1, 1);
  // getDay: 0=domingo..6=sábado -> convertir a 0=lunes
  const offset = (first.getDay() + 6) % 7;
  const cursor = new Date(year, month - 1, 1 - offset);
  const totalInMonth = daysInMonth(year, month);
  const cells: DayCell[] = [];
  for (;;) {
    const iso = toISODate(cursor);
    cells.push({
      date: iso,
      inMonth: cursor.getMonth() === month - 1,
      weekday: (cursor.getDay() + 6) % 7
    });
    cursor.setDate(cursor.getDate() + 1);
    const inMonthCount = cells.filter((c) => c.inMonth).length;
    if (inMonthCount >= totalInMonth && (cursor.getDay() + 6) % 7 === 0) break;
    if (cells.length > 42) break;
  }
  return cells;
}

export type DayKind = 'period_registered' | 'period_estimated' | 'fertile_estimated' | 'ovulation_estimated' | 'has_log';

export function classifyDay(dateISO: string, sets: Record<DayKind, Set<string>>): DayKind[] {
  const out: DayKind[] = [];
  (Object.keys(sets) as DayKind[]).forEach((k) => {
    if (sets[k].has(dateISO)) out.push(k);
  });
  return out;
}

export const SYMPTOM_OPTIONS = [
  'cólicos', 'dolor lumbar', 'dolor de cabeza', 'sensibilidad mamaria',
  'hinchazón', 'acné', 'antojos', 'náuseas', 'fatiga', 'insomnio'
];

export function validateEntry(start: string, end?: string): string | null {
  if (!start) return 'Elige la fecha de inicio.';
  if (end && end < start) return 'La fecha de fin no puede ser anterior al inicio.';
  const today = toISODate(new Date());
  if (start > today) return 'La fecha de inicio no puede estar en el futuro.';
  return null;
}
