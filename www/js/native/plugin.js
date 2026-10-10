/**
 * Доступ к нативному плагину без бандлера. В WebView без @capacitor/core у window.Capacitor
 * нет registerPlugin, но есть nativePromise (его вызывает нативный мост) — используем его.
 */
export default function plugin(name) {
  const cap = globalThis.Capacitor;
  if (!cap) throw new Error('Capacitor недоступен: приложение запущено вне WebView');
  if (typeof cap.nativePromise === 'function') return { exec: opts => cap.nativePromise(name, 'exec', opts) };
  if (typeof cap.registerPlugin === 'function') return cap.registerPlugin(name);
  if (cap.Plugins && cap.Plugins[name]) return cap.Plugins[name];
  throw new Error(`Плагин ${name} недоступен в Capacitor`);
}
