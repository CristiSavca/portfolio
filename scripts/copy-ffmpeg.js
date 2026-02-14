#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'ffmpeg');
const coreSrcDir = path.join(rootDir, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm');
const ffmpegSrcDir = path.join(rootDir, 'node_modules', '@ffmpeg', 'ffmpeg', 'dist', 'esm');

fs.mkdirSync(path.join(outDir, 'core'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'ffmpeg'), { recursive: true });

function copy(srcDir, srcName, destRelPath) {
  const src = path.join(srcDir, srcName);
  const dest = path.join(outDir, destRelPath);
  fs.copyFileSync(src, dest);
  console.log('Copied', destRelPath);
}

copy(coreSrcDir, 'ffmpeg-core.js', 'core/ffmpeg-core.js');
copy(coreSrcDir, 'ffmpeg-core.wasm', 'core/ffmpeg-core.wasm');
copy(ffmpegSrcDir, 'index.js', 'ffmpeg/index.js');
copy(ffmpegSrcDir, 'worker.js', 'ffmpeg/worker.js');
copy(ffmpegSrcDir, 'classes.js', 'ffmpeg/classes.js');
copy(ffmpegSrcDir, 'const.js', 'ffmpeg/const.js');
copy(ffmpegSrcDir, 'errors.js', 'ffmpeg/errors.js');
copy(ffmpegSrcDir, 'types.js', 'ffmpeg/types.js');
copy(ffmpegSrcDir, 'utils.js', 'ffmpeg/utils.js');

console.log('FFmpeg assets copied to public/ffmpeg/');
