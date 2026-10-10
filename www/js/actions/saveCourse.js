import { state } from '../state/appState.js';
import { DEFAULT_TTS } from '../constants/DEFAULT_TTS.js';
import readField from '../dom/readField.js';
import toast from '../dom/toast.js';
import insertCourse from '../repo/insertCourse.js';
import updateCourse from '../repo/updateCourse.js';
import goBack from '../nav/goBack.js';
export default async function saveCourse() {
  const name = readField('name'), tts = readField('tts') || DEFAULT_TTS, id = state.nav.id;
  if (!name) return toast('Введите название курса');
  try { await (id ? updateCourse(id, name, tts) : insertCourse(name, tts)); }
  catch (e) {
    if (/UNIQUE/i.test(e.message)) return toast('Курс с таким названием уже есть');
    throw e;
  }
  toast('Сохранено');
  return goBack();
}
