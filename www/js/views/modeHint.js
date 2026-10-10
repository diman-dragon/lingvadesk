/** Подсказка плитки режима: новые слова (learn), «N к повторению» (srs), «продолжить с N» (seq/shuffle). */
export default function modeHint(mode, { states, total, due, fresh }) {
  if (mode === 'learn') return fresh ? `${fresh} новых` : 'новых слов нет';
  if (mode === 'srs') return `${due} к повторению`;
  const s = states.find(x => x.mode === mode);
  return s && s.pos > 0 && s.pos < total ? `продолжить с ${s.pos + 1}` : '';
}
