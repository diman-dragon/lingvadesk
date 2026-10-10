import studyStep from '../study/studyStep.js';
import gradeCard from '../study/gradeCard.js';
export default function grade(d) { return studyStep(s => gradeCard(s, d.g)); }
