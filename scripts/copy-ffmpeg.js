#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, '..', 'public', 'ffmpeg');
fs.mkdirSync(path.join(outDir, 'core'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'ffmpeg'), { recursive: true });

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (r) => {
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => resolve(Buffer.concat(chunks)));
      r.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchAndSave(url, filePath) {
  const buf = await get(url);
  fs.writeFileSync(path.join(outDir, filePath), buf);
  console.log('Saved', filePath);
}

const CORE = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
const FFMPEG = 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/esm';

(async () => {
await Promise.all([
  fetchAndSave(`${CORE}/ffmpeg-core.js`, 'core/ffmpeg-core.js'),
  fetchAndSave(`${CORE}/ffmpeg-core.wasm`, 'core/ffmpeg-core.wasm'),
  fetchAndSave(`${FFMPEG}/index.js`, 'ffmpeg/index.js'),
  fetchAndSave(`${FFMPEG}/worker.js`, 'ffmpeg/worker.js'),
  fetchAndSave(`${FFMPEG}/classes.js`, 'ffmpeg/classes.js'),
  fetchAndSave(`${FFMPEG}/const.js`, 'ffmpeg/const.js'),
  fetchAndSave(`${FFMPEG}/errors.js`, 'ffmpeg/errors.js'),
  fetchAndSave(`${FFMPEG}/types.js`, 'ffmpeg/types.js'),
  fetchAndSave(`${FFMPEG}/utils.js`, 'ffmpeg/utils.js'),
]);
console.log('FFmpeg assets copied to public/ffmpeg/');
})().catch(e => { console.error(e); process.exit(1); });
