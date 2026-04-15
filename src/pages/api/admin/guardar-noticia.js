import fs from 'fs';
import path from 'path';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

function slugify(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .slice(0, 80);
}

async function githubGet(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new Error(`GitHub GET ${url} → ${res.status}`);
  return res.json();
}

async function githubPut(url, token, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT → ${res.status}: ${err}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, noticia, imagenBase64, imagenNombre } = req.body;

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword || password?.trim() !== envPassword.trim()) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const id = slugify(noticia.titulo) || Date.now().toString();
  const fecha = noticia.fecha || new Date().toISOString();
  let imagenPath = noticia.imagenUrl || '';

  // Convertir texto plano a HTML si no tiene etiquetas
  function textoAHtml(texto) {
    if (!texto) return '';
    if (/<[a-z][\s\S]*>/i.test(texto)) return texto; // ya es HTML
    return texto
      .split(/\n\n+/)
      .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }
  noticia.contenido = textoAHtml(noticia.contenido);

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'lamch/Redimidos';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const apiBase = `https://api.github.com/repos/${repo}/contents`;

  const nuevaNoticia = {
    id,
    titulo: noticia.titulo,
    categoria: noticia.categoria,
    fecha,
    imagen: imagenPath,
    descripcion: noticia.contenido,
    url: '',
  };

  try {
    if (token) {
      // ── PRODUCCIÓN: GitHub API ──────────────────────────────

      // 1. Subir imagen si viene en base64
      if (imagenBase64 && imagenNombre) {
        const ext = path.extname(imagenNombre) || '.jpg';
        const nombreArchivo = `${id}${ext}`;
        const rutaImagen = `public/storage/noticias/${nombreArchivo}`;
        imagenPath = `/storage/noticias/${nombreArchivo}`;
        nuevaNoticia.imagen = imagenPath;

        // Ver si ya existe (para obtener SHA)
        let shaImagen;
        try {
          const existente = await githubGet(`${apiBase}/${rutaImagen}`, token);
          shaImagen = existente.sha;
        } catch {}

        await githubPut(`${apiBase}/${rutaImagen}`, token, {
          message: `Admin: imagen para "${noticia.titulo}"`,
          content: imagenBase64,
          branch,
          ...(shaImagen ? { sha: shaImagen } : {}),
        });
      }

      // 2. Leer noticias.json actual
      const archivoActual = await githubGet(`${apiBase}/public/data/noticias.json`, token);
      const noticiasActuales = JSON.parse(Buffer.from(archivoActual.content, 'base64').toString('utf-8'));

      // 3. Agregar nueva noticia al inicio
      noticiasActuales.unshift(nuevaNoticia);
      const nuevoContenido = Buffer.from(
        JSON.stringify(noticiasActuales, null, 2)
      ).toString('base64');

      await githubPut(`${apiBase}/public/data/noticias.json`, token, {
        message: `Admin: nueva noticia "${noticia.titulo}"`,
        content: nuevoContenido,
        sha: archivoActual.sha,
        branch,
      });

    } else {
      // ── DESARROLLO: escribir en filesystem ─────────────────

      if (imagenBase64 && imagenNombre) {
        const ext = path.extname(imagenNombre) || '.jpg';
        const nombreArchivo = `${id}${ext}`;
        imagenPath = `/storage/noticias/${nombreArchivo}`;
        nuevaNoticia.imagen = imagenPath;
        const destino = path.join(process.cwd(), 'public', 'storage', 'noticias', nombreArchivo);
        fs.writeFileSync(destino, Buffer.from(imagenBase64, 'base64'));
      }

      const jsonPath = path.join(process.cwd(), 'public', 'data', 'noticias.json');
      const noticiasActuales = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      noticiasActuales.unshift(nuevaNoticia);
      fs.writeFileSync(jsonPath, JSON.stringify(noticiasActuales, null, 2), 'utf-8');
    }

    return res.status(200).json({ ok: true, id });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
