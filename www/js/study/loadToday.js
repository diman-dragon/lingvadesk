import countReviewsSince from '../repo/countReviewsSince.js';
import listActiveHours from '../repo/listActiveHours.js';
import dayStart from '../util/dayStart.js';
import streaks from './streaks.js';
/** { n — повторений сегодня, current — дней подряд, best — лучшая серия }: всё считается из истории в базе. */
export default async function loadToday(now = Date.now()) {
  const [n, hours] = await Promise.all([countReviewsSince(dayStart(0, now)), listActiveHours()]);
  return { n, ...streaks(hours.map(r => Number(r.h)), now) };
}
