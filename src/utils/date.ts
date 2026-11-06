/** The club's calendar always uses Argentina time, regardless of the visitor's device. */
export const CLUB_TIME_ZONE = 'America/Argentina/Buenos_Aires';
export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const clubClock = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: CLUB_TIME_ZONE, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23' }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)!.value;
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour'))*60+Number(get('minute'))+Number(get('second'))/60 };
};
export const today = () => clubClock().date;
export const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number(value.slice(0,4)) >= 2000 && !Number.isNaN(Date.parse(value+'T12:00:00Z')) && new Date(value+'T12:00:00Z').toISOString().slice(0,10) === value;
export const isFutureSlot = (date: string,time: string,now = new Date()) => {
  if(!isValidDate(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return false;
  const clock=clubClock(now);
  return date>clock.date||(date===clock.date&&Number(time.slice(0,2))*60+Number(time.slice(3))>clock.minutes);
};
export const formatDate = (value: string) => new Date(value+'T12:00:00Z').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric',timeZone:CLUB_TIME_ZONE});
