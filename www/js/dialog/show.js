import render from '../nav/render.js';
/** Перерисовка экрана диалога; чат прокручивается к текущей реплике. */
export default async function show() {
  await render();
  const chat = document.getElementById?.('chat');
  if (chat) chat.scrollTop = chat.scrollHeight;
}
