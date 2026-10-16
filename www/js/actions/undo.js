import studyStep from '../study/studyStep.js';
import undoGrade from '../study/undoGrade.js';
/** «↶»: отменить последнюю оценку (расписание, историю, счётчик, очередь). */
export default function undo() { return studyStep(undoGrade, 'card-back'); }
