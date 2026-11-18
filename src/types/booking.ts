export type Sport = 'futbol' | 'tenis' | 'padel';
export type Payment = 'pagado' | 'seña' | 'pendiente';
export type Method = 'Mercado Pago' | 'Efectivo' | 'Transferencia' | 'Tarjeta';
export type Source = 'web' | 'mostrador';
export interface Court { id: string; sport: Sport; name: string; detail: string; image?: string; active?: boolean }
export interface Slot { time: string; available: boolean; reason?: 'past' | 'occupied' | 'closing' }
export interface Booking { id: string; courtId: string; date: string; time: string; duration: number; status: 'reservado' | 'bloqueado'; name: string; payment?: Payment; amount?: number; paid?: number; method?: Method; source?: Source }
export interface BookingService {
  getCourts(sport?: Sport): Promise<Court[]>;
  getSlots(courtId: string, date: string, duration: number): Promise<Slot[]>;
  list(date: string): Promise<Booking[]>;
  listRange(from: string, to: string): Promise<Booking[]>;
  simulate(input: Omit<Booking, 'id'>): Promise<Booking>;
  markPaid(id: string, method?: Method): Promise<void>;
}
