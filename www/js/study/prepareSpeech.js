import { state } from '../state/appState.js';
import speechPack from '../native/speechPack.js';
import toast from '../dom/toast.js';
/**
 * Перед первой попыткой на языке (раз за запуск): есть ли офлайн-пакет. Нет, но его можно скачать — запускаем скачивание (пока работает
 * распознавание через сеть). Язык недоступен совсем — предупреждаем. Старые Android проверить не умеют: SpeechListener сам перейдёт на сеть.
 * force — проверить заново (кнопка в настройках). → строка-итог для сообщения или ''.
 */
export default async function prepareSpeech(lang, force = false) {
  if (state.speechChecked[lang] && !force) return '';
  state.speechChecked[lang] = true;
  const s = await speechPack('check', lang).catch(() => null);
  if (!s?.checked || s.installed) return s?.installed ? `${lang}: пакет установлен` : '';
  if (s.supported && !s.pending) {
    await speechPack('download', lang).catch(() => {});
    if (!force) toast('Скачиваю офлайн-пакет языка для распознавания…');
    return `${lang}: скачиваю пакет`;
  }
  const text = s.pending ? `${lang}: пакет скачивается` : s.online ? `${lang}: только через интернет` : `${lang}: язык не поддерживается`;
  if (!force && !s.online && !s.pending) toast(text);
  return text;
}
