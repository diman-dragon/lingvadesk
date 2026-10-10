import go from '../nav/go.js';
export default function goCourse(d) { return go('course', { id: +d.id }); }
