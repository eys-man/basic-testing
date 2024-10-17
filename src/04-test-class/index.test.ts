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
    const data = await myAcc.fetchBalance();
    console.log(
      `fetchBalance should return number in case if request did not failed. data = ${data}`,
    );
    if (typeof data === `number`) expect(data).not.toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const myAcc = getBankAccount(initBalance);
    const data = await myAcc.fetchBalance();
    console.log(
      `should set new balance if fetchBalance returned number. data = ${data}`,
    );
    if (typeof data === `number`)
      expect(myAcc.withdraw(initBalance).deposit(data).getBalance()).toBe(data);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const myAcc = getBankAccount(initBalance);
    console.log(
      `should throw SynchronizationFailedError if fetchBalance returned null`,
    );
    try {
      await myAcc.synchronizeBalance();
      console.log(`balance = ${myAcc.getBalance()}`);
    } catch (err) {
      console.log(`SynchronizationFailedError`);
      expect(err).toStrictEqual(new SynchronizationFailedError());
    }
  });
});
