const MAP = { A: 1, B: 2, C: 3, 'А': 1, 'В': 2, 'С': 3 };   // и латинские, и русские буквы (А В С)
/** Роль реплики из числа или буквы (1 / 2 / 3, A / B / C): 0 — роли нет. */
export default function speakerOf(v) {
  const s = String(v ?? '').trim().toUpperCase();
  return /^[1-3]$/.test(s) ? Number(s) : MAP[s] ?? 0;
}
