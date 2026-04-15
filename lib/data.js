import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'public', 'data');
const storageDir = path.join(process.cwd(), 'public', 'storage');

// Convierte cualquier representación de fecha a objeto Date
export function toDate(fecha) {
  if (!fecha) return new Date(0);
  if (fecha instanceof Date) return fecha;
  if (typeof fecha === 'string' || typeof fecha === 'number') return new Date(fecha);
  if (fecha.seconds !== undefined) return new Date(fecha.seconds * 1000);
  if (fecha._seconds !== undefined) return new Date(fecha._seconds * 1000);
  return new Date(0);
}

function readJson(file) {
  try {
    const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getNoticias() {
  return readJson('noticias.json');
}

export function getNoticia(id) {
  return getNoticias().find(n => n.id === id) || null;
}

export function getRadios() {
  return readJson('radios.json');
}

export function getRadio(id) {
  return getRadios().find(r => r.id === id) || null;
}

export function getCategoriasImagenes() {
  return readJson('categoriasImagenes.json');
}

export function getImagenesDeFolder(carpeta) {
  const dir = path.join(storageDir, carpeta);
  if (!fs.existsSync(dir)) return [];
  const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  try {
    return fs.readdirSync(dir)
      .filter(f => exts.includes(path.extname(f).toLowerCase()))
      .map((f, i) => ({ src: `/storage/${carpeta}/${f}`, index: i }));
  } catch {
    return [];
  }
}

// Ordena por fecha descendente y serializa la fecha a string ISO
export function serializarNoticias(noticias) {
  return [...noticias]
    .sort((a, b) => toDate(b.fecha) - toDate(a.fecha))
    .map(n => ({ ...n, fecha: toDate(n.fecha).toISOString() }));
}
