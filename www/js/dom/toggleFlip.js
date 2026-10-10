/** Переворачивает карточку на экране; возвращает true, если теперь видна оборотная сторона. */
export default function toggleFlip() { return document.querySelector('.flip').classList.toggle('flipped'); }
