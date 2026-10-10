/** 'auto' → системная тема, иначе как выбрано. */
export default function resolveTheme(pref) {
  if (pref !== 'auto') return pref;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
