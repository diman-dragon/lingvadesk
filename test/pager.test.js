import test from 'node:test';
import assert from 'node:assert/strict';
import pageStarts from '../www/js/pager/pageStarts.js';
import uniformStarts from '../www/js/pager/uniformStarts.js';

test('страницы по реальной высоте: длинные (перенесённые) элементы занимают больше места', () => {
  assert.deepEqual(pageStarts([64, 64, 64, 64, 64], 300, 10), [0, 4]);                 // 4 × 64 + 3 × 10 = 286 ≤ 300
  assert.deepEqual(pageStarts([64, 140, 64, 64, 64], 300, 10), [0, 3]);                // длинный второй: 64+10+140+10+64 = 288
  assert.deepEqual(pageStarts([64, 200, 200, 64], 300, 10), [0, 2]);                  // 64+200 на первой; два длинных рядом не помещаются
  assert.deepEqual(pageStarts([500, 64], 300, 10), [0, 1]);                            // выше страницы — получает страницу целиком
  assert.deepEqual(pageStarts([], 300, 10), [0]);
});

test('сетка: строка = самая высокая плитка в ряду', () => {
  assert.deepEqual(pageStarts([124, 200, 124, 124, 124, 124], 340, 12, 2), [0, 4]);   // ряд 1 = 200, ряд 2 = 124: 200+12+124 = 336
  assert.deepEqual(uniformStarts(11, 3), [0, 3, 6, 9]);
  assert.deepEqual(uniformStarts(0, 3), [0]);
});
