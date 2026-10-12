/** Карточка следует за пальцем: сдвиг, наклон и прозрачность. */
export default function followCard(el, dx) {
  el.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
  el.style.opacity = String(1 - Math.min(0.5, Math.abs(dx) / 400));
}
