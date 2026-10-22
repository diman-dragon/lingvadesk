const base = tag => String(tag).split(/[-_]/)[0].toLowerCase();
const norm = tag => String(tag).replace('_', '-').toLowerCase();
/**
 * Голоса для выбора: только локальные (работают без интернета), той же основы языка (en-US → и en-GB), точное совпадение первым, затем качество и имя.
 * current — уже выбранный голос показывается, даже если он онлайн или не из этого языка (иначе список бы «соврал» о том, чем говорит приложение).
 */
export default function voicesFor(list, lang, current = '') {
  const exact = v => (norm(v.lang) === norm(lang) ? 0 : 1);
  return list.filter(v => (v.offline && base(v.lang) === base(lang)) || v.name === current)
    .sort((a, b) => exact(a) - exact(b) || b.quality - a.quality || a.name.localeCompare(b.name));
}
