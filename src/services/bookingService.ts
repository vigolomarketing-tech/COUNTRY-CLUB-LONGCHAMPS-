import type { Booking, BookingService } from '../types/booking.ts';
import { courts, hours } from '../data/demo.ts';
import { isFutureSlot, isValidDate } from '../utils/date.ts';
const changes: Booking[] = [];
const seed = (value: string) => [...value].reduce((a,c)=>a+c.charCodeAt(0),0);
export const minutes = (time: string) => Number(time.slice(0,2))*60+Number(time.slice(3));
export const overlaps = (a: string, duration: number, b: string, other: number) => minutes(a)<minutes(b)+other && minutes(a)+duration>minutes(b);
const base = (date: string): Booking[] => courts.flatMap((court,i)=>[11+(seed(date+court.id)%3),17+(i%3)].map((h,n)=>({id:`${date}-${court.id}-${n}`,courtId:court.id,date,time:`${h}:00`,duration:60,status:'reservado' as const,name:`Equipo de ejemplo ${i+1}`})));
export const bookingService: BookingService = {
  async getCourts(sport) { return courts.filter(c=>!sport||c.sport===sport); },
  async list(date) { return isValidDate(date)?[...base(date),...changes.filter(b=>b.date===date)]:[]; },
  async getSlots(courtId,date,duration) {
    const bookings=await this.list(date);
    return hours.map(time=>{
      const past=!isFutureSlot(date,time);
      const occupied=bookings.some(b=>b.courtId===courtId&&overlaps(time,duration,b.time,b.duration));
      const closing=minutes(time)+duration>23*60;
      const valid=courts.some(c=>c.id===courtId)&&[60,90,120].includes(duration)&&isValidDate(date);
      return {time,available:valid&&!past&&!occupied&&!closing,reason:past?'past' as const:occupied?'occupied' as const:closing?'closing' as const:undefined};
    });
  },
  async simulate(input) {
    if(!courts.some(c=>c.id===input.courtId)||!isValidDate(input.date)||![60,90,120].includes(input.duration)||!['reservado','bloqueado'].includes(input.status))throw new Error('Revisá los datos del turno.');
    if(!isFutureSlot(input.date,input.time))throw new Error('Ese horario ya pasó. Elegí un horario futuro (hora de Buenos Aires).');
    const slots=await this.getSlots(input.courtId,input.date,input.duration);
    if(!slots.find(s=>s.time===input.time)?.available)throw new Error('Ese horario ya no está disponible en la demo. Elegí otro.');
    const booking={...input,id:crypto.randomUUID()};changes.push(booking);return booking;
  }
};
