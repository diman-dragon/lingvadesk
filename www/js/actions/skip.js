import studyStep from '../study/studyStep.js';
import leaveCard from '../study/leaveCard.js';
/** Вперёд (свайп влево / ›): карточка оценивается по поведению. */
export default function skip() { return studyStep(s => leaveCard(s, 1)); }
