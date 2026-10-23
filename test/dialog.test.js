import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import installBridge from './helpers/installBridge.js';
import { SAMPLE_DIALOGS } from '../www/js/constants/SAMPLE_DIALOGS.js';
import { DIALOG } from '../www/js/constants/DIALOG.js';
import speakerOf from '../www/js/util/speakerOf.js';
import parseDialogText from '../www/js/deckio/parseDialogText.js';
import readImportText from '../www/js/deckio/readImportText.js';
import parseLibrary from '../www/js/deckio/parseLibrary.js';
import saveLibrary from '../www/js/deckio/saveLibrary.js';
import buildLibraryJson from '../www/js/deckio/buildLibraryJson.js';
import listProjects from '../www/js/repo/listProjects.js';
import listDecksOfProject from '../www/js/repo/listDecksOfProject.js';
import listCards from '../www/js/repo/listCards.js';
import newDialog from '../www/js/dialog/newDialog.js';
import slotOf from '../www/js/dialog/slotOf.js';
import rolesOf from '../www/js/dialog/rolesOf.js';

const bridge = installBridge();
test.beforeEach(() => bridge.reset());
const cafe = SAMPLE_DIALOGS.projects[0].decks[0];

test('роль реплики: цифры и буквы (латиница и кириллица), иначе 0', () => {
  assert.deepEqual(['1', 2, 'a', 'B', 'С', 'в', '4', '', null, 'X'].map(speakerOf), [1, 2, 1, 2, 3, 2, 0, 0, 0, 0]);
});

test('текст диалога: заголовки, роли A/B/C и 1/2/3, разделители « | » и « — »; не диалог — null', () => {
  const t = parseDialogText('# Сцена\nlang: de-DE\nA: Hallo! | Привет!\nB: Wie geht\'s? — Как дела?\n3. Gut. | Хорошо.\n');
  assert.deepEqual([t.name, t.lang, t.cards.map(c => c.speaker)], ['Сцена', 'de-DE', [1, 2, 3]]);
  assert.deepEqual([t.cards[1].front, t.cards[1].back], ["Wie geht's?", 'Как дела?']);
  assert.equal(parseDialogText('apple — яблоко\ndog — собака'), null);                 // обычный список слов
  assert.equal(parseDialogText('A: только одна | реплика'), null);                        // меньше двух реплик
  assert.equal(parseDialogText('A: раз | один\nB: два | два\nчто-то\nещё\nи ещё\nпрочее'), null);   // реплики — не большинство
});

test('пример examples/dialog-cafe.txt = сцена «В кафе» из приложения; examples/dialogs.json = SAMPLE_DIALOGS', () => {
  const r = readImportText('dialog-cafe.txt', readFileSync('examples/dialog-cafe.txt', 'utf8'));
  assert.deepEqual([r.kind, r.format, r.dialog, r.lang, r.name], ['cards', 'Диалог', true, 'en-US', 'Диалог: В кафе']);
  assert.deepEqual(r.cards.map(c => [c.speaker, c.front, c.back]), cafe.cards.map(c => [c.speaker, c.front, c.back]));
  assert.deepEqual(JSON.parse(readFileSync('examples/dialogs.json', 'utf8')), SAMPLE_DIALOGS);
  assert.deepEqual(new Set(cafe.cards.map(c => c.speaker)), new Set([1, 2, 3]));            // три роли: две озвучены, третья — вы
});

test('библиотека с диалогами: kind и роли сохраняются, экспорт → импорт даёт то же, повторный импорт ничего не дублирует', async () => {
  const lib = parseLibrary(SAMPLE_DIALOGS);
  assert.equal(lib.projects[0].decks[0].kind, 'dialog');
  const s = await saveLibrary(lib);
  assert.deepEqual([s.projects, s.decks, s.added], [2, 3, 24]);
  const p = (await listProjects()).find(x => x.name === 'English'), decks = await listDecksOfProject(p.id);
  assert.deepEqual(decks.map(d => d.kind), ['dialog', 'dialog']);
  assert.deepEqual((await listCards(decks.find(d => d.name.includes('кафе')).id)).map(c => c.speaker), cafe.cards.map(c => c.speaker));
  assert.equal((await saveLibrary(parseLibrary(SAMPLE_DIALOGS))).added, 0);
  const out = await buildLibraryJson();
  assert.equal(out.projects.find(x => x.name === 'English').decks[0].kind, 'dialog');
  const byName = l => Object.fromEntries(l.projects.flatMap(q => q.decks.map(d => [`${q.name}/${d.name}`, d.cards.map(c => c.speaker)])));
  assert.deepEqual(byName(parseLibrary(out)), byName(parseLibrary(SAMPLE_DIALOGS)));
});

test('повторяющиеся реплики диалога сохраняются все, а повторный импорт их не удваивает', async () => {
  const dup = { projects: [{ name: 'P', tts: 'en-US', decks: [{ name: 'D', kind: 'dialog', cards: [
    { front: 'Hello?', back: 'Алло?', speaker: 1 }, { front: 'Hello?', back: 'Алло?', speaker: 2 }, { front: 'Hello?', back: 'Алло?', speaker: 1 }] }] }] };
  assert.equal((await saveLibrary(parseLibrary({ ...dup, format: 'lingvadesk-library', version: 1 }))).added, 3);
  assert.equal((await saveLibrary(parseLibrary({ ...dup, format: 'lingvadesk-library', version: 1 }))).added, 0);
});

test('сцена: роли, слоты голосов, роль пользователя по умолчанию', () => {
  const cards = cafe.cards.map((c, i) => ({ id: i + 1, speaker: c.speaker, front: c.front, back: c.back }));
  const d = newDialog({ id: 1, name: 'X', tts: 'en-US' }, cards);
  assert.deepEqual([rolesOf(d.lines), d.you, d.phase], [[1, 2, 3], DIALOG.you, 'setup']);
  assert.deepEqual([1, 2, 3, 0].map(slotOf), [1, 2, 0, 0]);                                  // роли 1 и 2 — свои голоса, остальное — основной
  assert.equal(newDialog({ id: 1, name: 'X', tts: 'en-US' }, cards.filter(c => c.speaker < 3)).you, 0);   // нет роли 3 — только слушаем
  assert.equal(newDialog({ id: 1, name: 'X', tts: 'en-US' }, [{ id: 1, speaker: 0, front: 'a', back: 'б' }]).lines[0].role, 1);
  assert.throws(() => newDialog({ id: 1 }, []), /нет реплик/);
});
