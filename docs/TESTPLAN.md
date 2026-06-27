# COBOL Application Test Plan

This test plan covers the current COBOL application business logic and implementation. It is intended for stakeholder validation and as a reference for later creating unit and integration tests in a Node.js application.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | View account balance | Application starts successfully | 1. Start the application
2. Enter `1` | The application reads the current balance and displays `1000.00` |  |  | Verify the initial account balance is shown correctly |
| TC-002 | Credit account | Application starts successfully and current balance is `1000.00` | 1. Start the application
2. Enter `2`
3. Enter credit amount `200.00` | The application reads the current balance, adds `200.00`, writes the updated balance, and displays `1200.00` |  |  | Verify balance updates correctly after credit |
| TC-003 | Debit account with sufficient balance | Application starts successfully and current balance is `1000.00` or higher | 1. Start the application
2. Enter `3`
3. Enter debit amount `300.00` | The application reads the current balance, verifies sufficient funds, subtracts `300.00`, writes the updated balance, and displays `700.00` |  |  | Verify debit reduces balance correctly when funds are sufficient |
| TC-004 | Debit account with insufficient balance | Application starts successfully and current balance is less than withdrawal amount | 1. Start the application
2. Enter `3`
3. Enter debit amount `2000.00` | The application reads the balance, finds it insufficient, displays `Insufficient funds for this debit.`, and does not update the balance |  |  | Verify insufficient funds are rejected and balance remains unchanged |
| TC-005 | Handle invalid menu option | Application starts successfully | 1. Start the application
2. Enter `5` or another invalid option | The application displays `Invalid choice, please select 1-4.` and returns to the menu without crashing |  |  | Verify invalid input is handled gracefully |
| TC-006 | Exit application | Application starts successfully | 1. Start the application
2. Enter `4` | The application displays `Exiting the program. Goodbye!` and terminates |  |  | Verify the application exits cleanly |

## Covered Business Logic

- Read and display the current balance for a single account.
- Credit transactions: read the balance, add the credit amount, write the updated balance.
- Debit transactions: read the balance, verify sufficient funds, subtract the debit amount, write the updated balance.
- Reject debit transactions when funds are insufficient and display an error message.
- Handle invalid menu selections with an error prompt and return to the main menu.
- Exit the application cleanly on user request.

## Notes for Node.js migration

- The current COBOL app maintains a single account balance in memory for the duration of the session.
- Tests should capture both the display behavior and the underlying balance update rules.
- When migrating, preserve the same business rules and error messages for stakeholder validation.
