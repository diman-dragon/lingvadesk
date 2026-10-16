import plugin from './plugin.js';
/** Экран не гаснет, пока открыта учёба; без моста (браузер) молча ничего не делает. */
export default function setAwake(on) {
  try { return plugin('KeepAwake').exec({ on }).catch(() => {}); } catch { return Promise.resolve(); }
}
