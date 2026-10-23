import parseImport from './parseImport.js';
import parseJsonCards from './parseJsonCards.js';
import parseTextRows from './parseTextRows.js';
import rowsToCards from './rowsToCards.js';
import formatOf from './formatOf.js';
import parseDialogText from './parseDialogText.js';
import baseName from './baseName.js';
const cardsOf = (format, name, cards) => ({ kind: 'cards', format, name: baseName(name), cards });
/**
 * Текст → { kind: 'library', library } (наш JSON) или { kind: 'cards', format, name, cards } (всё остальное):
 * чужой JSON, диалог («A: фраза | перевод»), CSV / TSV / «;» / «|», Anki (текст), Quizlet, списки «слово — перевод». Для диалога ещё dialog: true и lang.
 */
export default function readImportText(name, text) {
  if (/^\s*[[{]/.test(text)) {
    try { return { kind: 'library', format: 'LingvaDesk (JSON)', library: parseImport(text) }; } catch { /* чужой JSON — ниже */ }
    try { const cards = parseJsonCards(JSON.parse(text)); if (cards.length) return cardsOf('JSON', name, cards); } catch { /* не JSON — таблица */ }
  }
  const dialog = parseDialogText(text);
  if (dialog) return { ...cardsOf('Диалог', dialog.name || name, dialog.cards), dialog: true, lang: dialog.lang };
  const cards = rowsToCards(parseTextRows(text));
  if (!cards.length) throw new Error('Не нашёл карточек: нужен список «слово — перевод» или таблица (CSV, TSV, Anki, Quizlet)');
  return cardsOf(formatOf(text), name, cards);
}
