const add = (list, f) => list.reduce((a, x) => a + Number(x[f]), 0);
/** Сумма по колодам (study/planInfo): те же поля, что у одной колоды, плюс n — число колод. Для «Все колоды» и проекта. */
export default function sumDecks(list, name = 'Все колоды') {
  return { name, pname: '', n: list.length, ...Object.fromEntries(['total', 'mature', 'newAll', 'left', 'late'].map(f => [f, add(list, f)])) };
}
