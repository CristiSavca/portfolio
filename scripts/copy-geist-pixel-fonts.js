const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../node_modules/geist/dist/fonts/geist-pixel');
const dest = path.join(__dirname, '../public/fonts');

const files = fs.readdirSync(src).filter((f) => f.endsWith('.woff2'));
for (const f of files) {
  fs.copyFileSync(path.join(src, f), path.join(dest, f));
  console.log('Copied', f);
}
