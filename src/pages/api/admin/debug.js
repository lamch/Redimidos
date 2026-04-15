import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  let noticias_total = 0;
  let primera_noticia = null;

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'noticias.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    noticias_total = data.length;
    primera_noticia = { titulo: data[0]?.titulo, fecha: data[0]?.fecha };
  } catch (e) {
    primera_noticia = 'Error leyendo archivo: ' + e.message;
  }

  return res.status(200).json({
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
    GITHUB_TOKEN_set: !!process.env.GITHUB_TOKEN,
    GITHUB_REPO: process.env.GITHUB_REPO ?? '(no configurado)',
    noticias_total,
    primera_noticia,
  });
}
