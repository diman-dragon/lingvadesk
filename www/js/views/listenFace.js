import esc from '../util/esc.js';
import button from '../components/button.js';
import flipFaces from '../components/flipFaces.js';
import speakIcon from '../components/speakIcon.js';
import speakButton from '../components/speakButton.js';
import exampleBlock from '../components/exampleBlock.js';
import big from '../components/big.js';
import quizVerdict from './quizVerdict.js';
/**
 * «На слух»: на лице — большой проигрыватель слова / фразы (без текста), «Показать текст» — подсказка; нужно перевести.
 * Оборот — текст, перевод, пример. quiz — выбор / ввод перевода (тап по карточке не переворачивает).
 */
export default function listenFace(c, flipped, quiz = null) {
  const play = button({ act: 'play', cls: 'speak xl', label: speakIcon(), aria: 'Прослушать', data: { t: c.front, lang: c.tts } });
  const hint = quiz ? 'Выберите верный перевод' : 'Переведите услышанное, затем тап — перевернуть';
  const front = `${big(c.front, 'hidtext', ' hidden')}${play}<div class="muted">Послушайте и переведите</div>` +
    button({ act: 'showText', cls: 'sm showtext', label: 'Показать текст' }) + `<div class="muted hint">${hint}</div>`;
  const back = `<div class="muted">${esc(c.front)}</div>${big(c.back)}<div id="verdict">${quizVerdict(quiz)}</div>${speakButton(c.front, c.tts)}${exampleBlock(c)}` +
    `<div class="muted hint">${quiz ? 'Свайп влево — дальше, вправо — назад' : 'Тап — вернуться · свайп влево — дальше, вправо — назад'}</div>`;
  return flipFaces(front, back, flipped, quiz ? '' : 'flip');
}
