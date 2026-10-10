/** Карточка, которую ещё ни разу не изучали. */
export default function isNewCard(c) { return c.reps === 0 && c.interval === 0 && c.due === 0; }
