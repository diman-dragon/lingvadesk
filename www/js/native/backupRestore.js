import plugin from './plugin.js';
/** → { safety } */
export default function backupRestore(data) { return plugin('BackupRestore').exec({ data }); }
