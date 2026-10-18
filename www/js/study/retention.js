/** Удержание, %: доля повторений без «снова» среди карточек, которые уже изучали (не новых), в интервальном повторении. null — данных нет. */
export default function retention(rows) {
  const old = rows.filter(r => r.mode === 'srs' && !Number(r.fresh));
  return old.length ? Math.round(100 * old.filter(r => r.grade !== 'again').length / old.length) : null;
}
