import { generateCore } from './generator.js';

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

export function generateCoverSVG(lang, userSeed, page, idxOnPage, pageSize, title, artist){
  const { rng } = generateCore(lang, userSeed, page, idxOnPage, pageSize);
  const size = 512;
  const h1 = Math.floor(rng.next()*360);
  const h2 = Math.floor(rng.next()*360);
  const bg = `linear-gradient(135deg, hsl(${h1},60%,55%), hsl(${h2},60%,35%))`;

  let rects = '';
  for (let i=0;i<10;i++){
    const w = 40 + Math.floor(rng.next()*120);
    const h = 40 + Math.floor(rng.next()*120);
    const x = Math.floor(rng.next()*(size-w));
    const y = Math.floor(rng.next()*(size-h));
    const hh = Math.floor(rng.next()*360);
    rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="hsl(${hh},70%,70%)" opacity="0.25" rx="12"/>`;
  }

  function wrap(str, max=18){
    const words = String(str).split(' ');
    const lines = [];
    let line = '';
    for (const w of words){
      if ((line + ' ' + w).trim().length > max){
        lines.push(line.trim()); line = w;
      } else {
        line = (line + ' ' + w).trim();
      }
    }
    if (line) lines.push(line);
    return lines.slice(0,3);
  }
  const titleLines = wrap(title, 18);
  const artistLines = wrap('by ' + artist, 22);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${h1},60%,55%)"/>
      <stop offset="100%" stop-color="hsl(${h2},60%,35%)"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${rects}
  <g fill="#fff" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-weight="700" font-size="40">
    ${titleLines.map((t,i)=>`<text x="24" y="${size-220 + i*48}">${esc(t)}</text>`).join('')}
  </g>
  <g fill="#fff" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="28" font-weight="500">
    ${artistLines.map((t,i)=>`<text x="24" y="${size-120 + i*36}">${esc(t)}</text>`).join('')}
  </g>
</svg>`;
  return Buffer.from(svg, 'utf-8');
}
