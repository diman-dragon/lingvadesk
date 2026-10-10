let timer;
export default function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('on');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('on'), 3000);
}
