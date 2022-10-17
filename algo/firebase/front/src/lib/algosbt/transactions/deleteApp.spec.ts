import { test1Account } from '../account/accounts';
import { testNetAlgod as algod } from '../algod/algods';
import compile from '../algod/compile';
import approvalTeal from '../teal/revokedApproval.teal';
import clearTeal from '../teal/revokedClear.teal';

import createApp, { TxnParams } from './createApp';
import deleteApp from './deleteApp';

describe('deleteApp', () => {
  it('should work', async () => {
    const approvalProgram = await compile(algod, approvalTeal);
    const clearProgram = await compile(algod, clearTeal);
    const txnParams: TxnParams = {
      from: test1Account.addr,
      approvalProgram,
      clearProgram,
      numLocalInts: 0,
      numLocalByteSlices: 0,
      numGlobalInts: 1,
      numGlobalByteSlices: 0,
    };

    const appIndex = await createApp(algod, txnParams, test1Account.sk);

    try {
      console.log('Application Index:', appIndex);
    } finally {
      await deleteApp(
        algod,
        { from: test1Account.addr, appIndex },
        test1Account.sk
      );
    }
  });
});
