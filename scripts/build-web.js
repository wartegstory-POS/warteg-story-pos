const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = process.cwd();
const out = path.join(root, '.build', 'web');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
fs.copyFileSync(path.join(root, 'version.json'), path.join(out, 'version.json'));

esbuild.buildSync({
  entryPoints: [path.join(root, 'updater.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome90'],
  outfile: path.join(out, 'updater.js'),
});

// Inject the bundled native plugin bridge into the WebView page.
html = html.replace(/<script\b[^>]*\bsrc=["'](?:\.\/)?updater\.js["'][^>]*>\s*<\/script>/gi, '');
if (!/<\/body>/i.test(html)) {
  throw new Error('index.html does not contain a closing </body> tag');
}
html = html.replace(/<\/body>/i, '<script src="updater.js"></script></body>');
fs.writeFileSync(path.join(out, 'index.html'), html);

console.log('Warteg Story web bundle built; updater.js is injected into index.html.');
