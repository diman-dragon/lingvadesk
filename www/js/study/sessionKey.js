/** Ключ сохранённой сессии: область + режим (+ порядок для «Повторения»). Хранится в таблице settings. */
export default function sessionKey(scope, mode, shuffle) { return `session:${scope}:${mode}:${mode === 'review' ? shuffle : '-'}`; }
