import esc from '../util/esc.js';
import flipFaces from '../components/flipFaces.js';
import speakButton from '../components/speakButton.js';
import exampleBlock from '../components/exampleBlock.js';
/** Лицо — вопрос; оборот — вопрос, ответ, пример. Язык изучаемого слова — front. */
export default function studyFace(c, flipped, dir) {
  const fwd = dir === 'fwd';
  const prompt = fwd ? c.front : c.back, answer = fwd ? c.back : c.front;
  const front = `<div class="big">${esc(prompt)}</div>${fwd ? speakButton(c.front) : ''}<div class="muted hint">Нажмите, чтобы перевернуть · свайп — листать</div>`;
  const back = `<div class="muted">${esc(prompt)}</div><div class="big">${esc(answer)}</div>${speakButton(c.front)}${exampleBlock(c)}` +
    '<div class="muted hint">Нажмите, чтобы вернуться · свайп — листать</div>';
  return flipFaces(front, back, flipped);
}
