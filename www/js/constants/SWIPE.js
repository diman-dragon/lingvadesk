/**
 * distance — путь для засчёта жеста (px); slop — меньше этого это тап; flyMs — полёт карточки;
 * flick — быстрый короткий жест: путь ≥ flickDistance при скорости ≥ flickSpeed (px/мс);
 * vertical — жест считается вертикальным (отмена), если |dy| > vertical·|dx| и |dy| ≥ 30.
 */
export const SWIPE = { distance: 60, slop: 8, flyMs: 180, flickDistance: 32, flickSpeed: 0.35, vertical: 3 };
