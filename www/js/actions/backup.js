import createBackup from '../backup/createBackup.js';
import toast from '../dom/toast.js';
export default async function backup() { await createBackup(); toast('Копия сохранена'); }
