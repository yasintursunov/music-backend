import { locales } from './locales.js';
import { RNG, combineSeed } from './rng.js';

function sentenceFromWords(rng, words, min = 2, max = 4) {
  const n = Math.max(min, Math.min(max, 1 + rng.int(max)));
  const chosen = [];
  for (let i = 0; i < n; i++) chosen.push(words[rng.int(words.length)]);
  const s = chosen.join(' ').replace(/\s+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function randomBandName(rng, loc) {
  if (rng.bool(0.5)) {
    return `${loc.bandWords[rng.int(loc.bandWords.length)]}`;
  }
  const last = loc.lastNames[rng.int(loc.lastNames.length)];
  const suffix = rng.bool(0.5) ? ' Band' : '';
  return `${loc.firstNames[rng.int(loc.firstNames.length)]} ${last}${suffix}`;
}

export function generateCore(lang, userSeed, page, idxOnPage, pageSize) {
  const loc = locales[lang] ?? locales['en-US'];
  const index = (page - 1) * pageSize + idxOnPage;
  const seed = combineSeed(userSeed, page, index, lang);
  const rng = new RNG(seed);
  return { rng, loc, index };
}

export function generateSong(lang, userSeed, page, idxOnPage, pageSize, likesAvg) {
  const { rng, loc, index } = generateCore(lang, userSeed, page, idxOnPage, pageSize);

  const isSingle = rng.bool(0.25);
  const title = sentenceFromWords(rng, loc.bandWords, 2, 4);
  const artist = randomBandName(rng, loc);
  const album = isSingle ? 'Single' : sentenceFromWords(rng, loc.albumWords, 2, 3);
  const genre = loc.genres[rng.int(loc.genres.length)];

  const safeLikes = Number.isFinite(likesAvg) ? likesAvg : 0;
  const base = Math.floor(Math.max(0, Math.min(10, safeLikes)));
  const frac = Math.max(0, Math.min(1, safeLikes - base));
  const likes = base + ((index * 1103515245 + 12345) % 1000 < frac * 1000 ? 1 : 0);

  return { index, title, artist, album, genre, likes };
}
