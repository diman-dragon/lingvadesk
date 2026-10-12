/** Область учёбы → условие SQL по таблицам cards c / decks d. 'all' | 'p:<проект>' | 'd:<колода>'. */
export default function scopeClause(scope) {
  const [kind, id] = String(scope).split(':');
  if (kind === 'p') return { where: 'd.language_id=?', params: [Number(id)] };
  if (kind === 'd') return { where: 'd.id=?', params: [Number(id)] };
  return { where: '1=1', params: [] };
}
