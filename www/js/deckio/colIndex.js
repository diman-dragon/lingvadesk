/** Буквы столбца Excel → номер с нуля: A → 0, B → 1, AA → 26. */
export default function colIndex(letters) { return [...letters].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1; }
