import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bookingService,overlaps} from '../src/services/bookingService.ts';
import {dateKey, clubClock, isFutureSlot, isValidDate} from '../src/utils/date.ts';
test('overlap includes partial intervals but allows consecutive turns',()=>{assert.equal(overlaps('10:00',90,'11:00',60),true);assert.equal(overlaps('10:00',60,'11:00',60),false)});
test('availability changes with duration and closing time',async()=>{const courts=await bookingService.getCourts('tenis');assert.equal(courts.length,2);const slots=await bookingService.getSlots(courts[0].id,'2030-10-20',120);assert.equal(slots.find(s=>s.time==='22:00')?.available,false);assert(slots.some(s=>s.available));assert(slots.some(s=>!s.available));});
test('simulation is reflected in agenda and rejects overlapping turns',async()=>{const date='2030-10-21';const slots=await bookingService.getSlots('padel-1',date,90);const slot=slots.find(s=>s.available)!;const input={courtId:'padel-1',date,time:slot.time,duration:90,status:'reservado' as const,name:'Test demo'};const result=await bookingService.simulate(input);assert((await bookingService.list(date)).some(b=>b.id===result.id));await assert.rejects(()=>bookingService.simulate(input),/no está disponible/);assert.equal((await bookingService.getSlots('padel-1',date,60)).find(s=>s.time===slot.time)?.available,false)});
test('calendar date keys preserve local calendar day',()=>{assert.equal(dateKey(new Date(2030,0,2)),'2030-01-02')});

test('past slots use Buenos Aires time including day boundaries',()=>{
 const now=new Date('2026-11-06T18:30:00Z');
 assert.deepEqual(clubClock(now),{date:'2026-11-06',minutes:930});
 assert.equal(isFutureSlot('2026-11-06','15:00',now),false);
 assert.equal(isFutureSlot('2026-11-06','15:30',now),false);
 assert.equal(isFutureSlot('2026-11-06','16:00',now),true);
 assert.equal(isFutureSlot('2026-11-05','22:00',now),false);
 assert.equal(isFutureSlot('2026-11-07','09:00',now),true);
 assert.equal(clubClock(new Date('2026-11-07T01:00:00Z')).date,'2026-11-06');
 assert.equal(isValidDate('2026-02-31'),false);
 assert.equal(isFutureSlot('2026-02-31','09:00',now),false);
});
test('service rejects expired turns in both demo workflows',async()=>{
 const slots=await bookingService.getSlots('futbol-1','2020-01-01',60);
 assert(slots.every(s=>!s.available&&s.reason==='past'));
 for(const status of ['reservado','bloqueado'] as const){
  await assert.rejects(()=>bookingService.simulate({courtId:'futbol-1',date:'2020-01-01',time:'10:00',duration:60,status,name:'Demo'}),/ya pasó/);
 }
});
