import statCard from '../components/statCard.js';
import row from '../components/row.js';
/** Параметр «Выучено»: карточки с интервалом от 21 дня из всех. */
export default function learned(d) {
  const mature = d.decks.reduce((a, x) => a + Number(x.mature), 0), cards = d.decks.reduce((a, x) => a + Number(x.total), 0);
  const fresh = d.decks.reduce((a, x) => a + Number(x.fresh), 0);
  return {
    icon: '🌱', title: 'Выучено', value: `${mature}/${cards}`, sub: `новых: ${fresh} · в процессе: ${cards - mature - fresh}`,
    detail: row(statCard(mature, 'выучено') + statCard(cards - mature - fresh, 'в процессе') + statCard(fresh, 'новых'), 'stats s3') +
      `<div class="prog"><i style="width:${cards ? Math.round(100 * mature / cards) : 0}%"></i></div><div class="muted note">«Выучено» — интервал повторения от 21 дня.</div>`
  };
}
