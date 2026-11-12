import type { Court, Sport } from '../types/booking.ts';
export const sports: {id: Sport; name: string; image: string; description: string; tag: string}[] = [
{id:'futbol',name:'Fútbol',image:'football.jpg',description:'La semana se juega en equipo. Armá el tuyo y disfrutá cada partido.',tag:'PASIÓN EN EQUIPO'},
{id:'tenis',name:'Tenis',image:'tennis.jpg',description:'Tu próximo gran punto empieza acá. Encontrá tu ritmo dentro de la cancha.',tag:'TU MEJOR VERSIÓN'},
{id:'padel',name:'Padel',image:'padel.jpg',description:'Cuatro jugadores y un gran plan. Compartí la energía de cada encuentro.',tag:'CONECTÁ CON EL JUEGO'}];
export const courts: Court[] = sports.flatMap(s=>[1,2].map(n=>({id:`${s.id}-${n}`,sport:s.id,name:`${s.name} · Cancha ${n}`,detail:'Cancha ilustrativa · configuración de demostración'})));
export const hours = Array.from({length:14},(_,i)=>`${String(i+9).padStart(2,'0')}:00`);
export const events = [{sport:'Fútbol',title:'Copa de amigos',text:'Un encuentro para compartir la pasión por el fútbol.',image:'football.jpg'},{sport:'Tenis',title:'Desafío de dobles',text:'Un formato pensado para disfrutar punto a punto.',image:'tennis.jpg'},{sport:'Padel',title:'Encuentro de padel',text:'El mejor plan se juega de a cuatro.',image:'padel.jpg'}];
