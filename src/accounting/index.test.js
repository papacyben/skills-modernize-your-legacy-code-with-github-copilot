const { dataProgram, operations, resetBalance, getStorageBalance } = require('./index');

function createMockRl(inputs) {
  let callCount = 0;
  return {
    question: (questionText, callback) => {
      callback(inputs[callCount++] ?? '');
    },
    close: jest.fn(),
  };
}

beforeEach(() => {
  resetBalance(1000.0);
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('TC-001: View account balance displays current balance', async () => {
  const rl = createMockRl([]);
  await operations('TOTAL ', rl);
  expect(console.log).toHaveBeenCalledWith('Current balance: 1000.00');
  expect(getStorageBalance()).toBe(1000.0);
});

test('TC-002: Credit account updates balance and displays new balance', async () => {
  const rl = createMockRl(['200.00']);
  await operations('CREDIT', rl);
  expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1200.00');
  expect(getStorageBalance()).toBe(1200.0);
});

test('TC-003: Debit account with sufficient balance updates balance and displays new balance', async () => {
  const rl = createMockRl(['300.00']);
  await operations('DEBIT ', rl);
  expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
  expect(getStorageBalance()).toBe(700.0);
});

test('TC-004: Debit account with insufficient balance rejects transaction and leaves balance unchanged', async () => {
  resetBalance(100.0);
  const rl = createMockRl(['2000.00']);
  await operations('DEBIT ', rl);
  expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
  expect(getStorageBalance()).toBe(100.0);
});

test('TC-005: Invalid menu option displays error message', async () => {
  const rl = createMockRl([]);
  await operations('INVALID', rl);
  expect(console.log).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
  expect(getStorageBalance()).toBe(1000.0);
});

test('TC-006: dataProgram read and write maintain balance integrity', () => {
  expect(dataProgram('READ')).toBe(1000.0);
  dataProgram('WRITE', 500.0);
  expect(dataProgram('READ')).toBe(500.0);
  expect(getStorageBalance()).toBe(500.0);
});
