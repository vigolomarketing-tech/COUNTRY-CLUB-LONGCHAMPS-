import type { Booking } from '../types/booking.ts';
import { courts } from '../data/demo.ts';
export interface Summary { count: number; billed: number; collected: number; pending: number; average: number; minutes: number }
export const reserved = (list: Booking[]) => list.filter(b => b.status === 'reservado');
export const summarize = (list: Booking[]): Summary => {
  const r = reserved(list); const billed = r.reduce((a, b) => a + (b.amount ?? 0), 0); const collected = r.reduce((a, b) => a + (b.paid ?? 0), 0);
  return { count: r.length, billed, collected, pending: billed - collected, average: r.length ? Math.round(billed / r.length) : 0, minutes: r.reduce((a, b) => a + b.duration, 0) };
};
export const sportOf = (courtId: string) => courts.find(c => c.id === courtId)?.sport ?? 'futbol';
export const groupSum = (list: Booking[], key: (b: Booking) => string, value: (b: Booking) => number) => {
  const totals = new Map<string, number>();
  for (const b of reserved(list)) totals.set(key(b), (totals.get(key(b)) ?? 0) + value(b));
  return [...totals.entries()].map(([name, total]) => ({ name, total })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);
};
/** CSV para Excel en español: separador ; y BOM para que respete las tildes. */
export const toCsv = (rows: (string | number)[][]) => '\ufeff' + rows.map(r => r.map(v => { const s = String(v); return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(';')).join('\r\n');
