import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  const initBalance = 1000;
  const minDotation = 20;

  test('should create account with initial balance', () => {
    const myAcc = getBankAccount(initBalance);
    expect(myAcc.getBalance()).toBe(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const myAcc = getBankAccount(initBalance);
    expect(() => myAcc.withdraw(initBalance + 1)).toThrow(
      new InsufficientFundsError(myAcc.getBalance()),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const myAcc = getBankAccount(initBalance);
    const recipientAcc = getBankAccount(initBalance);

    expect(() => myAcc.transfer(initBalance + 1, recipientAcc)).toThrow(
      new InsufficientFundsError(myAcc.getBalance()),
    );
  });

  test('should throw error when transferring to the same account', () => {
    const myAcc = getBankAccount(initBalance);

    expect(() => myAcc.transfer(minDotation, myAcc)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const myAcc = getBankAccount(initBalance);

    expect(myAcc.deposit(minDotation).getBalance()).toBe(
      initBalance + minDotation,
    );
  });

  test('should withdraw money', () => {
    const myAcc = getBankAccount(initBalance);

    expect(myAcc.withdraw(minDotation).getBalance()).toBe(
      initBalance - minDotation,
    );
  });

  test('should transfer money', () => {
    const myAcc = getBankAccount(initBalance);
    const recipientAcc = getBankAccount(initBalance);

    myAcc.transfer(minDotation, recipientAcc);

    expect(recipientAcc.getBalance()).toBe(initBalance + minDotation);
    expect(myAcc.getBalance()).toBe(initBalance - minDotation);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const myAcc = getBankAccount(initBalance);

    const randomMock = jest.spyOn(lodash, 'random');
    randomMock.mockReturnValueOnce(100).mockReturnValueOnce(1); // requestFailed при этом false (при этом fetchBalance возвращает число)

    const returnedRequest = await myAcc.fetchBalance();
    // console.log(`returnedRequest ${returnedRequest}`);

    expect(returnedRequest).not.toBeNull();
    expect(typeof returnedRequest).toBe(`number`);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const myAcc = getBankAccount(initBalance);
    const fetchBalanceMock = jest.spyOn(myAcc, 'fetchBalance');
    fetchBalanceMock.mockResolvedValue(100);

    const returnedRequest = await myAcc.fetchBalance();
    // console.log(`returnedRequest ${returnedRequest}`);
    expect(
      myAcc.withdraw(initBalance).deposit(Number(returnedRequest)).getBalance(),
    ).toBe(100);

    // можно это делать и через synchronizeBalance
    await myAcc.synchronizeBalance();
    expect(myAcc.getBalance()).toBe(100);

    // fetchBalanceMock.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const myAcc = getBankAccount(initBalance);
    // замокать fetchBalance, чтоб возвращала null
    const fetchBalanceMock = jest.spyOn(myAcc, 'fetchBalance');
    fetchBalanceMock.mockResolvedValue(null);

    try {
      await myAcc.synchronizeBalance();
    } catch (err) {
      expect(err).toStrictEqual(new SynchronizationFailedError());
    }

    // fetchBalanceMock.mockRestore();
  });
});
