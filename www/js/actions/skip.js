import studyStep from '../study/studyStep.js';
import movePos from '../study/movePos.js';
export default function skip() { return studyStep(s => movePos(s, 1)); }
