import { state } from '../state/appState.js';
import { DEFAULT_TTS } from '../constants/DEFAULT_TTS.js';
import readField from '../dom/readField.js';
import toast from '../dom/toast.js';
import insertProject from '../repo/insertProject.js';
import updateProject from '../repo/updateProject.js';
import goBack from '../nav/goBack.js';
export default async function saveProject() {
  const name = readField('name'), tts = readField('tts') || DEFAULT_TTS, id = state.nav.id;
  if (!name) return toast('Введите название проекта');
  try { await (id ? updateProject(id, name, tts) : insertProject(name, tts)); }
  catch (e) {
    if (/UNIQUE/i.test(e.message)) return toast('Проект с таким названием уже есть');
    throw e;
  }
  toast('Сохранено');
  return goBack();
}
