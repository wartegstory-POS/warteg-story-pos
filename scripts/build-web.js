const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = process.cwd();
const out = path.join(root, '.build', 'web');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(out, 'index.html'));
fs.copyFileSync(path.join(root, 'version.json'), path.join(out, 'version.json'));
esbuild.buildSync({
  entryPoints: [path.join(root, 'updater.js')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome90'],
  outfile: path.join(out, 'updater.js'),
});
console.log('Warteg Story web bundle built from repository root into temporary .build/web');
