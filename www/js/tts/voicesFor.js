const base = tag => String(tag).split(/[-_]/)[0].toLowerCase();
const norm = tag => String(tag).replace('_', '-').toLowerCase();
/** Голоса для языка озвучки: той же основы (en-US → и en-GB), точное совпадение первым, затем по качеству и имени. */
export default function voicesFor(list, lang) {
  const exact = v => (norm(v.lang) === norm(lang) ? 0 : 1);
  return list.filter(v => base(v.lang) === base(lang)).sort((a, b) => exact(a) - exact(b) || b.quality - a.quality || a.name.localeCompare(b.name));
}
