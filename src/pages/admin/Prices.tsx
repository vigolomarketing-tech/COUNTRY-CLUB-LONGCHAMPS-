import { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { sports } from '../../data/demo';
import { defaultSettings, depositFor, priceFor, updateSettings } from '../../services/settings';
import { useSettings } from '../../services/useSettings';
import { money } from '../../utils/money';
import type { Sport } from '../../types/booking';

const PEAK_HOURS = [17, 18, 19, 20, 21];
const SURCHARGES = [0, 0.1, 0.15, 0.2, 0.25];
const DEPOSITS = [0, 0.2, 0.3, 0.5, 1];
const pct = (n: number) => `${Math.round(n * 100)}%`;

export function Prices() {
  const s = useSettings();
  const [saved, setSaved] = useState('');
  const change = (fn: Parameters<typeof updateSettings>[0]) => { setSaved(updateSettings(fn) ? 'Cambios guardados. Ya se ven en la web de reservas.' : 'No se pudo guardar en este navegador.'); };

  return <div className="admin-columns">
    <div className="admin-card">
      <div className="card-heading"><div><div className="eyebrow">TARIFAS</div><h2>Precio por hora</h2></div><span className="pill">Valores de ejemplo</span></div>
      <div className="form-stack">
        {sports.map(sport => <label className="money-field" key={sport.id}>
          <span>{sport.name}</span>
          <div><b>$</b><input type="number" inputMode="numeric" min={0} step={500} value={s.rates[sport.id as Sport]} onChange={e => change(cur => ({ ...cur, rates: { ...cur.rates, [sport.id]: Math.max(0, Number(e.target.value) || 0) } }))} /><small>por hora</small></div>
        </label>)}
        <div className="field-row">
          <label>Horario pico desde<select value={s.peakFrom} onChange={e => change(cur => ({ ...cur, peakFrom: Number(e.target.value) }))}>{PEAK_HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}</select></label>
          <label>Recargo en horario pico<select value={s.peakSurcharge} onChange={e => change(cur => ({ ...cur, peakSurcharge: Number(e.target.value) }))}>{SURCHARGES.map(v => <option key={v} value={v}>{v ? '+' + pct(v) : 'Sin recargo'}</option>)}</select></label>
          <label>Seña online<select value={s.depositRate} onChange={e => change(cur => ({ ...cur, depositRate: Number(e.target.value) }))}>{DEPOSITS.map(v => <option key={v} value={v}>{v === 0 ? 'Sin seña' : v === 1 ? 'Pago total' : pct(v)}</option>)}</select></label>
        </div>
        <div className="form-actions">
          <button className="button outline-button" onClick={() => change(cur => ({ ...cur, rates: defaultSettings().rates, peakFrom: 18, peakSurcharge: 0.15, depositRate: 0.3 }))}><RotateCcw size={16} /> Volver a los valores de ejemplo</button>
          {saved && <span role="status" className="saved"><CheckCircle2 size={16} /> {saved}</span>}
        </div>
      </div>
    </div>
    <div className="admin-card">
      <div className="card-heading"><div><div className="eyebrow">VISTA PREVIA</div><h2>Así lo ve el cliente</h2></div></div>
      <div className="table-scroll"><table>
        <thead><tr><th>Deporte</th><th>60 min</th><th>90 min</th><th>120 min</th><th>Pico (60 min)</th></tr></thead>
        <tbody>{sports.map(sport => <tr key={sport.id}><td><strong>{sport.name}</strong></td>{[60, 90, 120].map(d => <td key={d}>{money(priceFor(sport.id as Sport, d, '10:00', s))}</td>)}<td>{money(priceFor(sport.id as Sport, 60, `${s.peakFrom}:00`, s))}</td></tr>)}</tbody>
      </table></div>
      <p className="photo-note pad">Seña de una hora de padel en horario normal: {money(depositFor(priceFor('padel', 60, '10:00', s), s))}. Los precios que cambies acá se aplican a las nuevas reservas, a la agenda y a la contabilidad de esta demo.</p>
    </div>
  </div>;
}
