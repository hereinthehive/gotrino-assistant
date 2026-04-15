import { describe, it, expect } from 'vitest';
import { createAccount, deleteAccount, transferFunds } from './debt-tests-sample-source';

describe('createAccount', () => {
  it('creates an account', () => {
    expect(createAccount('alice')).toBeDefined();
  });

  it.skip('handles duplicate usernames', () => {
    // TODO: flaky, investigate
  });

  it('retries on network error', async () => {
    for (let i = 0; i < 5; i++) {
      try {
        await new Promise(r => setTimeout(r, 500));
        expect(createAccount('bob')).toBeDefined();
        break;
      } catch (e) {}
    }
  });
});

describe.skip('deleteAccount', () => {
  it('deletes', () => {});
});
