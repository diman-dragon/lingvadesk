import studyStep from '../study/studyStep.js';
import movePos from '../study/movePos.js';
export default function prev() { return studyStep(s => movePos(s, -1), 'card-back'); }
