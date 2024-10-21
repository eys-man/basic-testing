import { generateLinkedList } from './index';

const linkedList = ['one', 'two', `three`, `four`];
const expectedLinkedList = {
  value: `one`,
  next: {
    value: `two`,
    next: {
      value: `three`,
      next: {
        value: `four`,
        next: {
          value: null,
          next: null,
        },
      },
    },
  },
};

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(linkedList)).toStrictEqual(expectedLinkedList);
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(linkedList)).toMatchSnapshot();
  });
});
