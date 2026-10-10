import { state } from '../state/appState.js';
import { DEFAULT_TTS } from '../constants/DEFAULT_TTS.js';
import getCourse from '../repo/getCourse.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import labeledField from '../components/labeledField.js';
import ttsCodes from '../components/ttsCodes.js';
import formButtons from '../components/formButtons.js';
export default async function courseFormView() {
  const id = state.nav.id;
  const c = id ? await getCourse(id) : { name: '', tts: DEFAULT_TTS };
  return header(id ? 'Курс' : 'Новый курс', { left: backButton('back') }) +
    labeledField({ id: 'name', label: 'Название', value: c.name, placeholder: 'Например, Юридический английский' }) +
    labeledField({ id: 'tts', label: 'Язык озвучки', value: c.tts, placeholder: 'en-US', list: 'tts-codes' }) + ttsCodes() +
    formButtons({ save: 'saveCourse', del: id ? 'delCourse' : '' });
}
