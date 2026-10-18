/**
 * Проверка произношения. engine — что распознавало (пишется в pronunciations); easy / good / hard — границы оценки сходства (0…1):
 * от easy — «легко» (с первой попытки, без подсказки), от good — «хорошо», от hard — «трудно», ниже — «снова».
 */
export const SPEECH = { engine: 'android-speech', easy: 0.9, good: 0.75, hard: 0.55 };
