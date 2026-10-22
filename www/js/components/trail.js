import { QUEST } from '../constants/QUEST.js';
import trailPoints from './trailPoints.js';
const seg = ([x0, y0], [x1, y1], cls) => `<path class="seg${cls}" d="M${x0} ${y0}C${(x0 + x1) / 2} ${y0} ${(x0 + x1) / 2} ${y1} ${x1} ${y1}"/>`;
const node = ([x, y], k, q, last) => {
  const mark = q.marks[k - 1], cur = !q.over && !q.result && k === q.i + 1, boss = k === last;
  const label = mark === 'ok' ? '✓' : mark === 'bad' ? '✗' : boss ? (q.over && q.won ? '🏆' : '🐉') : k;
  return `<g class="node${mark ? ` ${mark}` : ''}${cur ? ' cur' : ''}${boss ? ' boss' : ''}"><circle cx="${x}" cy="${y}" r="${boss ? 10 : 8}"/><text x="${x}" y="${y + (boss && !mark ? 4.5 : 3.5)}">${label}</text></g>`;
};
/**
 * Тропинка квеста (SVG): путь из узлов-этапов (✓ / ✗ по ответам, 🐉 «босс» в конце), палатка в начале и персонаж q.hero.
 * Герой стоит у узла q.i; ответил — идёт к узлу q.i + 1 (при q.walking рисуется на старом месте с data-to — дальше его двигает dom/walkHero, плавно).
 */
export default function trail(q) {
  const n = q.stages.length, pts = trailPoints(n), at = k => `${pts[k][0]}px,${pts[k][1]}px`, done = q.result || q.over ? q.i + 1 : q.i;
  const from = q.walking ? q.i : done, state = q.result === 'bad' ? ' bad' : q.result === 'ok' ? ' ok' : '';
  const path = pts.slice(1).map((p, k) => seg(pts[k], p, k < done ? ' done' : '')).join('');
  return `<svg class="trail" viewBox="0 0 ${QUEST.trail.w} ${QUEST.trail.h}" role="img" aria-label="Тропинка квеста">${path}` +
    `<text class="tent" x="${pts[0][0]}" y="${pts[0][1] + 5}">🏕️</text>${pts.slice(1).map((p, k) => node(p, k + 1, q, n)).join('')}` +
    `<g id="hero" class="hero${state}" style="transform:translate(${at(from)})" data-to="${at(done)}"><text class="hh" y="-${QUEST.trail.hero}">${q.hero}</text></g></svg>`;
}
