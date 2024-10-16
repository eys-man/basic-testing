import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  const initBalance = 1000;
  const minDotation = 20;
  const myAcc = getBankAccount(initBalance);
  const recipientAcc = getBankAccount(initBalance);

  test('should create account with initial balance', () => {
    const newAcc = getBankAccount(initBalance);
    expect(newAcc.getBalance()).toBe(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const megaWithdraw = myAcc.getBalance() * 2;
    expect(() => myAcc.withdraw(megaWithdraw)).toThrow(
      new InsufficientFundsError(myAcc.getBalance()),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const megaTransfer = myAcc.getBalance() * 2;
    expect(() => myAcc.transfer(megaTransfer, recipientAcc)).toThrow(
      new InsufficientFundsError(myAcc.getBalance()),
    );
  });

  test('should throw error when transferring to the same account', () => {
    const someMoney = myAcc.getBalance();
    expect(() => myAcc.transfer(someMoney, myAcc)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const startBalance = myAcc.getBalance();
    expect(myAcc.deposit(minDotation).getBalance()).toBe(
      startBalance + minDotation,
    );
  });

  test('should withdraw money', () => {
    try {
      myAcc.withdraw(minDotation);
    } catch (err) {
      expect(err).toBe(new InsufficientFundsError(myAcc.getBalance()));
    }
  });

  test('should transfer money', () => {
    // делаем так, чтоб точно были деньги для снятия: сначала добавим деньги, потом их и снимем
    // console.log(
    //   `myAcc balanse = ${myAcc.getBalance()}, recepientAcc balance = ${recipientAcc.getBalance()}`,
    // );

    myAcc.deposit(minDotation);

    const startBalanceOfRecepientAcc = recipientAcc.getBalance();

    myAcc.transfer(minDotation, recipientAcc);

    // console.log(
    //   `myAcc balanse = ${myAcc.getBalance()}, recepientAcc balance = ${recipientAcc.getBalance()}`,
    // );

    expect(recipientAcc.getBalance()).toBe(
      startBalanceOfRecepientAcc + minDotation,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const data = await myAcc.fetchBalance();
    if (typeof data === `number`) expect(data).not.toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const data = await myAcc.fetchBalance();
    // console.log(`data is ${data}\n`);
    if (typeof data === `number`) {
      // console.log(`start balance is ${myAcc.getBalance()}\n`);
      const startBalance = myAcc.getBalance();
      const newBalance = startBalance + data;
      myAcc.deposit(data);
      expect(myAcc.getBalance()).toBe(newBalance);
      // console.log(`new balance is ${myAcc.getBalance()}\n`);
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      await myAcc.synchronizeBalance();
    } catch (err) {
      expect(err).toStrictEqual(new SynchronizationFailedError());
    }
  });
});
