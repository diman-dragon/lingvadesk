import test from 'node:test';
import assert from 'node:assert/strict';
import nextSrs from '../www/js/srs/nextSrs.js';

const now = Date.UTC(2026, 0, 1);
const fresh = { ease: 2.5, interval: 0, reps: 0, due: 0 };
const MIN = 60000, DAY = 86400000;

test('again сбрасывает прогресс и назначает повтор через 10 минут', () => {
  const s = nextSrs({ ease: 2.5, interval: 10, reps: 5, due: now }, 'again', now);
  assert.equal(s.reps, 0);
  assert.equal(s.interval, 0);
  assert.equal(s.due, now + 10 * MIN);
  assert.ok(Math.abs(s.ease - 2.3) < 1e-9);
});

test('good на новой карточке: 1 день, затем 6 дней', () => {
  const a = nextSrs(fresh, 'good', now);
  assert.equal(a.interval, 1);
  assert.equal(nextSrs(a, 'good', now).interval, 6);
  assert.equal(a.due, now + DAY);
});

test('интервал растёт при повторных good', () => {
  let s = fresh, prev = 0;
  for (let i = 0; i < 5; i++) {
    s = nextSrs(s, 'good', now);
    assert.ok(s.interval > prev);
    prev = s.interval;
  }
});

test('ease не опускается ниже 1.3', () => {
  let s = fresh;
  for (let i = 0; i < 20; i++) s = nextSrs(s, 'again', now);
  assert.ok(s.ease >= 1.3);
  for (let i = 0; i < 20; i++) s = nextSrs({ ...s, reps: 3, interval: 5 }, 'hard', now);
  assert.ok(s.ease >= 1.3);
});

test('hard и easy: интервалы и ease', () => {
  assert.equal(nextSrs(fresh, 'easy', now).interval, 4);
  assert.equal(nextSrs({ ...fresh, reps: 1, interval: 1 }, 'hard', now).interval, 3);
  assert.equal(nextSrs({ ...fresh, reps: 1, interval: 1 }, 'easy', now).interval, 8);
  assert.ok(nextSrs(fresh, 'easy', now).ease > 2.5);
  assert.ok(nextSrs(fresh, 'hard', now).ease < 2.5);
});
