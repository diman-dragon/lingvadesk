import clean from '../util/clean.js';
export default function isValidCard(c) { return !!c && !!clean(c.front) && !!clean(c.back); }
