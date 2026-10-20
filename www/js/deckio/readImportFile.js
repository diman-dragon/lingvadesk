import b64Bytes from '../util/b64Bytes.js';
import decodeText from './decodeText.js';
import readImportText from './readImportText.js';
import readZip from './readZip.js';
/**
 * Файл из выбора { name, data (base64) } → результат readImportText: наш JSON, JSON / CSV / TSV / TXT, Anki (текст и .apkg),
 * Quizlet, Excel (.xlsx). Формат определяется по содержимому (zip по сигнатуре «PK»), кодировка — UTF-8 / UTF-16 / windows-1251.
 */
export default async function readImportFile({ name, data }) {
  const bytes = b64Bytes(data);
  const zip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  return zip ? readZip(name, bytes) : readImportText(name, decodeText(bytes));
}
