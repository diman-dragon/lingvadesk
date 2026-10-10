export default function currentCard(session) { return session.map.get(session.order[session.pos]) ?? null; }
