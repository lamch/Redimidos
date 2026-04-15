// Script para importar datos desde Firebase REST API (sin SDK)
// Corre con: node importar-firebase.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyAm0g92FS9R3fwu0QST_eq-gSexi3GeQko';
const PROJECT_ID = 'app-cristian-ccbf3';
const BUCKET = 'app-cristian-ccbf3.appspot.com';

const DATA_DIR = path.join(__dirname, 'public', 'data');
const STORAGE_DIR = path.join(__dirname, 'public', 'storage');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

// ── HTTP helper ─────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(e); }
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// ── Parsear formato Firestore ────────────────────────────────────────
function parseValue(val) {
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return parseInt(val.integerValue);
  if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.nullValue !== undefined) return null;
  if (val.arrayValue !== undefined) {
    return (val.arrayValue.values || []).map(parseValue);
  }
  if (val.mapValue !== undefined) {
    return parseFields(val.mapValue.fields || {});
  }
  return null;
}

function parseFields(fields) {
  const obj = {};
  for (const [key, val] of Object.entries(fields)) {
    obj[key] = parseValue(val);
  }
  return obj;
}

function parseDoc(doc) {
  const id = doc.name.split('/').pop();
  return { id, ...parseFields(doc.fields || {}) };
}

// ── Obtener colección completa (con paginación) ─────────────────────
async function getColeccion(nombre) {
  const docs = [];
  let pageToken = '';
  let pagina = 1;

  while (true) {
    const tokenParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${nombre}?key=${API_KEY}&pageSize=300${tokenParam}`;

    console.log(`  Página ${pagina}...`);
    const res = await get(url);

    if (res.documents) {
      res.documents.forEach(doc => docs.push(parseDoc(doc)));
    }

    if (res.nextPageToken) {
      pageToken = res.nextPageToken;
      pagina++;
    } else {
      break;
    }
  }
  return docs;
}

// ── Listar archivos en Storage ──────────────────────────────────────
async function listarStorage(prefijo = '') {
  const prefijoParam = prefijo ? `&prefix=${encodeURIComponent(prefijo)}` : '';
  const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o?key=${API_KEY}${prefijoParam}&maxResults=1000`;
  try {
    const res = await get(url);
    return res.items || [];
  } catch (err) {
    console.log(`  No se pudo listar storage: ${err.message}`);
    return [];
  }
}

// ── Descargar un archivo de Storage ────────────────────────────────
async function descargarStorage(item) {
  const nombreArchivo = decodeURIComponent(item.name);
  const destino = path.join(STORAGE_DIR, nombreArchivo);
  const dirDestino = path.dirname(destino);

  if (!fs.existsSync(dirDestino)) fs.mkdirSync(dirDestino, { recursive: true });
  if (fs.existsSync(destino)) {
    console.log(`    → Ya existe: ${nombreArchivo}`);
    return;
  }

  const downloadUrl = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(item.name)}?alt=media&key=${API_KEY}`;
  try {
    await downloadFile(downloadUrl, destino);
    console.log(`    ✓ ${nombreArchivo}`);
  } catch (err) {
    console.log(`    ✗ ${nombreArchivo}: ${err.message}`);
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────
async function main() {
  console.log('=== IMPORTANDO DATOS DESDE FIREBASE ===\n');

  // 1. Firestore
  const colecciones = ['noticias', 'radios', 'categoriasImagenes'];
  for (const col of colecciones) {
    console.log(`\nColección: ${col}`);
    try {
      const docs = await getColeccion(col);
      const archivo = path.join(DATA_DIR, `${col}.json`);
      fs.writeFileSync(archivo, JSON.stringify(docs, null, 2), 'utf8');
      console.log(`  ✓ ${docs.length} documentos → public/data/${col}.json`);
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }

  // 2. Storage
  console.log('\n\n=== DESCARGANDO ARCHIVOS DE STORAGE ===');
  console.log('(Puede fallar si la cuota está agotada)\n');

  const archivos = await listarStorage();
  if (archivos.length === 0) {
    console.log('No se pudieron listar archivos (cuota agotada o bucket vacío).');
    console.log('Los datos de Firestore ya fueron guardados correctamente.\n');
  } else {
    console.log(`${archivos.length} archivos encontrados. Descargando...\n`);
    for (const archivo of archivos) {
      await descargarStorage(archivo);
    }
  }

  console.log('\n=== LISTO ===');
  console.log('Datos guardados en public/data/');
  console.log('Imágenes guardadas en public/storage/');
}

main().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
