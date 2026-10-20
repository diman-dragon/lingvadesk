/** Имя файла без расширения: «words.csv» → «words». */
export default function baseName(name) { return String(name || 'Импорт').replace(/\.[^./\\]+$/, '') || 'Импорт'; }
