import listReviewsSince from '../repo/listReviewsSince.js';
import countReviewsSince from '../repo/countReviewsSince.js';
import listDeckStats from '../repo/listDeckStats.js';
import listDeckReviewStats from '../repo/listDeckReviewStats.js';
import listHardCards from '../repo/listHardCards.js';
import listDueSoon from '../repo/listDueSoon.js';
import listPronunciationsSince from '../repo/listPronunciationsSince.js';
import listWeakWords from '../repo/listWeakWords.js';
import loadToday from '../study/loadToday.js';
import dayStart from '../util/dayStart.js';
import header from '../components/header.js';
import backButton from '../components/backButton.js';
import pagedList from '../components/pagedList.js';
import settingsGroup from '../components/settingsGroup.js';
import statsOverview from './statsOverview.js';
import statsGrades from './statsGrades.js';
import statsDecks from './statsDecks.js';
import statsHard from './statsHard.js';
import statsSpeech from './statsSpeech.js';
/** Статистика — пять страниц (Обзор · Оценки · Колоды · Трудные · Речь), всё из истории повторений и попыток произношения в базе. */
export default async function statsView() {
  const since = dayStart(-29);
  const [rows, total, today, decks, perDeck, hard, dues, speech, weak] = await Promise.all([
    listReviewsSince(since), countReviewsSince(0), loadToday(), listDeckStats(), listDeckReviewStats(since), listHardCards(8), listDueSoon(dayStart(7)),
    listPronunciationsSince(since), listWeakWords(since, 6)]);
  const d = { rows, total, today, decks, perDeck, hard, dues, speech, weak, since7: dayStart(-6) };
  const pages = [['Обзор', statsOverview(d)], ['Оценки', statsGrades(d)], ['Колоды', statsDecks(d)], ['Трудные', statsHard(d)], ['Речь', statsSpeech(d)]];
  return header('Статистика', { left: backButton('back'), gear: false }) +
    pagedList(pages.map(([title, html]) => settingsGroup(title, html)), { fixed: true, titles: pages.map(p => p[0]) });
}
