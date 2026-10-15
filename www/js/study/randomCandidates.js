import listDecksOfProject from '../repo/listDecksOfProject.js';
import getScopeStats from '../repo/getScopeStats.js';
/** Колоды (id), из которых можно взять «Случайную колоду»: у проекта — все непустые, у колоды — она сама; у «всей библиотеки» — никаких. */
export default async function randomCandidates(scope) {
  const [kind, id] = String(scope).split(':');
  if (kind === 'p') return (await listDecksOfProject(Number(id))).filter(d => d.n > 0).map(d => d.id);
  if (kind === 'd') return (await getScopeStats(scope)).total ? [Number(id)] : [];
  return [];
}
