import findCourseByName from '../repo/findCourseByName.js';
import insertCourse from '../repo/insertCourse.js';
export default async function findOrCreateCourse(name, tts) {
  return (await findCourseByName(name))?.id ?? insertCourse(name, tts);
}
