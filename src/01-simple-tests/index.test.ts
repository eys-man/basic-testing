import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const testAdd = { a: 25, b: 11, action: Action.Add }; // только для импорта Action :)
    // хотя можно и так
    // const testAdd = { a: 25, b: 11, action: '+' };
    expect(simpleCalculator(testAdd)).toBe(36);
  });

  test('should subtract two numbers', () => {
    const testSubstract = { a: 25, b: 11, action: '-' };
    expect(simpleCalculator(testSubstract)).toBe(14);
  });

  test('should multiply two numbers', () => {
    const testMultiply = { a: 25, b: 11, action: '*' };
    expect(simpleCalculator(testMultiply)).toBe(275);
  });

  test('should divide two numbers', () => {
    const testDivide = { a: 33, b: 11, action: '/' };
    expect(simpleCalculator(testDivide)).toBe(3);
  });

  test('should exponentiate two numbers', () => {
    const testExponentiate = { a: 25, b: 2, action: '^' };
    expect(simpleCalculator(testExponentiate)).toBe(625);
  });

  test('should return null for invalid action', () => {
    const testInvalidAction = { a: 25, b: 2, action: '%' };
    expect(simpleCalculator(testInvalidAction)).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    const testInvalidArgument = { a: 'string', b: 2, action: '+' };
    expect(simpleCalculator(testInvalidArgument)).toBe(null);
  });
});
