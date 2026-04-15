export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword || password?.trim() !== envPassword.trim()) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  return res.status(200).json({ ok: true });
}
