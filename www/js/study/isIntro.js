/** Фаза «Знакомство» режима «Обучение»: показываем обе стороны, без оценок. */
export default function isIntro(session) { return session.mode === 'learn' && session.phase === 'intro'; }
