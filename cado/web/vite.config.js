import fs from 'node:fs';
import path from 'node:path';

// Nur im lokalen Entwicklungsserver: "Als Vorlage speichern" legt den Entwurf als JSON in src/builder/saved/ ab.
// Diese Dateien werden beim Build mit ausgeliefert (templates.js liest sie per import.meta.glob ein).
const SAVED = path.resolve('src/builder/saved');
const slug = (s) => String(s).toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'vorlage';

function saveTemplates() {
  return {
    name: 'cado-save-templates',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__templates', (req, res) => {
        const reply = (status, body) => { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(body)); };
        let raw = '';
        req.on('data', (chunk) => { raw += chunk; if (raw.length > 5e6) req.destroy(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(raw || '{}');
            const file = path.join(SAVED, `${slug(data.name)}.json`);
            if (req.method === 'POST' && req.url === '/save') {
              if (!data.name || !Array.isArray(data.bricks) || !data.bricks.length) return reply(400, { error: 'Name und Steine fehlen' });
              fs.mkdirSync(SAVED, { recursive: true });
              const { name, group, note, dark, view, bricks } = data;
              const lines = bricks.map((b) => '    ' + JSON.stringify(b)).join(',\n');
              const head = JSON.stringify({ name, group, note, dark, view }, null, 2).replace(/\n}$/, '');
              fs.writeFileSync(file, `${head},\n  "bricks": [\n${lines}\n  ]\n}\n`);
              return reply(200, { file: path.relative(process.cwd(), file) });
            }
            if (req.method === 'POST' && req.url === '/delete') {
              if (fs.existsSync(file)) fs.unlinkSync(file);
              return reply(200, { deleted: path.relative(process.cwd(), file) });
            }
            reply(404, { error: 'unbekannt' });
          } catch (e) {
            reply(500, { error: String(e.message) });
          }
        });
      });
    },
  };
}

export default {
  server: { port: 5183, strictPort: true },
  plugins: [saveTemplates()],
};
