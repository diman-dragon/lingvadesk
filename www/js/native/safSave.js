import plugin from './plugin.js';
export default function safSave(name, mime, data) { return plugin('SafSave').exec({ name, mime, data }); }
