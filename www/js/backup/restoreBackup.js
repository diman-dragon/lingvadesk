import safOpen from '../native/safOpen.js';
import backupRestore from '../native/backupRestore.js';
export default async function restoreBackup() {
  const file = await safOpen();
  if (!/\.fcbak$/i.test(file.name)) throw new Error('Выберите файл .fcbak');
  return backupRestore(file.data); // { safety }
}
