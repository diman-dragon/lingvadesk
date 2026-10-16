/** Столбики по дням: days = [{ label, n, today }]; высота — доля от максимума. */
export default function barChart(days) {
  const max = Math.max(1, ...days.map(d => d.n));
  const bars = days.map(d => `<div class="bar${d.today ? ' today' : ''}"><em>${d.n || ''}</em><i style="height:${Math.round(d.n / max * 100)}%"></i><span>${d.label}</span></div>`);
  return `<div class="bars">${bars.join('')}</div>`;
}
