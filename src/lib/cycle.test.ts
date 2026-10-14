import { describe, expect, it } from 'vitest';
import { buildMonthGrid, daysInMonth, isLeapYear, validateEntry } from './cycle';

describe('calendario', () => {
  it('febrero bisiesto 2024 tiene 29 días', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(isLeapYear(2025)).toBe(false);
    expect(daysInMonth(2025, 2)).toBe(28);
  });
  it('cuadrícula incluye días adyacentes y semanas completas', () => {
    const grid = buildMonthGrid(2024, 2);
    expect(grid.filter((c) => c.inMonth).length).toBe(29);
    expect(grid.length % 7).toBe(0);
    expect(grid[0].weekday).toBe(0); // empieza lunes
  });
  it('rechaza rangos inválidos y futuro', () => {
    expect(validateEntry('2026-02-10', '2026-02-05')).toContain('anterior');
    expect(validateEntry('2999-01-01')).toContain('futuro');
    expect(validateEntry('2026-02-01')).toBeNull();
  });
});
