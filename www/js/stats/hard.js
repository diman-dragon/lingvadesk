import esc from '../util/esc.js';
/** Параметр «Трудные»: карточки с наибольшим числом «снова». */
export default function hard(d) {
  const rows = d.hard.map(c => `<div class="hrow"><span>🐛 <b>${esc(c.front)}</b> — ${esc(c.back)}</span><em>${c.n}×</em></div>`).join('');
  return { icon: '🐛', title: 'Трудные', value: d.hard.length, sub: 'чаще всего «снова»', detail: `<h4>Чаще всего «снова»</h4>${rows || '<div class="muted">Трудных карточек пока нет</div>'}` };
}
