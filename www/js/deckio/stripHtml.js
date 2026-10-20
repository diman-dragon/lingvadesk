const ENT = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" };
/** Текст поля без HTML (Anki, Quizlet): переносы → пробел, теги и звуковые метки [sound:…] убираются, сущности раскрываются. */
export default function stripHtml(s) {
  return String(s ?? '').replace(/<br\s*\/?>|<\/(div|p|li)>/gi, ' ').replace(/\[sound:[^\]]*\]/g, '').replace(/<[^>]+>/g, '')
    .replace(/&(nbsp|amp|lt|gt|quot|apos|#39);/g, m => ENT[m]).replace(/\s+/g, ' ').trim();
}
