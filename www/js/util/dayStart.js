/** Начало местных суток (мс); offset — сдвиг в днях. */
export default function dayStart(offset = 0, now = Date.now()) {
  const d = new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset).getTime();
}
