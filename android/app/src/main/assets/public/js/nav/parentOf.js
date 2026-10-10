/** Родительский экран для форм (запасной путь, если истории браузера нет). */
export default function parentOf(nav) {
  if (nav.v === 'courseForm') return nav.id ? { view: 'course', params: { id: nav.id } } : { view: 'library', params: {} };
  if (nav.v === 'deckForm') return nav.id ? { view: 'deck', params: { id: nav.id } } : { view: 'course', params: { id: nav.courseId } };
  if (nav.v === 'cardForm') return { view: 'deck', params: { id: nav.deckId } };
  return { view: 'library', params: {} };
}
