import { state } from '../state/appState.js';
import iconLevel from '../native/iconLevel.js';
/** Значок по базе (сегодня не занимались → янтарный … бордовый к вечеру) и будильник пересчёта. Ошибки (нет моста) молча игнорируются. */
export default async function syncIcon() {
  try { state.iconLevel = (await iconLevel({ sync: true, schedule: true })).level; } catch { /* значок — не критично */ }
}
