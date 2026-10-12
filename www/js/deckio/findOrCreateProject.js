import findProjectByName from '../repo/findProjectByName.js';
import insertProject from '../repo/insertProject.js';
export default async function findOrCreateProject(name, tts) {
  return (await findProjectByName(name))?.id ?? insertProject(name, tts);
}
