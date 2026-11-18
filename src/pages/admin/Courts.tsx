import { useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { courts, sports } from '../../data/demo';
import { asset } from '../../config/club';
import { courtView, updateSettings } from '../../services/settings';
import { useSettings } from '../../services/useSettings';

const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const url = URL.createObjectURL(file); const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, 900 / Math.max(img.width, img.height)); const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url);
    resolve(canvas.toDataURL('image/jpeg', 0.78));
  };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No pudimos leer esa imagen. Probá con un JPG o PNG.')); };
  img.src = url;
});

export function Courts() {
  const s = useSettings();
  const [message, setMessage] = useState('');
  const patch = (id: string, change: Partial<{ name: string; image: string; active: boolean }>) => updateSettings(cur => ({ ...cur, courts: { ...cur.courts, [id]: { ...cur.courts[id], ...change } } }));
  const upload = async (id: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMessage('Elegí un archivo de imagen (JPG o PNG).'); return; }
    try { const image = await toDataUrl(file); setMessage(patch(id, { image }) ? 'Foto actualizada. Ya se ve en la reserva.' : 'La foto es muy pesada para este navegador. En el sistema real se guardan en la nube sin límite.'); }
    catch (e) { setMessage((e as Error).message); }
  };
  return <div className="admin-card">
    <div className="card-heading"><div><div className="eyebrow">CANCHAS</div><h2>Nombres, fotos y disponibilidad</h2></div><span className="pill">Se ven en el paso “Cancha” de la reserva</span></div>
    {message && <p role="status" className="saved pad"><span>{message}</span></p>}
    <div className="court-grid">{courts.map(base => {
      const c = courtView(base, s); const fallback = asset(sports.find(x => x.id === c.sport)!.image);
      return <article className={'court-card' + (c.active ? '' : ' off')} key={c.id}>
        <img src={c.image || fallback} alt={`Foto de ${c.name}`} loading="lazy" />
        <div className="court-body">
          <label>Nombre<input value={s.courts[c.id]?.name ?? c.name} onChange={e => patch(c.id, { name: e.target.value })} onBlur={e => { if (!e.target.value.trim()) patch(c.id, { name: '' }); }} /></label>
          <label className="check"><input type="checkbox" checked={c.active} onChange={e => patch(c.id, { active: e.target.checked })} /> Disponible para reservas</label>
          <div className="court-actions">
            <label className="button outline-button file-button"><ImagePlus size={16} /> {c.image ? 'Cambiar foto' : 'Subir foto'}<input type="file" accept="image/*" onChange={e => { upload(c.id, e.target.files?.[0]); e.target.value = ''; }} /></label>
            {c.image && <button className="text-link" onClick={() => patch(c.id, { image: '' })}><Trash2 size={15} /> Quitar</button>}
          </div>
        </div>
      </article>;
    })}</div>
  </div>;
}
