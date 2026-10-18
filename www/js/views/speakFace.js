import esc from '../util/esc.js';
import button from '../components/button.js';
import flipFaces from '../components/flipFaces.js';
import micIcon from '../components/micIcon.js';
import speakButton from '../components/speakButton.js';
import exampleBlock from '../components/exampleBlock.js';
import speechResult from './speechResult.js';
/**
 * «Говорить»: на лице — перевод и большой микрофон: нужно произнести слово (фразу) на изученном языке; итог попытки — под микрофоном.
 * «Показать текст» и «Послушать» — подсказки (оценка опускается). Оборот — текст, перевод, пример.
 */
export default function speakFace(c, flipped, speech = null) {
  const mic = button({ act: 'record', cls: 'speak xl mic', label: micIcon(), aria: 'Сказать', data: { lang: c.tts } });
  const tips = button({ act: 'showText', cls: 'sm showtext', label: 'Показать текст' }) + button({ act: 'play', cls: 'sm', label: '🔈 Послушать', data: { t: c.front, lang: c.tts } });
  const front = `<div class="muted">Скажите вслух</div><div class="big">${esc(c.back)}</div><div class="big hidtext" hidden>${esc(c.front)}</div>` +
    `${mic}<div id="speechres">${speechResult(speech)}</div><div class="row">${tips}</div>`;
  const back = `<div class="big">${esc(c.front)}</div><div class="big">${esc(c.back)}</div>${speakButton(c.front, c.tts)}${exampleBlock(c)}` +
    '<div class="muted hint">Тап — вернуться · свайп влево — дальше, вправо — назад</div>';
  return flipFaces(front, back, flipped);
}
