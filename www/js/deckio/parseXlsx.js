import xmlText from './xmlText.js';
import colIndex from './colIndex.js';
const text = (files, name) => new TextDecoder().decode(files.get(name) ?? new Uint8Array());
const inner = xml => xmlText([...xml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(m => m[1]).join(''));
/** Файлы распакованного xlsx → строки первого листа (общие строки, inline-строки, числа). Регулярные выражения вместо DOMParser — работает и в Node. */
export default function parseXlsx(files) {
  const shared = [...text(files, 'xl/sharedStrings.xml').matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(m => inner(m[1]));
  const sheet = [...files.keys()].filter(n => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()[0];
  return [...text(files, sheet).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map(r => {
    const out = [];
    for (const c of r[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = /r="([A-Z]+)\d+"/.exec(c[1]), type = /t="(\w+)"/.exec(c[1])?.[1], body = c[2] ?? '';
      const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? '';
      out[ref ? colIndex(ref[1]) : out.length] = type === 's' ? shared[+v] ?? '' : type === 'inlineStr' ? inner(body) : xmlText(v);
    }
    return Array.from(out, c => c ?? '');
  });
}
