import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';
const ROOT = process.cwd();
process.chdir(ROOT);
const { default: installBridge } = await import(ROOT + '/test/helpers/installBridge.js');
const { io } = installBridge();
io.voices = ['en-US', 'en-GB', 'ru-RU', 'de-DE'].flatMap(l => [1, 2, 3].map(n => ({ name: `${l.toLowerCase()}-x-voice${n}#${n % 2 ? 'male' : 'female'}_${n}-local-with-a-very-long-engine-name`, lang: l, quality: 100 * (n + 1), offline: n !== 3 })));
const imp = p => import(`${ROOT}/www/js/${p}`).then(m => m.default);
const insertProject = await imp('repo/insertProject.js'), insertDeck = await imp('repo/insertDeck.js'), insertCards = await imp('repo/insertCards.js');
const L = 'Неопределённо-длинное-составное-слово-без-пробелов-для-проверки-переноса';
const P = 'Это очень длинная фраза-перевод, которая обязательно должна уместиться на карточке целиком без обрезки и без выхода за границы экрана, даже на узком телефоне.';
const projects = [['English language long project name to check wrapping of long titles', 'en-US'], ['Юридические термины и определения (расширенный курс)', 'ru-RU'], ['Даты', 'en-US']];
for (const [i, [name, tts]] of projects.entries()) {
  const pid = await insertProject(name, tts);
  for (const dn of ['Basics', 'Очень длинное название колоды для проверки переноса строк на узком экране', 'Deck ' + i]) {
    const did = await insertDeck(pid, dn);
    await insertCards(did, [
      { front: 'apple', back: 'яблоко' }, { front: 'water', back: 'вода' }, { front: 'house', back: 'дом', example: 'This is my house and I love it very much, it is big.', exampleTr: 'Это мой дом, и я его очень люблю, он большой.' },
      { front: 'Supercalifragilisticexpialidocious-' + L, back: L }, { front: 'A very long English sentence that goes on and on to check how listening mode handles long text', back: P },
      { front: 'learn', back: 'учить, изучать, узнавать, выучивать наизусть, постигать' }, { front: 'x', back: P + ' ' + P }
    ]);
  }
}
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
http.createServer(async (req, res) => {
  if (req.url === '/__bridge' && req.method === 'POST') {
    let b = ''; for await (const c of req) b += c;
    const { name, a } = JSON.parse(b);
    try { const r = await globalThis.Capacitor.nativePromise(name, 'exec', a); res.end(JSON.stringify({ r: r ?? {} })); }
    catch (e) { res.end(JSON.stringify({ err: e.message })); }
    return;
  }
  const f = join(ROOT, 'www', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!existsSync(f)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(f)] || 'application/octet-stream'); res.end(readFileSync(f));
}).listen(8765, () => console.log('ready'));
