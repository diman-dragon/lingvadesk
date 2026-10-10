import clean from '../util/clean.js';
export default function readField(id) { return clean(document.getElementById(id).value); }
