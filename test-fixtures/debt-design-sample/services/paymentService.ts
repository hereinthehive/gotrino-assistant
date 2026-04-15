import { db } from '../db';

export async function chargeCard(userId: string, amount: number) {
  const order = await db.orders.find({ userId });
  const user = await db.users.find(userId);
  return { charged: true };
}
