import dbRun from '../native/dbRun.js';
export default function insertCourse(name, tts) {
  return dbRun('INSERT INTO languages(name,tts) VALUES(?,?)', [name, tts]);
}
