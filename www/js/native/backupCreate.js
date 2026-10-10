import plugin from './plugin.js';
export default function backupCreate() { return plugin('BackupCreate').exec({}).then(r => r.data); }
