import esc from '../util/esc.js';
import speakButton from './speakButton.js';
export default function exampleBlock(c) {
  return c.example ? `<div class="ex">${esc(c.example)} ${speakButton(c.example, c.tts, 'sm')}<br>${esc(c.example_tr || '')}</div>` : '';
}
