import plugin from './plugin.js';
/** Значок приложения: { level } — поставить (0 — обычный … 3 — бордовый), { sync } — пересчитать по базе, { schedule } — будильник. → { level } */
export default function iconLevel(opts) { return plugin('IconLevel').exec(opts); }
