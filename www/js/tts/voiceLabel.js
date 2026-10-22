/** Понятная подпись голоса: «en-US · мужской 1 · высокое · онлайн» (имя Android вида en-us-x-sfg#male_1-local хранится как есть). */
export default function voiceLabel(v) {
  const m = /#(male|female)_?(\d+)?/i.exec(v.name), gender = m ? `${m[1].toLowerCase() === 'male' ? 'мужской' : 'женский'}${m[2] ? ` ${m[2]}` : ''}` : v.name;
  return [String(v.lang).replace('_', '-'), gender, v.quality >= 400 ? 'высокое' : '', v.offline ? '' : 'онлайн'].filter(Boolean).join(' · ');
}
