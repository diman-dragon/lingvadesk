/** Роли сцены (по возрастанию) из её реплик. */
export default function rolesOf(lines) { return [...new Set(lines.map(l => l.role))].sort(); }
