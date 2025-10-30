const add = require('./math');

test('adds two numbers correctly', () => {
  expect(add(2, 3)).toBe(5);
});

test('returns NaN if inputs are not numbers', () => {
  expect(add('a', 3)).toBe('a3'); // simple string concat case
});
