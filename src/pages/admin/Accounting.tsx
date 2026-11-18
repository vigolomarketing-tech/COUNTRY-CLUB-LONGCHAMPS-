import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, CheckCircle2 } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { groupSum, reserved, sportOf, summarize, toCsv } from '../../services/accounting';
import { courts as baseCourts, sports } from '../../data/demo';
import { courtView } from '../../services/settings';
import { useSettings } from '../../services/useSettings';
import { addDays, dayRange, formatDate, formatShort, isValidDate, monthBounds, today, weekBounds } from '../../utils/date';
import { money, moneyShort } from '../../utils/money';
import type { Booking } from '../../types/booking';

type Preset = 'hoy' | 'semana' | 'mes' | 'anterior' | 'custom';
const PRESETS: [Preset, string][] = [['hoy', 'Hoy'], ['semana', 'Esta semana'], ['mes', 'Este mes'], ['anterior', 'Mes anterior']];
const PAGE = 20;
const boundsFor = (preset: Preset, from: string, to: string) => {
  const t = today();
  if (preset === 'hoy') return { from: t, to: t };
  if (preset === 'semana') return weekBounds(t);
  if (preset === 'mes') return monthBounds(t);
  if (preset === 'anterior') return monthBounds(addDays(monthBounds(t).from, -1));
  return { from, to };
};
const download = (name: string, content: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function Accounting() {
  const settings = useSettings();
  const [params] = useSearchParams();
  const urlFrom = params.get('from') ?? '', urlTo = params.get('to') ?? '';
  const startsCustom = isValidDate(urlFrom) && isValidDate(urlTo) && urlFrom <= urlTo;
  const [preset, setPreset] = useState<Preset>(startsCustom ? 'custom' : 'mes');
  const [custom, setCustom] = useState({ from: startsCustom ? urlFrom : today(), to: startsCustom ? urlTo : today() });
  const range = boundsFor(preset, custom.from, custom.to);
  const days = dayRange(range.from, range.to);
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState('');
  const courts = useMemo(() => baseCourts.map(c => courtView(c, settings)), [settings]);

  useEffect(() => { let on = true; setLoading(true); bookingService.listRange(range.from, range.to).then(list => { if (on) { setRows(list); setLoading(false); setPage(0); } }); return () => { on = false; }; }, [range.from, range.to, version, settings]);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 3500); return () => clearTimeout(id); }, [toast]);

  const ledger = useMemo(() => reserved(rows).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time) || a.courtId.localeCompare(b.courtId)), [rows]);
  const sum = summarize(rows);
  const activeCourts = courts.filter(c => c.active).length;
  const occupancy = activeCourts && days.length ? Math.round(sum.minutes / (activeCourts * 14 * 60 * days.length) * 100) : 0;
  const nameOf = (id: string) => courts.find(c => c.id === id)?.name ?? id;
  const perDay = days.map(day => { const list = ledger.filter(b => b.date === day); return { day, billed: list.reduce((a, b) => a + (b.amount ?? 0), 0), collected: list.reduce((a, b) => a + (b.paid ?? 0), 0) }; });
  const maxDay = Math.max(1, ...perDay.map(d => d.billed));
  const bySport = groupSum(rows, b => sports.find(s => s.id === sportOf(b.courtId))!.name, b => b.amount ?? 0);
  const byMethod = [...groupSum(rows, b => b.method ?? 'Sin cobrar', b => b.paid ?? 0), { name: 'Por cobrar', total: sum.pending }].filter(x => x.total > 0).sort((a, b) => b.total - a.total);
  const pages = Math.max(1, Math.ceil(ledger.length / PAGE));
  const visible = ledger.slice(page * PAGE, page * PAGE + PAGE);

  const exportCsv = () => {
    const head = ['Fecha', 'Hora', 'Cancha', 'Deporte', 'Cliente', 'Origen', 'Medio de cobro', 'Importe', 'Cobrado', 'Saldo', 'Estado'];
    const body = ledger.slice().reverse().map(b => [b.date, b.time, nameOf(b.courtId), sports.find(s => s.id === sportOf(b.courtId))!.name, b.name, b.source === 'web' ? 'Web' : 'Mostrador', b.method ?? '', b.amount ?? 0, b.paid ?? 0, (b.amount ?? 0) - (b.paid ?? 0), b.payment ?? '']);
    download(`registro-alquileres-${range.from}_${range.to}.csv`, toCsv([head, ...body]));
    setToast('Descargamos el registro. Se abre directo en Excel.');
  };
  const collect = async (id: string) => { try { await bookingService.markPaid(id); setVersion(v => v + 1); setToast('Cobro registrado.'); } catch (e) { setToast((e as Error).message); } };
  const setDate = (key: 'from' | 'to', value: string) => { if (!isValidDate(value)) return; setPreset('custom'); setCustom(cur => { const next = { ...cur, [key]: value }; if (next.from > next.to) next[key === 'from' ? 'to' : 'from'] = value; return next; }); };

  return <>
    <div className="admin-toolbar ledger-toolbar">
      <div className="segmented" role="group" aria-label="Período">{PRESETS.map(([id, label]) => <button key={id} aria-pressed={preset === id} className={preset === id ? 'active' : ''} onClick={() => setPreset(id)}>{label}</button>)}</div>
      <label>Desde<input type="date" value={range.from} onChange={e => setDate('from', e.target.value)} /></label>
      <label>Hasta<input type="date" value={range.to} onChange={e => setDate('to', e.target.value)} /></label>
      <div className="toolbar-buttons"><button className="button blue-button" onClick={exportCsv} disabled={!ledger.length}><Download size={17} /> Exportar a Excel</button></div>
    </div>
    <p className="range-note">Período: {formatDate(range.from)}{range.from !== range.to && ` al ${formatDate(range.to)}`}{days.length >= 93 && ' (mostramos hasta 93 días)'}</p>
    <div className="stats-grid five">{[['Facturación', moneyShort(sum.billed)], ['Cobrado', moneyShort(sum.collected)], ['Por cobrar', moneyShort(sum.pending)], ['Turnos', String(sum.count)], ['Ticket promedio', moneyShort(sum.average)]].map(([label, value]) => <div className="stat-card" key={label}><strong>{value}</strong><span>{label}{label !== 'Turnos' ? ' (ejemplo)' : ''}</span></div>)}</div>
    <div className="admin-columns wide-first">
      <div className="admin-card">
        <div className="card-heading"><div><div className="eyebrow">EVOLUCIÓN</div><h2>Facturación por día</h2></div><span className="legend-inline"><i /> Cobrado <i className="light" /> Reservado · ocupación {occupancy}%</span></div>
        <div className="daybars" role="img" aria-label="Facturación diaria del período">{perDay.map(d => <div className="daybar" key={d.day} title={`${formatShort(d.day)}: ${money(d.billed)} reservado, ${money(d.collected)} cobrado`}><i style={{ height: d.billed / maxDay * 100 + '%' }}><b style={{ height: d.billed ? d.collected / d.billed * 100 + '%' : '0%' }} /></i></div>)}</div>
        <div className="daybars-axis"><span>{formatShort(range.from)}</span><span>{formatShort(range.to)}</span></div>
      </div>
      <div className="admin-card">
        <div className="card-heading"><h2>Por deporte y medio de cobro</h2></div>
        <h3 className="chart-title">Facturación por deporte</h3>
        {bySport.map(x => <div className="bar-row wide-label" key={x.name}><span>{x.name}</span><div><i style={{ width: x.total / (bySport[0]?.total || 1) * 100 + '%' }} /></div><strong>{moneyShort(x.total)}</strong></div>)}
        <h3 className="chart-title">Cobrado por medio de pago</h3>
        {byMethod.map(x => <div className="bar-row wide-label" key={x.name}><span>{x.name}</span><div><i className={x.name === 'Por cobrar' ? 'warn' : ''} style={{ width: x.total / (byMethod[0]?.total || 1) * 100 + '%' }} /></div><strong>{moneyShort(x.total)}</strong></div>)}
      </div>
    </div>
    <div className="admin-card spaced">
      <div className="card-heading"><div><div className="eyebrow">REGISTRO AUTOMÁTICO</div><h2>Alquileres del período</h2></div><span>{ledger.length} registros{loading && ' · cargando…'}</span></div>
      <div className="table-scroll"><table className="ledger">
        <thead><tr><th>Fecha</th><th>Hora</th><th>Cancha</th><th>Cliente</th><th>Origen</th><th>Medio</th><th className="num">Importe</th><th className="num">Cobrado</th><th className="num">Saldo</th><th>Estado</th><th /></tr></thead>
        <tbody>{visible.map(b => { const saldo = (b.amount ?? 0) - (b.paid ?? 0); return <tr key={b.id}><td>{formatShort(b.date)}</td><td>{b.time}</td><td>{nameOf(b.courtId)}</td><td>{b.name}</td><td>{b.source === 'web' ? 'Web' : 'Mostrador'}</td><td>{b.method ?? '—'}</td><td className="num">{money(b.amount ?? 0)}</td><td className="num">{money(b.paid ?? 0)}</td><td className="num">{saldo ? money(saldo) : '—'}</td><td><span className={'status ' + b.payment}>{b.payment}</span></td><td>{b.payment !== 'pagado' && <button className="text-link" onClick={() => collect(b.id)}>Registrar cobro</button>}</td></tr>; })}</tbody>
      </table>{!ledger.length && !loading && <p className="empty-state">No hay alquileres en este período.</p>}</div>
      {pages > 1 && <div className="pager"><button className="text-link" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Anterior</button><span>Página {page + 1} de {pages}</span><button className="text-link" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Siguiente →</button></div>}
    </div>
    {toast && <div role="status" className="toast"><CheckCircle2 size={20} />{toast}</div>}
  </>;
}
