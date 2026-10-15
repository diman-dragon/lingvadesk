import studyStep from '../study/studyStep.js';
import leaveCard from '../study/leaveCard.js';
/** Назад (свайп вправо / ‹): без оценки; вернувшись, карточку считаем «пересмотренной». */
export default function prev() { return studyStep(s => leaveCard(s, -1), 'card-back'); }
