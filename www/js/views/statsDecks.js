import esc from '../util/esc.js';
/** Страница «Колоды»: прогресс каждой колоды (самые активные за 30 дней — первыми, не больше шести). */
export default function statsDecks(d) {
  const by = Object.fromEntries(d.perDeck.map(x => [x.id, x]));
  const list = d.decks.map(x => ({ ...x, n: Number(by[x.id]?.n ?? 0), ok: Number(by[x.id]?.ok ?? 0) })).sort((a, b) => b.n - a.n || b.total - a.total);
  const rows = list.slice(0, 6).map(x => {
    const pct = x.total ? Math.round(100 * x.mature / x.total) : 0, ret = x.n ? ` · удержание ${Math.round(100 * x.ok / x.n)}%` : '';
    return `<div class="drow"><b>${esc(x.pname)} · ${esc(x.name)}</b><span>${x.total} карт. · выучено ${x.mature} · повторить ${x.due} · за 30 дн. ${x.n}${ret}</span><div class="prog"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
  return `<h4>Колоды</h4>${rows || '<div class="muted">Колод пока нет</div>'}` + (list.length > 6 ? `<div class="muted note">…и ещё ${list.length - 6}</div>` : '');
}
