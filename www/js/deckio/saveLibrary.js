import findOrCreateProject from './findOrCreateProject.js';
import findOrCreateDeck from './findOrCreateDeck.js';
import addMissingCards from './addMissingCards.js';
/** Сливает библиотеку из файла с текущей: проекты и колоды ищутся по имени, карточки не дублируются. */
export default async function saveLibrary(lib) {
  let decks = 0, added = 0;
  for (const p of lib.projects) {
    const projectId = await findOrCreateProject(p.name, p.tts);
    for (const d of p.decks) {
      added += await addMissingCards(await findOrCreateDeck(projectId, d.name, d.kind), d.cards, d.kind);
      decks++;
    }
  }
  return { projects: lib.projects.length, decks, added };
}
