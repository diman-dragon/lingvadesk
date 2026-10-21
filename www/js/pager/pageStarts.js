/**
 * Начала страниц по реальным высотам элементов: страница набирается, пока помещается в avail (px). cols > 1 — сетка (строка = max высота).
 * Элемент выше страницы получает страницу целиком.
 */
export default function pageStarts(heights, avail, gap, cols = 1) {
  const starts = [0];
  let used = 0;
  for (let i = 0; i < heights.length; i += cols) {
    const h = Math.max(...heights.slice(i, i + cols));
    if (used && used + gap + h > avail) { starts.push(i); used = h; } else used += (used ? gap : 0) + h;
  }
  return starts;
}
