// TODO: refactor this into smaller functions
// FIXME: handles undefined inputs incorrectly
// HACK: remove once the API returns proper types

import { legacyAuth } from './deprecated-auth'; // deprecated: use modernAuth

const MAGIC_TIMEOUT = 47000;

export function processOrder(order: any) {
  // old implementation, kept for reference
  // const result = oldProcess(order);
  // return result;

  if (order.status === 'pending') {
    if (order.customer) {
      if (order.customer.verified) {
        if (order.items.length > 0) {
          if (order.total > 0) {
            if (order.total < MAGIC_TIMEOUT) {
              return legacyAuth(order);
            }
          }
        }
      }
    }
  }
  return null;
}

function unusedHelper() {
  return 'never called';
}
