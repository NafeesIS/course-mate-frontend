// Put this above your component (or in a utils hook file)
import { useEffect, useMemo, useState } from 'react';

export function useTimeAgo(
  dateInput: string | number | Date,
  refreshMs = 60_000
) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  return useMemo(() => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();

    const sec = Math.max(1, Math.floor(diffMs / 1000));
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const wk = Math.floor(day / 7);
    const mo = Math.floor(day / 30);
    const yr = Math.floor(day / 365);

    if (sec < 60) return 'just now';
    if (min < 60) return `${min} min `;
    if (hr < 24) return `${hr} ${hr === 1 ? 'hour' : 'hours'} `;
    if (day < 7) return `${day} ${day === 1 ? 'day' : 'days'} `;
    if (wk < 5) return `${wk} ${wk === 1 ? 'week' : 'weeks'} `;
    if (mo < 12) return `${mo} ${mo === 1 ? 'month' : 'months'} `;
    return `${yr} ${yr === 1 ? 'year' : 'years'} `;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateInput, tick]);
}
