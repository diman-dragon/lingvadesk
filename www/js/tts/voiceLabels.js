import { VOICE_NAMES } from '../constants/VOICE_NAMES.js';
import voiceGender from './voiceGender.js';
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100003, 7);
/**
 * Подписи голосов: «Анна · en-US · высокое». Имя берётся по коду голоса и полу; одинаковые подписи различаются номером («Анна 2»).
 * Голос без пола подписывается его именем Android. → Map: имя голоса → подпись.
 */
export default function voiceLabels(voices) {
  const used = {}, out = new Map();
  for (const v of voices) {
    const g = voiceGender(v), lang = String(v.lang).replace('_', '-'), base = g ? VOICE_NAMES[g][hash(v.name) % VOICE_NAMES[g].length] : v.name.replace(/-(local|network)$/, '');
    const key = `${g}${lang}${base}`, n = (used[key] = (used[key] ?? 0) + 1);
    out.set(v.name, [`${base}${n > 1 ? ` ${n}` : ''}`, lang, v.quality >= 400 ? 'высокое' : '', v.offline ? '' : 'онлайн'].filter(Boolean).join(' · '));
  }
  return out;
}
