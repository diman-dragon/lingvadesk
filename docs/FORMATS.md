# Форматы

## deck.json
```json
{
  "format": "flashcards-deck",
  "version": 1,
  "language": { "name": "English", "tts": "en-US" },
  "deck": { "name": "Basics" },
  "cards": [
    { "front": "apple", "back": "яблоко", "example": "I eat an apple.", "example_translation": "Я ем яблоко." }
  ]
}
```
- Обязательно: `format`, `version=1`, `language.name`, `deck.name`, `cards[]` с непустыми `front` и `back`.
- Необязательно: `language.tts` (по умолчанию `en-US`), `example`, `example_translation`.
- Порядок в массиве = порядок последовательного обучения.
- Если язык с таким именем есть, колода добавляется к нему; иначе язык создаётся. Невалидные карточки пропускаются.
- Кодировка UTF-8.

## .fcbak
ZIP-архив:
- `manifest.json`: `{ "format": "fcbak", "version": 1, "dbVersion": 1, "created": <ms> }`
- `app.db`: файл SQLite (схема — в ARCHITECTURE.md)

Копии с `dbVersion` выше поддерживаемой отклоняются.
