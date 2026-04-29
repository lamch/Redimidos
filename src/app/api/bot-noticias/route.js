export const maxDuration = 60;

/**
 * API Route: POST /api/bot-noticias
 *
 * Recopila noticias cristianas del día, las resume con Claude AI,
 * obtiene imágenes y las agrega al archivo public/data/noticias.json
 *
 * Protegido con CRON_SECRET para que solo GitHub Actions pueda llamarlo.
 *
 * En producción (Vercel) este endpoint escribe al sistema de archivos
 * a través del script de GitHub Actions que hace git commit + push.
 * Ver: .github/workflows/bot-noticias.yml
 */

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { XMLParser } from "fast-xml-parser";

// ─── CATEGORÍAS (las que usa tu sitio) ───────────────────────────────────────

const CATEGORIAS = [
  "Actualidad",
  "Internacional",
  "Vida",
  "Ministerio",
  "Música",
];

// ─── FUENTES RSS ──────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { url: "https://www.protestantedigital.com/rss.xml",  source: "Protestante Digital" },
  { url: "https://noticiascristianas.com/feed/",        source: "Noticias Cristianas"  },
  { url: "https://www.vidacristiana.com/feed/",         source: "Vida Cristiana"       },
  { url: "https://www.christianpost.com/rss/",          source: "Christian Post"        },
  { url: "https://www.gospelherald.com/rss/",           source: "Gospel Herald"         },
  { url: "https://feeds.feedburner.com/evangelicalfocus-en", source: "Evangelical Focus"},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

// ─── FETCH RSS ────────────────────────────────────────────────────────────────

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "Redimidos-Bot/2.0" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const parsed = parser.parse(xml);
    const channel = parsed?.rss?.channel || parsed?.feed;
    if (!channel) return [];
    const items = channel.item || channel.entry || [];
    const list = Array.isArray(items) ? items : [items];
    return list.slice(0, 5).map((item) => ({
      titulo:      String(item.title?.["#text"] || item.title || "").trim(),
      descripcion: stripHtml(String(item.description?.["#text"] || item.description || item.summary?.["#text"] || item.summary || "")).slice(0, 500),
      link:        String(item.link?.["@_href"] || item.link || "").trim(),
      source:      feed.source,
    })).filter(a => a.titulo.length > 10);
  } catch {
    return [];
  }
}

// ─── GEMINI AI ────────────────────────────────────────────────────────────────

async function procesarConGemini(articulos, cantidad) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const texto = articulos
    .map((a, i) => `[${i + 1}] FUENTE: ${a.source}\nTÍTULO: ${a.titulo}\nDESCRIPCIÓN: ${a.descripcion}\nURL: ${a.link}`)
    .join("\n\n---\n\n");

  const prompt = `Eres el editor principal de Redimidos.net, un portal de noticias cristianas para América Latina.

Tienes estas noticias del día de distintas fuentes:

${texto}

Selecciona las ${cantidad} más relevantes e importantes para el lector cristiano latinoamericano.

Para cada una genera:
1. Un título en español (máximo 80 caracteres), atractivo y edificante
2. Un artículo completo en HTML en español (500-700 palabras). Usa etiquetas <p>, <h2>, <strong>, <em>, <blockquote>. Tono cercano, pastoral, con perspectiva bíblica. Puedes citar versículos bíblicos relevantes.
3. Una categoría EXACTAMENTE de esta lista: ${CATEGORIAS.join(" | ")}
4. Tres palabras en inglés para buscar una imagen relevante en Unsplash

Responde SOLO con un JSON array válido, sin texto adicional ni markdown:
[
  {
    "titulo": "...",
    "descripcion": "<p>...</p>",
    "categoria": "...",
    "imageQuery": "...",
    "fuente": "...",
    "urlFuente": "..."
  }
]`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(raw);
}

// ─── IMAGEN UNSPLASH ──────────────────────────────────────────────────────────

async function getImagen(query) {
  const key = process.env.UNSPLASH_KEY;
  if (!key) {
    const defaults = [
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
      "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&q=80",
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  }
  try {
    const q = encodeURIComponent(query + " christian faith");
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${q}&orientation=landscape&client_id=${key}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.urls?.regular || null;
  } catch {
    return null;
  }
}

// ─── HANDLER PRINCIPAL ────────────────────────────────────────────────────────

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dryRun   = searchParams.get("dry") === "true";
  const cantidad = parseInt(searchParams.get("cantidad") || "1");

  try {
    const todas = [];
    for (const feed of RSS_FEEDS) {
      const items = await fetchFeed(feed);
      todas.push(...items);
      await new Promise(r => setTimeout(r, 300));
    }

    if (todas.length === 0) {
      return NextResponse.json({ error: "Sin artículos en los feeds RSS" }, { status: 500 });
    }

    const generadas = await procesarConGemini(todas, cantidad);

    const nuevas = [];
    for (const art of generadas) {
      const imagenUrl = await getImagen(art.imageQuery || "church worship");
      const id = slugify(art.titulo);
      const fecha = new Date().toISOString();

      nuevas.push({
        id,
        titulo:      art.titulo,
        categoria:   art.categoria,
        fecha,
        imagen:      imagenUrl || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
        descripcion: art.descripcion,
        url:         art.urlFuente || "",
      });

      await new Promise(r => setTimeout(r, 500));
    }

    if (dryRun) {
      return NextResponse.json({ ok: true, dryRun: true, noticias: nuevas });
    }

    return NextResponse.json({ ok: true, noticias: nuevas });

  } catch (err) {
    console.error("Bot error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Bot de Noticias Redimidos activo ✓" });
}
