import speechPack from '../native/speechPack.js';
/** Состояние офлайн-пакета распознавания для языка: 'installed' | 'pending' | 'download' (можно скачать) | 'online' (только через интернет) | 'none' | '' (проверить нельзя). */
export default async function speechStatus(lang) {
  const s = await speechPack('check', lang).catch(() => null);
  if (!s?.checked) return '';
  return s.installed ? 'installed' : s.pending ? 'pending' : s.supported ? 'download' : s.online ? 'online' : 'none';
}
