import backupCreate from '../native/backupCreate.js';
import safSave from '../native/safSave.js';
import timestamp from '../util/timestamp.js';
export default async function createBackup() {
  await safSave(`lingvadesk-${timestamp()}.fcbak`, 'application/octet-stream', await backupCreate());
}
