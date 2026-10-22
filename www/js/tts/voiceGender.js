/** Пол голоса по имени Android (…#female_2-local / …#male_1-local): 'f' | 'm' | '' (не указан). */
export default function voiceGender(v) {
  const m = /#(male|female)/i.exec(v.name);
  return m ? (m[1].toLowerCase() === 'male' ? 'm' : 'f') : '';
}
