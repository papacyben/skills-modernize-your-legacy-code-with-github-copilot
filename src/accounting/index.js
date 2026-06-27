const readline = require('readline');

let storageBalance = 1000.0;

function resetBalance(value = 1000.0) {
  storageBalance = value;
}

function getStorageBalance() {
  return storageBalance;
}

function dataProgram(operation, balance = 0) {
  if (operation === 'READ') {
    return storageBalance;
  }

  if (operation === 'WRITE') {
    storageBalance = balance;
    return storageBalance;
  }

  throw new Error(`Unsupported data operation: ${operation}`);
}

function formatCurrency(amount) {
  return amount.toFixed(2);
}

function promptQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function operations(operationType, rl) {
  if (operationType === 'TOTAL ') {
    const balance = dataProgram('READ');
    console.log(`Current balance: ${formatCurrency(balance)}`);
    return;
  }

  if (operationType === 'CREDIT') {
    const input = await promptQuestion(rl, 'Enter credit amount: ');
    const amount = parseFloat(input);

    if (Number.isNaN(amount) || amount < 0) {
      console.log('Invalid amount. Please enter a positive numeric value.');
      return;
    }

    const currentBalance = dataProgram('READ');
    const newBalance = currentBalance + amount;
    dataProgram('WRITE', newBalance);
    console.log(`Amount credited. New balance: ${formatCurrency(newBalance)}`);
    return;
  }

  if (operationType === 'DEBIT ') {
    const input = await promptQuestion(rl, 'Enter debit amount: ');
    const amount = parseFloat(input);

    if (Number.isNaN(amount) || amount < 0) {
      console.log('Invalid amount. Please enter a positive numeric value.');
      return;
    }

    const currentBalance = dataProgram('READ');
    if (currentBalance >= amount) {
      const newBalance = currentBalance - amount;
      dataProgram('WRITE', newBalance);
      console.log(`Amount debited. New balance: ${formatCurrency(newBalance)}`);
    } else {
      console.log('Insufficient funds for this debit.');
    }
    return;
  }

  console.log('Invalid choice, please select 1-4.');
}

async function main(rl) {
  const localRl = rl || readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
    const choice = await promptQuestion(localRl, 'Enter your choice (1-4): ');

    switch (choice) {
      case '1':
        await operations('TOTAL ', localRl);
        break;
      case '2':
        await operations('CREDIT', localRl);
        break;
      case '3':
        await operations('DEBIT ', localRl);
        break;
      case '4':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
  localRl.close();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = {
  dataProgram,
  formatCurrency,
  operations,
  promptQuestion,
  main,
  resetBalance,
  getStorageBalance,
};
