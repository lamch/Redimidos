// Script para exportar toda la data de Firebase
// Ejecutar con: node exportar-firebase.js

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const { getStorage, ref, listAll, getDownloadURL } = require("firebase/storage");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyAm0g92FS9R3fwu0QST_eq-gSexi3GeQko",
  authDomain: "app-cristian-ccbf3.appspot.com",
  projectId: "app-cristian-ccbf3",
  storageBucket: "app-cristian-ccbf3.appspot.com",
  messagingSenderId: "989711683222",
  appId: "1:989711683222:web:bc878dca5a5d251177fcb7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const OUTPUT_DIR = "./firebase-export";
const STORAGE_DIR = "./firebase-export/storage";

// Crear carpetas de salida
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

// ── EXPORTAR FIRESTORE ──────────────────────────────────────────────
async function exportarColeccion(nombre) {
  console.log(`\nExportando colección: ${nombre}...`);
  try {
    const snap = await getDocs(collection(db, nombre));
    const docs = [];
    snap.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    const filePath = path.join(OUTPUT_DIR, `${nombre}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), "utf8");
    console.log(`  ✓ ${docs.length} documentos guardados en ${filePath}`);
    return docs;
  } catch (err) {
    console.error(`  ✗ Error exportando ${nombre}:`, err.message);
    return [];
  }
}

// ── DESCARGAR ARCHIVOS DE STORAGE ──────────────────────────────────
function descargarArchivo(url, destino) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destino);
    const protocolo = url.startsWith("https") ? https : http;
    protocolo
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          // Seguir redirect
          const redir = url.startsWith("https") ? https : http;
          redir.get(res.headers.location, (res2) => {
            res2.pipe(file);
            file.on("finish", () => { file.close(); resolve(); });
          }).on("error", reject);
        } else {
          res.pipe(file);
          file.on("finish", () => { file.close(); resolve(); });
        }
      })
      .on("error", (err) => {
        fs.unlink(destino, () => {});
        reject(err);
      });
  });
}

async function exportarStorage(carpeta = "") {
  console.log(`\nListando Storage${carpeta ? ` → ${carpeta}` : " (raíz)"}...`);
  try {
    const storageRef = ref(storage, carpeta);
    const resultado = await listAll(storageRef);

    // Subcarpetas recursivo
    for (const subDir of resultado.prefixes) {
      const subPath = path.join(STORAGE_DIR, subDir.fullPath);
      if (!fs.existsSync(subPath)) fs.mkdirSync(subPath, { recursive: true });
      await exportarStorage(subDir.fullPath);
    }

    // Archivos
    for (const item of resultado.items) {
      const destino = path.join(STORAGE_DIR, item.fullPath);
      const dirDestino = path.dirname(destino);
      if (!fs.existsSync(dirDestino)) fs.mkdirSync(dirDestino, { recursive: true });

      if (fs.existsSync(destino)) {
        console.log(`  → Ya existe, saltando: ${item.fullPath}`);
        continue;
      }

      try {
        const url = await getDownloadURL(item);
        await descargarArchivo(url, destino);
        console.log(`  ✓ Descargado: ${item.fullPath}`);
      } catch (err) {
        console.error(`  ✗ Error descargando ${item.fullPath}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`  ✗ Error listando storage:`, err.message);
  }
}

// ── MAIN ────────────────────────────────────────────────────────────
async function main() {
  console.log("=== EXPORTACIÓN FIREBASE ===\n");

  // 1. Firestore
  console.log("--- FIRESTORE ---");
  await exportarColeccion("noticias");
  await exportarColeccion("radios");
  await exportarColeccion("categoriasImagenes");

  // 2. Storage
  console.log("\n--- STORAGE ---");
  await exportarStorage();

  console.log("\n=== EXPORTACIÓN COMPLETA ===");
  console.log(`Archivos guardados en: ${path.resolve(OUTPUT_DIR)}`);
}

main().catch(console.error);
