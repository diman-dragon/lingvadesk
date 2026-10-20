const SCRIPTS = [[/[\u3040-\u30ff]/, 'ja-JP'], [/[\uac00-\ud7af]/, 'ko-KR'], [/[\u4e00-\u9fff]/, 'zh-CN'], [/[\u0600-\u06ff]/, 'ar-SA'], [/[\u0590-\u05ff]/, 'he-IL'], [/[\u0370-\u03ff]/, 'el-GR'], [/[\u0400-\u04ff]/, 'ru-RU']];
/** Голос озвучки для нового проекта по письменности слов (en-US, если латиница или непонятно). */
export default function guessTts(cards) {
  const sample = cards.slice(0, 50).map(c => c.front).join(' ');
  return SCRIPTS.find(([re]) => re.test(sample))?.[1] ?? 'en-US';
}
