import esc from '../util/esc.js';
/** Параметр «Слабые слова»: слова, которые получаются хуже всего в проверке произношения. */
export default function weak(d) {
  const rows = d.weak.map(w => `<div class="hrow"><span>🎤 <b>${esc(w.front)}</b> · ${w.n}×</span><em>${Math.round(100 * Number(w.s))}%</em></div>`).join('');
  return { icon: '🗣️', title: 'Слабые слова', value: d.weak.length, sub: 'хуже всего в произношении', detail: `<h4>Хуже всего получается</h4>${rows || '<div class="muted">Попыток пока нет — режим «Проверка произношения» на вкладке «Учёба»</div>'}` };
}
