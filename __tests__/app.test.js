// app.test.js

// ✅ Example 1: Simple function test
function sum(a, b) {
  return a + b;
}

test('adds 2 + 3 to equal 5', () => {
  expect(sum(2, 3)).toBe(5);
});

// ✅ Example 2: Async test example
function fetchUser() {
  return Promise.resolve({ name: 'Sumit', age: 28 });
}

test('fetches a user with name Sumit', async () => {
  const user = await fetchUser();
  expect(user.name).toBe('Sumit');
});
