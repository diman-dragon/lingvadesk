import plugin from './plugin.js';
/** → { name, data(base64) } */
export default function safOpen() { return plugin('SafOpen').exec({}); }
