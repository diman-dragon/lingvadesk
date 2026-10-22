import esc from '../util/esc.js';
import button from './button.js';
import row from './row.js';
import settingRow from './settingRow.js';
import voiceGender from '../tts/voiceGender.js';
import voiceLabels from '../tts/voiceLabels.js';
import resolveVoice from '../tts/resolveVoice.js';
const GROUPS = [['f', 'Женские голоса'], ['m', 'Мужские голоса'], ['', 'Другие голоса']];
/**
 * Строка выбора голоса: язык озвучки + слот (роль). Список — только локальные голоса (voices уже отфильтрованы), сгруппированы «Женские» /
 * «Мужские» / «Другие», у каждого имя-ярлык, язык и качество. «▶» — проба выбранным голосом. Нет голосов — подсказка перейти на страницу «Языки».
 */
export default function voiceRow(lang, speaker, voices) {
  const cur = resolveVoice(lang, speaker.slot), labels = voiceLabels(voices), data = ` data-lang="${esc(lang)}" data-slot="${speaker.slot}"`;
  const opt = v => `<option value="${esc(v.name)}"${v.name === cur ? ' selected' : ''}>${esc(labels.get(v.name))}</option>`;
  const groups = GROUPS.map(([g, title]) => [title, voices.filter(v => voiceGender(v) === g)]).filter(([, list]) => list.length)
    .map(([title, list]) => `<optgroup label="${title}">${list.map(opt).join('')}</optgroup>`).join('');
  const sel = `<select data-act="setVoice" data-on="change"${data}><option value="">По умолчанию (системный)</option>${groups}</select>`;
  return settingRow(`${speaker.title} · ${lang}`, row(sel + button({ act: 'testVoice', cls: 'icon', label: '▶', aria: 'Проба голоса', data: { lang, slot: speaker.slot } }), 'vrow'),
    voices.length ? '' : 'Нет локальных голосов этого языка — скачайте их на странице «Языки»');
}
