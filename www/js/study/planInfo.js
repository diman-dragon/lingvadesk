/** Колоды со счётчиками на сегодня: fresh — новых в пределах дневного лимита (на колоду), left — по плану (повторить + новые), newAll — все новые (не изучавшиеся). lim — study/loadLimits. */
export default function planInfo(decks, lim) {
  return decks.map(d => {
    const fresh = Math.min(Number(d.fresh), Math.max(0, lim.perDay - (lim.used[d.id] ?? 0)));
    return { ...d, newAll: Number(d.fresh), fresh, left: Number(d.due) + fresh };
  });
}
