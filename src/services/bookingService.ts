import type { Booking, BookingService, Method, Payment } from '../types/booking.ts';
import { courts, hours, customers } from '../data/demo.ts';
import { courtView, depositFor, priceFor } from './settings.ts';
import { dayRange, isFutureSlot, isValidDate, today } from '../utils/date.ts';
interface Store { changes: Booking[]; overrides: Record<string, Partial<Booking>> }
const KEY = 'cc-demo-bookings-v1';
const storage = (): Storage | null => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } };
const load = (): Store => { try { const raw = storage()?.getItem(KEY); if (raw) { const saved = JSON.parse(raw) as Partial<Store>; return { changes: saved.changes ?? [], overrides: saved.overrides ?? {} }; } } catch { /* datos corruptos */ } return { changes: [], overrides: {} }; };
let store = load();
const save = () => { try { storage()?.setItem(KEY, JSON.stringify(store)); } catch { /* sin almacenamiento */ } };
export const resetBookings = () => { store = { changes: [], overrides: {} }; try { storage()?.removeItem(KEY); } catch { /* sin almacenamiento */ } };
const hash = (value: string) => { let h = 2166136261; for (const c of value) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
// Probabilidad de turno ocupado según la franja (la noche se llena más). Datos de ejemplo.
const busy = (hour: number) => hour >= 18 ? 70 : hour >= 14 ? 45 : hour >= 11 ? 30 : 18;
const freeHours = (date: string, courtId: string) => [0, 1].map(n => `${17 + hash(`${date}|${courtId}|free${n}`) % 6}:00`);
export const minutes = (time: string) => Number(time.slice(0,2))*60+Number(time.slice(3));
export const overlaps = (a: string, duration: number, b: string, other: number) => minutes(a)<minutes(b)+other && minutes(a)+duration>minutes(b);
const base = (date: string): Booking[] => {
  const past = date < today();
  return courts.flatMap(court => hours.filter(time => !freeHours(date, court.id).includes(time) && hash(`${date}|${court.id}|${time}`) % 100 < busy(Number(time.slice(0, 2)))).map(time => {
    const h = hash(`${date}|${court.id}|${time}|x`); const web = h % 100 < 60; const amount = priceFor(court.sport, 60, time);
    const payment: Payment = past ? (h % 20 === 0 ? 'pendiente' : 'pagado') : h % 10 < 6 ? 'pagado' : h % 10 < 9 ? 'seña' : 'pendiente';
    const method: Method | undefined = payment === 'pendiente' ? undefined : web ? 'Mercado Pago' : (['Efectivo', 'Transferencia', 'Tarjeta'] as const)[h % 3];
    return { id: `${date}-${court.id}-${time}`, courtId: court.id, date, time, duration: 60, status: 'reservado' as const, name: customers[h % customers.length], payment, amount, paid: payment === 'pagado' ? amount : payment === 'seña' ? depositFor(amount) : 0, method, source: web ? 'web' as const : 'mostrador' as const };
  }));
};
export const bookingService: BookingService = {
  async getCourts(sport) { return courts.filter(c=>!sport||c.sport===sport).map(c=>courtView(c)).filter(c=>c.active!==false); },
  async list(date) { return isValidDate(date) ? [...base(date), ...store.changes.filter(b=>b.date===date)].map(b => store.overrides[b.id] ? { ...b, ...store.overrides[b.id] } : b) : []; },
  async listRange(from, to) { return (await Promise.all(dayRange(from, to).map(day => this.list(day)))).flat(); },
  async getSlots(courtId,date,duration) {
    const bookings=await this.list(date); const court=courts.find(c=>c.id===courtId);
    return hours.map(time=>{
      const past=!isFutureSlot(date,time);
      const occupied=bookings.some(b=>b.courtId===courtId&&overlaps(time,duration,b.time,b.duration));
      const closing=minutes(time)+duration>23*60;
      const valid=!!court&&courtView(court).active!==false&&[60,90,120].includes(duration)&&isValidDate(date);
      return {time,available:valid&&!past&&!occupied&&!closing,reason:past?'past' as const:occupied?'occupied' as const:closing?'closing' as const:undefined};
    });
  },
  async simulate(input) {
    if(!courts.some(c=>c.id===input.courtId)||!isValidDate(input.date)||![60,90,120].includes(input.duration)||!['reservado','bloqueado'].includes(input.status))throw new Error('Revisá los datos del turno.');
    if(!isFutureSlot(input.date,input.time))throw new Error('Ese horario ya pasó. Elegí un horario futuro (hora de Buenos Aires).');
    const slots=await this.getSlots(input.courtId,input.date,input.duration);
    if(!slots.find(s=>s.time===input.time)?.available)throw new Error('Ese horario ya no está disponible en esta demostración. Elegí otro.');
    const booking={...input,id:crypto.randomUUID()};store.changes.push(booking);save();return booking;
  },
  async markPaid(id, method = 'Efectivo') {
    const settle = (b: Booking): Partial<Booking> => ({ payment: 'pagado', paid: b.amount ?? 0, method: b.method ?? method });
    const own = store.changes.find(b => b.id === id);
    if (own) Object.assign(own, settle(own));
    else { const found = (await this.list(id.slice(0, 10))).find(b => b.id === id); if (!found) throw new Error('No encontramos ese turno.'); store.overrides[id] = settle(found); }
    save();
  }
};
