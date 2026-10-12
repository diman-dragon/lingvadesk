import buildLibraryJson from './buildLibraryJson.js';
import safSave from '../native/safSave.js';
import toB64 from '../util/toB64.js';
import timestamp from '../util/timestamp.js';
/** Экспорт всей библиотеки одним файлом. */
export default async function exportLibraryToFile() {
  const json = await buildLibraryJson();
  await safSave(`lingvadesk-library-${timestamp()}.json`, 'application/json', toB64(JSON.stringify(json, null, 2)));
  return json.projects.length;
}
