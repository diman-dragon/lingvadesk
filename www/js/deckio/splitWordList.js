const SEP = /\s+[-–—:=]\s+|\s*[–—]\s*|\t+|\s{3,}/;
/** Список «слово — перевод» (Quizlet, заметки): строки с « - », « – », « — », « : », « = », табуляцией или тремя пробелами. → string[][] */
export default function splitWordList(text) {
  return text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => l.split(SEP).map(c => c.trim())).filter(r => r.length >= 2);
}
