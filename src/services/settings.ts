import type { Court, Sport } from '../types/booking.ts';
export interface CourtSetting { name?: string; image?: string; active?: boolean }
export interface Settings { rates: Record<Sport, number>; peakFrom: number; peakSurcharge: number; depositRate: number; courts: Record<string, CourtSetting> }
/** Valores de EJEMPLO: el club define sus tarifas reales desde el panel. */
export const defaultSettings = (): Settings => ({ rates: { futbol: 36000, tenis: 14000, padel: 24000 }, peakFrom: 18, peakSurcharge: 0.15, depositRate: 0.3, courts: {} });
const KEY = 'cc-demo-settings-v1';
const storage = (): Storage | null => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } };
const load = (): Settings => {
  try {
    const raw = storage()?.getItem(KEY); if (!raw) return defaultSettings();
    const saved = JSON.parse(raw) as Partial<Settings>; const base = defaultSettings();
    return { ...base, ...saved, rates: { ...base.rates, ...saved.rates }, courts: saved.courts ?? {} };
  } catch { return defaultSettings(); }
};
let state = load();
const listeners = new Set<() => void>();
const persist = () => { try { storage()?.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; } };
export const getSettings = () => state;
export const subscribeSettings = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
/** Devuelve false si el navegador no pudo guardar (por ejemplo, fotos muy pesadas). */
export const updateSettings = (change: (current: Settings) => Settings) => { state = change(state); const ok = persist(); listeners.forEach(l => l()); return ok; };
export const resetSettings = () => { state = defaultSettings(); try { storage()?.removeItem(KEY); } catch { /* sin almacenamiento */ } listeners.forEach(l => l()); };
const round100 = (n: number) => Math.round(n / 100) * 100;
export const priceFor = (sport: Sport, duration: number, time?: string, s: Settings = state) => round100(s.rates[sport] * duration / 60 * (time && Number(time.slice(0, 2)) >= s.peakFrom ? 1 + s.peakSurcharge : 1));
export const depositFor = (amount: number, s: Settings = state) => round100(amount * s.depositRate);
export const courtView = (court: Court, s: Settings = state): Court => ({ ...court, name: s.courts[court.id]?.name?.trim() || court.name, image: s.courts[court.id]?.image || '', active: s.courts[court.id]?.active !== false });
