/**
 * Generate the Command Responsibility audiobook via the ElevenLabs API.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=... node scripts/generate-audiobook.mjs [--book de] [slug ...]
 *
 * Without slug arguments all chapters are generated; pass chapter slugs to
 * (re)generate specific ones. Output: public/book/audio/<slug>.mp3
 * (German edition: --book de reads book-de.json, writes public/book/audio-de/)
 *
 * Optional env:
 *   ELEVENLABS_VOICE_ID  (default: George — calm British narrator)
 *   ELEVENLABS_MODEL_ID  (default: eleven_multilingual_v2)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const bookFlag = args.indexOf("--book");
const LANG = bookFlag !== -1 ? args.splice(bookFlag, 2)[1] : "en";
const BOOK_FILE = LANG === "de" ? "src/data/book-de.json" : "src/data/book.json";
const BOOK = JSON.parse(fs.readFileSync(path.join(ROOT, BOOK_FILE), "utf-8"));
const OUT_DIR = path.join(ROOT, LANG === "de" ? "public/book/audio-de" : "public/book/audio");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const MAX_CHUNK = 4500; // characters per TTS request

if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set.");
  process.exit(1);
}

/** Narration text for one chapter: title, then paragraphs; headings pause. */
function chapterText(ch) {
  const parts = [ch.title + "."];
  for (const block of ch.blocks) {
    if (block.type === "h2") parts.push(block.text + ".");
    else if (block.type === "p" || block.type === "note") parts.push(block.text);
    // img blocks are not narrated
  }
  return parts.join("\n\n");
}

/** Split text into chunks below MAX_CHUNK, on paragraph boundaries. */
function chunkText(text) {
  const paras = text.split("\n\n");
  const chunks = [];
  let current = "";
  for (const p of paras) {
    if (current && current.length + p.length + 2 > MAX_CHUNK) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? current + "\n\n" + p : p;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function ttsWithRetry(text, previousText, nextText, previousIds, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await tts(text, previousText, nextText, previousIds);
    } catch (err) {
      if (attempt >= tries) throw err;
      console.log(` retry ${attempt} (${err.message})...`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
}

async function tts(text, previousText, nextText, previousIds) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        previous_text: previousText || undefined,
        next_text: nextText || undefined,
        previous_request_ids: previousIds.slice(-3),
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  const requestId = res.headers.get("request-id");
  const audio = Buffer.from(await res.arrayBuffer());
  return { audio, requestId };
}

async function generateChapter(ch) {
  const text = chapterText(ch);
  const chunks = chunkText(text);
  const chunkDir = path.join(OUT_DIR, ".chunks");
  fs.mkdirSync(chunkDir, { recursive: true });
  const buffers = [];
  const requestIds = [];
  for (let i = 0; i < chunks.length; i++) {
    // cache each chunk on disk so a failed run never wastes paid credits
    const cache = path.join(chunkDir, `${ch.slug}-${i}.mp3`);
    if (fs.existsSync(cache)) {
      console.log(`  chunk ${i + 1}/${chunks.length}... cached`);
      buffers.push(fs.readFileSync(cache));
      requestIds.length = 0; // stitching context broken; acceptable at chunk edges
      continue;
    }
    process.stdout.write(`  chunk ${i + 1}/${chunks.length}...`);
    const { audio, requestId } = await ttsWithRetry(
      chunks[i],
      i > 0 ? chunks[i - 1] : "",
      i < chunks.length - 1 ? chunks[i + 1] : "",
      requestIds
    );
    fs.writeFileSync(cache, audio);
    buffers.push(audio);
    if (requestId) requestIds.push(requestId);
    console.log(" ok");
  }
  const out = path.join(OUT_DIR, `${ch.slug}.mp3`);
  fs.writeFileSync(out, Buffer.concat(buffers));
  for (let i = 0; i < chunks.length; i++) {
    fs.rmSync(path.join(chunkDir, `${ch.slug}-${i}.mp3`), { force: true });
  }
  const mb = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
  console.log(`  -> ${out} (${mb} MB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const only = args;
  const chapters = BOOK.chapters.filter(
    (ch) => ch.words > 0 && (only.length === 0 || only.includes(ch.slug))
  );
  console.log(`Generating ${chapters.length} chapters with voice ${VOICE_ID}`);
  for (const ch of chapters) {
    console.log(`${ch.slug} (${ch.words} words)`);
    await generateChapter(ch);
  }
  console.log("Done. Audio players appear automatically after the next build/deploy.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
