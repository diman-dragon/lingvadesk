import plugin from './plugin.js';
export default function dbBatch(statements) { return plugin('DbBatch').exec({ statements }); }
