import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bookingService} from '../src/services/bookingService.ts';
import {summarize,groupSum,toCsv} from '../src/services/accounting.ts';
import {getSettings,priceFor,depositFor,updateSettings,resetSettings} from '../src/services/settings.ts';
import {addDays,dayRange,monthBounds,weekBounds} from '../src/utils/date.ts';

test('price uses hourly rate, duration and peak surcharge',()=>{
 resetSettings();
 assert.equal(priceFor('padel',60,'10:00'),24000);
 assert.equal(priceFor('padel',90,'10:00'),36000);
 assert.equal(priceFor('padel',60,'20:00'),27600);
 assert.equal(depositFor(24000),7200);
});
test('editing rates changes prices immediately',()=>{
 resetSettings();
 updateSettings(s=>({...s,rates:{...s.rates,tenis:20000}}));
 assert.equal(priceFor('tenis',60,'10:00'),20000);
 resetSettings();
 assert.equal(getSettings().rates.tenis,14000);
});
test('date helpers cover weeks and months',()=>{
 assert.equal(addDays('2026-11-30',1),'2026-12-01');
 assert.deepEqual(monthBounds('2026-02-10'),{from:'2026-02-01',to:'2026-02-28'});
 assert.deepEqual(weekBounds('2026-11-16'),{from:'2026-11-16',to:'2026-11-22'});
 assert.equal(dayRange('2026-11-01','2026-11-30').length,30);
});
test('ledger totals add up and mark paid works',async()=>{
 resetSettings();
 const rows=await bookingService.listRange('2030-03-01','2030-03-03');
 const s=summarize(rows);
 assert(s.count>0);
 assert.equal(s.billed,s.collected+s.pending);
 const open=rows.find(b=>b.payment!=='pagado')!;
 await bookingService.markPaid(open.id);
 const after=(await bookingService.list(open.date)).find(b=>b.id===open.id)!;
 assert.equal(after.payment,'pagado');
 assert.equal(after.paid,after.amount);
 assert(summarize(await bookingService.listRange('2030-03-01','2030-03-03')).collected>s.collected);
});
test('past days are mostly collected, grouped totals match',async()=>{
 const rows=await bookingService.listRange('2020-01-01','2020-01-07');
 const s=summarize(rows);
 assert(s.collected/s.billed>0.85);
 assert.equal(groupSum(rows,b=>b.courtId,b=>b.amount??0).reduce((a,x)=>a+x.total,0),s.billed);
});
test('csv is Excel-friendly',()=>{
 const csv=toCsv([['Fecha','Cliente'],['2026-11-16','Los "Halcones"; FC']]);
 assert(csv.startsWith('\ufeff'));
 assert(csv.includes('"Los ""Halcones""; FC"'));
 assert(csv.includes(';'));
});
