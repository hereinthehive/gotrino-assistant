export async function createOrder(req: any, res: any) {
  const order = await db.orders.insert(req.body);
  res.send(order);
}

export async function getOrder(req: any, res: any) {
  const order = await db.orders.find(req.params.id);
  if (!order) {
    throw new Error('not found');
  }
  res.send(order);
}
