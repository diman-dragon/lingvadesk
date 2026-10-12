/** Область, которой уже нет (проект или колоду удалили), заменяется на «всю библиотеку». */
export default function validScope(scope, projects, decks) {
  const [kind, id] = String(scope).split(':');
  if (kind === 'p' && projects.some(p => p.id === Number(id))) return scope;
  if (kind === 'd' && decks.some(d => d.id === Number(id))) return scope;
  return 'all';
}
