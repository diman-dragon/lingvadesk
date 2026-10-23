import { DIALOG } from '../constants/DIALOG.js';
import loadVoiceList from '../tts/loadVoiceList.js';
import resolveVoice from '../tts/resolveVoice.js';
import voiceLabels from '../tts/voiceLabels.js';
import slotOf from './slotOf.js';
/**
 * Имена ролей сцены: { роль: подпись }. Роль пользователя — «Вы»; озвученная — имя её голоса (из страницы «Голос», «Анна»),
 * если голос выбран, иначе «Роль N». ext — подпись с пояснением для экрана настройки («Анна · en-US»; «голос по умолчанию»).
 */
export default async function roleNames(d, ext = false) {
  const list = await loadVoiceList(), out = {};
  for (let r = 1; r <= DIALOG.roles; r++) {
    const voice = list.find(v => v.name === resolveVoice(d.lang, slotOf(r))), label = voice ? voiceLabels([voice]).get(voice.name) : '';
    out[r] = r === d.you ? 'Вы' : label ? (ext ? label : label.split(' · ')[0]) : ext ? `Роль ${r} — голос по умолчанию` : `Роль ${r}`;
  }
  return out;
}
