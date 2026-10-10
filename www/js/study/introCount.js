/** В «Обучении» порядок = [знакомство..., проверка...] — две равные половины. */
export default function introCount(mode, order) { return mode === 'learn' ? order.length / 2 : 0; }
