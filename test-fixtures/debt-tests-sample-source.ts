export function createAccount(username: string) {
  return { username };
}

export function deleteAccount(id: string) {
  return true;
}

export function transferFunds(from: string, to: string, amount: number) {
  return { from, to, amount };
}
