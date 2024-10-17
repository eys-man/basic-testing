import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },

  { a: 5, b: 2, action: Action.Subtract, expected: 3 },
  { a: 10, b: 2, action: Action.Subtract, expected: 8 },

  { a: 2, b: 1, action: Action.Divide, expected: 2 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },

  { a: 2, b: 1, action: Action.Multiply, expected: 2 },
  { a: 4, b: 2, action: Action.Multiply, expected: 8 },

  { a: 2, b: 1, action: Action.Exponentiate, expected: 2 },
  { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },

  { a: 'string', b: 1, action: Action.Add, expected: null },
  { a: 4, b: '2', action: Action.Divide, expected: null },

  { a: 2, b: 1, action: '%', expected: null },
];

describe(`calculator`, () => {
  test.each(testCases)(
    `should return action's result for two arguments`,
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});

// вариант 2
describe.each(testCases)(`simpleCalculator`, ({ a, b, action, expected }) => {
  test(`perform ${action} with ${a} and ${b} and result should be ${expected}`, () => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });
});
