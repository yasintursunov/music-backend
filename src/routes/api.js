import express from 'express';
import { generateSong } from '../lib/generator.js';
import { generateCoverSVG } from '../lib/cover-svg.js';
import { generatePreviewWav } from '../lib/music.js';
import { generateLyrics } from '../lib/lyrics.js';

const router = express.Router();


function parseParams(q){
  const num = (v, def) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const lang = (q.lang && String(q.lang)) || 'en-US';
  const seed = (q.seed && String(q.seed)) || '1';

  const likes = clamp(num(q.likes, 3), 0, 10);                      // 0..10
  const page = Math.max(1, Math.trunc(num(q.page, 1)));             // >=1
  const pageSize = clamp(Math.max(1, Math.trunc(num(q.pageSize, 20))), 1, 100); // 1..100

  return { lang, seed, likes, page, pageSize };
}


router.get('/songs', (req, res) => {
  const { lang, seed, likes, page, pageSize } = parseParams(req.query);
  const items = [];
  for (let i=1; i<=pageSize; i++) {
    items.push(generateSong(lang, seed, page, i, pageSize, likes));
  }
  res.json({ page, pageSize, lang, seed, likes, items });
});

router.get('/cover', (req, res) => {
  const { lang, seed, page, pageSize } = parseParams(req.query);
  const idx = Math.max(1, Math.trunc(Number(req.query.idx)) || 1);
  const { title, artist } = generateSong(lang, seed, page, idx, pageSize, 0);
  const svg = generateCoverSVG(lang, seed, page, idx, pageSize, title, artist);
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.send(svg);
});

router.get('/preview', (req, res) => {
  const { lang, seed, page, pageSize } = parseParams(req.query);
  const idx = Math.max(1, Math.trunc(Number(req.query.idx)) || 1);
  const wav = generatePreviewWav(lang, seed, page, idx, pageSize);
  res.setHeader('Content-Type', 'audio/wav');  // <-- MP3 değil WAV
  res.send(wav);
});

router.get('/lyrics', async (req, res) => {
  const { lang, seed, page, pageSize } = parseParams(req.query);
  const idx = Math.max(1, Math.trunc(Number(req.query.idx)) || 1);
  const { generateLyrics } = await import('../lib/lyrics.js');
  const data = generateLyrics(lang, seed, page, idx, pageSize);
  res.json(data);
});

export default router;
