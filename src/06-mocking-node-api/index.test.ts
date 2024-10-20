import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');

    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeout).toBeCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    // перематываем время на 1 секунду вперед
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);
    expect(setInterval).toBeCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(2);

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');
    await readFileAsynchronously(`1.txt`);

    expect(joinSpy).toBeCalledWith(__dirname, `1.txt`);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileContent = await readFileAsynchronously(`1.txt`);

    expect(fileContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue('basic-testing');

    const fileContent = await readFileAsynchronously(`1.txt`);

    expect(fileContent).toBe('basic-testing');
  });
});
