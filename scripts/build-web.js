const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = process.cwd();
const out = path.join(root, '.build', 'web');

// Hapus hasil build lama
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// Salin semua file dari folder public jika ada
const publicDir = path.join(root, 'public');

if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, out, { recursive: true });
}

// Baca index.html utama
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Salin version.json ke hasil build
fs.copyFileSync(
  path.join(root, 'version.json'),
  path.join(out, 'version.json')
);

// Bundle updater.js
esbuild.buildSync({
  entryPoints: [path.join(root, 'updater.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome90'],
  outfile: path.join(out, 'updater.js')
});

// Hapus script updater.js lama jika ada di index.html
html = html.replace(
  /<script\b[^>]*\bsrc=["'](?:\.\/)?updater\.js["'][^>]*>\s*<\/script>/gi,
  ''
);

// Pastikan index.html memiliki tag </body>
if (!/<\/body>/i.test(html)) {
  throw new Error('index.html does not contain a closing </body> tag');
}

// Sisipkan updater.js sebelum </body>
html = html.replace(
  /<\/body>/i,
  '<script src="updater.js"></script></body>'
);

// Simpan index.html hasil build
fs.writeFileSync(path.join(out, 'index.html'), html);

console.log('Warteg Story web bundle built; updater.js is injected into index.html.');
