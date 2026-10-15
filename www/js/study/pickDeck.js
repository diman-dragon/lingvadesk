import randomCandidates from './randomCandidates.js';
/** Область 'd:<id>' случайной колоды: из проекта — случайная непустая (не та же, что exclude, если есть выбор); колода — она сама; иначе null. */
export default async function pickDeck(scope, exclude = '') {
  const ids = (await randomCandidates(scope)).map(id => `d:${id}`);
  const pool = ids.length > 1 ? ids.filter(s => s !== exclude) : ids;
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
