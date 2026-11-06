export type Sport = 'futbol' | 'tenis' | 'padel';
export interface Court { id: string; sport: Sport; name: string; detail: string }
export interface Slot { time: string; available: boolean; reason?: 'past' | 'occupied' | 'closing' }
export interface Booking { id: string; courtId: string; date: string; time: string; duration: number; status: 'reservado' | 'bloqueado'; name: string }
export interface BookingService { getCourts(sport?: Sport): Promise<Court[]>; getSlots(courtId: string, date: string, duration: number): Promise<Slot[]>; list(date: string): Promise<Booking[]>; simulate(input: Omit<Booking,'id'>): Promise<Booking> }
