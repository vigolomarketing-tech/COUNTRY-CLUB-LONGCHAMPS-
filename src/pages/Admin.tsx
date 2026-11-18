import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, LayoutDashboard, LogOut, RotateCcw, ShieldCheck } from 'lucide-react';
import { Agenda } from './admin/Agenda';
import { Prices } from './admin/Prices';
import { Courts } from './admin/Courts';
import { Accounting } from './admin/Accounting';
import { resetBookings } from '../services/bookingService';
import { resetSettings } from '../services/settings';

const TABS = [['agenda', 'Agenda'], ['contabilidad', 'Contabilidad'], ['precios', 'Precios'], ['canchas', 'Canchas']] as const;
type Tab = typeof TABS[number][0];
const DEMO_USER = 'administracion@countryclub.demo';
const KEY = 'cc-demo-auth';
let memoryAuth = false;
const readAuth = () => { try { return sessionStorage.getItem(KEY) === '1' || memoryAuth; } catch { return memoryAuth; } };
const writeAuth = (on: boolean) => { memoryAuth = on; try { on ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY); } catch { /* sin almacenamiento */ } };

function Login({ onEnter }: { onEnter: () => void }) {
  return <section className="inner-page container login-page">
    <form className="login-card" onSubmit={e => { e.preventDefault(); onEnter(); }}>
      <span className="success-icon small"><ShieldCheck size={30} /></span>
      <div className="eyebrow">PANEL DEL CLUB</div>
      <h1>Ingresá a tu panel<span className="orange">.</span></h1>
      <p>Cada persona del club entra con su usuario y su clave, con los permisos que le correspondan.</p>
      <label>Usuario<input type="email" defaultValue={DEMO_USER} autoComplete="username" /></label>
      <label>Contraseña<input type="password" defaultValue="demo1234" autoComplete="current-password" /></label>
      <button className="button orange-button" type="submit">Ingresar al panel</button>
      <small>Acceso de demostración: ya cargamos los datos de ejemplo. No necesitás escribir nada.</small>
    </form>
  </section>;
}

export function Admin() {
  const [params, setParams] = useSearchParams();
  const [authed, setAuthed] = useState(readAuth);
  const [epoch, setEpoch] = useState(0);
  const tab: Tab = TABS.some(([id]) => id === params.get('tab')) ? params.get('tab') as Tab : 'agenda';
  if (!authed) return <Login onEnter={() => { writeAuth(true); setAuthed(true); }} />;
  const go = (next: Tab) => setParams(prev => { const p = new URLSearchParams(prev); p.set('tab', next); return p; });
  const reset = () => { if (!window.confirm('¿Restablecer la demo? Se borran los cambios de precios, fotos, reservas y cobros que hiciste.')) return; resetSettings(); resetBookings(); setEpoch(n => n + 1); };
  return <section className="inner-page container admin-page">
    <div className="admin-top">
      <div><div className="eyebrow"><LayoutDashboard size={15} /> GESTIÓN DEL CLUB</div><h1>Todo el juego, a la vista<span className="orange">.</span></h1><p className="page-lead">Reservas, precios, canchas y contabilidad en un solo lugar.</p></div>
      <div className="admin-user"><span>{DEMO_USER}</span><button className="text-link" onClick={() => { writeAuth(false); setAuthed(false); }}><LogOut size={16} /> Salir</button></div>
    </div>
    <div className="demo-banner"><Activity size={19} /><strong>PANEL DE DEMOSTRACIÓN — DATOS DE EJEMPLO</strong><span>Lo que cambies se guarda en este navegador.</span><button className="text-link" onClick={reset}><RotateCcw size={15} /> Restablecer demo</button></div>
    <div className="admin-tabs" role="tablist" aria-label="Secciones del panel">{TABS.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>)}</div>
    <div key={epoch + tab} role="tabpanel">
      {tab === 'agenda' && <Agenda />}
      {tab === 'contabilidad' && <Accounting />}
      {tab === 'precios' && <Prices />}
      {tab === 'canchas' && <Courts />}
    </div>
  </section>;
}
