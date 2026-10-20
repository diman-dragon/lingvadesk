import go from '../nav/go.js';
/** ✎ у проекта в списке (data-id). */
export default function editProject(d) { return go('projectForm', { id: +d.id }); }
