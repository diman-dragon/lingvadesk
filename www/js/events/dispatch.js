import actions from '../actions/index.js';
import { CANCELLED } from '../constants/CANCELLED.js';
import consumeSuppress from '../gestures/consumeSuppress.js';
import toast from '../dom/toast.js';
/** Единая точка: [data-act] + [data-on] (по умолчанию click). Клик после свайпа игнорируется. */
export default async function dispatch(e) {
  if (e.type === 'click' && consumeSuppress()) return;
  const el = e.target.closest('[data-act]');
  if (!el || (el.dataset.on || 'click') !== e.type) return;
  try { await actions[el.dataset.act](el.dataset, el); }
  catch (err) { if (err?.message !== CANCELLED) toast(err?.message || String(err)); }
}
