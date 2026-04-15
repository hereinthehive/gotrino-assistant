export async function createUser(req: any, res: any) {
  try {
    const user = await db.users.insert(req.body);
    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
