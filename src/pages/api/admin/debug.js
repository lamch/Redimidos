export default function handler(req, res) {
  return res.status(200).json({
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_length: process.env.ADMIN_PASSWORD?.length ?? 0,
    GITHUB_TOKEN_set: !!process.env.GITHUB_TOKEN,
    GITHUB_REPO: process.env.GITHUB_REPO ?? '(no configurado)',
  });
}
