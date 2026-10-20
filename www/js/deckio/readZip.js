import unzip from './unzip.js';
import parseXlsx from './parseXlsx.js';
import rowsToCards from './rowsToCards.js';
import baseName from './baseName.js';
import ankiNotes from '../native/ankiNotes.js';
import bytesB64 from '../util/bytesB64.js';
/** Zip-файл: Excel (.xlsx) или колода Anki (.apkg; новая zstd-коллекция не поддерживается). */
export default async function readZip(name, bytes) {
  const files = await unzip(bytes), out = (format, rows) => ({ kind: 'cards', format, name: baseName(name), cards: rowsToCards(rows) });
  if (files.has('xl/workbook.xml')) return out('Excel (.xlsx)', parseXlsx(files));
  const col = files.get('collection.anki21') ?? files.get('collection.anki2');
  if (col) return out('Anki (.apkg)', await ankiNotes(bytesB64(col)));
  if (files.has('collection.anki21b')) throw new Error('Колода Anki в новом формате: экспортируйте её как «Заметки в виде текста» или с галочкой «Поддержка старых версий Anki»');
  throw new Error('Этот тип архива не поддерживается (нужен .xlsx или .apkg)');
}
