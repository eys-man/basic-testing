import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'data' }),
  create: function () {
    return {
      get: this.get.mockReturnValue({ data: 'data' }),
    };
  },
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const spy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('test');

    expect(spy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const spy = jest.spyOn(axios.create(), 'get');
    await throttledGetDataFromApi('test');

    expect(spy).toHaveBeenCalledWith('test');
  });

  test('should return response data', async () => {
    const responses = await throttledGetDataFromApi('test');

    expect(responses).toBe('data');
  });
});
