/** Запасной вариант (нечем измерять): по per элементов на страницу. */
export default function uniformStarts(count, per) {
  return Array.from({ length: Math.max(1, Math.ceil(count / (per || 1))) }, (_, i) => i * per);
}
