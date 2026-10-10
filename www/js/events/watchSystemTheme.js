import applyPrefs from '../settings/applyPrefs.js';
/** Следит за сменой системной темы (актуально для режима «Системная»). */
export default function watchSystemTheme() {
  globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', applyPrefs);
}
