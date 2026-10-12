import studyStep from '../study/studyStep.js';
import cyclePos from '../study/cyclePos.js';
export default function skip() { return studyStep(s => cyclePos(s, 1)); }
