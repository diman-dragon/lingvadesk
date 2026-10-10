export default function progressBar(pos, total, label = '') {
  const bar = `<div class="prog"><i style="width:${Math.round(pos / total * 100)}%"></i></div>`;
  const text = `${label ? label + ' · ' : ''}${pos + 1} / ${total} · осталось ${total - pos}`;
  return `<div class="muted counter">${text}</div>${bar}`;
}
