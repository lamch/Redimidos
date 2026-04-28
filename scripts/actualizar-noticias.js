#!/usr/bin/env node
/**
 * scripts/actualizar-noticias.js
 *
 * Ejecutado por GitHub Actions:
 * 1. Llama al endpoint /api/bot-noticias en Vercel
 * 2. Prepend las noticias nuevas al inicio de public/data/noticias.json
 * 3. Evita duplicados por id
 * 4. Mantiene las últimas 200 noticias para que el archivo no crezca infinito
 */

const fs   = require("fs");
const path = require("path");
const https = require("https");
const http  = require("http");

const VERCEL_URL  = process.env.VERCEL_URL;   // ej: "https://redimidos.vercel.app"
const CRON_SECRET = process.env.CRON_SECRET;
const CANTIDAD    = process.env.CANTIDAD  || "5";
const DRY_RUN     = process.env.DRY_RUN   === "true";
const JSON_PATH   = path.join(__dirname, "../public/data/noticias.json");
const MAX_NOTICIAS = 200;

if (!VERCEL_URL || !CRON_SECRET) {
  console.error("❌ Falta VERCEL_URL o CRON_SECRET en los secrets de GitHub.");
  process.exit(1);
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function postJson(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data    = JSON.stringify(body);
    const parsed  = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   "POST",
      headers: {
        "Content-Type":   "application/json",
        "Content-Length": Buffer.byteLength(data),
        ...headers,
      },
    };
    const protocol = parsed.protocol === "https:" ? https : http;
    const req = protocol.request(options, (res) => {
      let resp = "";
      res.on("data", (c) => (resp += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(resp) }); }
        catch { resolve({ status: res.statusCode, body: resp }); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  🕊️  Bot Noticias — Redimidos.net");
  console.log("  " + new Date().toLocaleString("es-BO", { timeZone: "America/La_Paz" }));
  if (DRY_RUN) console.log("  ⚙️  MODO DRY-RUN");
  console.log("═══════════════════════════════════════════\n");

  // 1. Llamar al endpoint de Vercel
  const url = `${VERCEL_URL}/api/bot-noticias?cantidad=${CANTIDAD}${DRY_RUN ? "&dry=true" : ""}`;
  console.log(`📡 Llamando a: ${url}`);

  const { status, body } = await postJson(
    url,
    {},
    { Authorization: `Bearer ${CRON_SECRET}` }
  );

  if (status !== 200 || !body.ok) {
    console.error(`❌ Error del bot (HTTP ${status}):`, body.error || body);
    process.exit(1);
  }

  const nuevas = body.noticias;
  console.log(`✅ ${nuevas.length} noticias generadas por Claude\n`);

  // Mostrar resumen
  nuevas.forEach((n, i) => {
    console.log(`  [${i + 1}] ${n.titulo}`);
    console.log(`       Categoría: ${n.categoria} | Imagen: ${n.imagen ? "✓" : "✗"}\n`);
  });

  if (DRY_RUN) {
    console.log("⚙️  Dry-run: no se escribió nada.");
    return;
  }

  // 2. Leer noticias.json existente
  let existentes = [];
  if (fs.existsSync(JSON_PATH)) {
    try {
      existentes = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
    } catch {
      console.warn("⚠️  No se pudo parsear noticias.json — se sobreescribirá.");
    }
  }

  // 3. Evitar duplicados por id
  const idsExistentes = new Set(existentes.map(n => n.id));
  const sinDuplicados = nuevas.filter(n => !idsExistentes.has(n.id));

  if (sinDuplicados.length === 0) {
    console.log("ℹ️  Todas las noticias ya existen. Nada que agregar.");
    return;
  }

  // 4. Agregar al inicio y recortar a MAX_NOTICIAS
  const combinadas = [...sinDuplicados, ...existentes].slice(0, MAX_NOTICIAS);

  // 5. Escribir archivo
  fs.writeFileSync(JSON_PATH, JSON.stringify(combinadas, null, 2), "utf-8");

  console.log(`💾 noticias.json actualizado:`);
  console.log(`   +${sinDuplicados.length} nuevas | total: ${combinadas.length}`);
  console.log("\n✅ Listo. El workflow hará commit y Vercel redesplegará automáticamente.");
}

main().catch(err => {
  console.error("❌ Error fatal:", err.message);
  process.exit(1);
});
