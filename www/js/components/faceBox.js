/** act — необязательное действие по тапу на всю карточку. */
export default function faceBox(html, act = '') {
  return `<div class="face"${act ? ` data-act="${act}"` : ''}>${html}</div>`;
}
