import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'data' }),
  create: function () {
    return {
      get: this.get.mockReturnValue({ data: 'data' }),
    };
  },
}));

jest.mock('lodash', () => ({ throttle: jest.fn((fn) => fn) }));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const createSpy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('testURL');

    expect(createSpy).toHaveBeenLastCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const createSpy = jest.spyOn(axios.create(), 'get');
    await throttledGetDataFromApi('testURL');

    expect(createSpy).toHaveBeenLastCalledWith('testURL');
  });

  test('should return response data', async () => {
    const responses = await throttledGetDataFromApi('testURL');

    expect(responses).toBe('data');
  });
});
