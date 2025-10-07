import { Faker, en, de, base } from '@faker-js/faker';
import { RNG, combineSeed } from './rng.js';


export function generateCore(lang, userSeed, page, idxOnPage, pageSize) {
  const index   = (page - 1) * pageSize + idxOnPage;
  const seedStr = combineSeed(userSeed, page, index, lang);
  const rng     = new RNG(seedStr);

  
  const locales = lang === 'de-DE' ? [de, en, base] : [en, base];
  const faker = new Faker({ locale: locales });
  faker.seed(Math.floor(rng.next() * 0x7fffffff)); // deterministic

  return { rng, index, lang, faker };
}


export function generateSong(lang, userSeed, page, idxOnPage, pageSize, likesAvg) {
  const { rng, index, faker } = generateCore(lang, userSeed, page, idxOnPage, pageSize);

  const artist = rng.bool(0.5) ? faker.person.fullName() : faker.company.name();
  
  const title  = faker.music.songName();
  const album  = rng.bool(0.25) ? 'Single' : faker.commerce.productName();
  const genre  = faker.music.genre();

  const safe  = Number.isFinite(likesAvg) ? likesAvg : 0;
  const baseLikes = Math.floor(Math.max(0, Math.min(10, safe)));
  const frac  = Math.max(0, Math.min(1, safe - baseLikes));
  const likes = baseLikes + ((index * 1103515245 + 12345) % 1000 < frac * 1000 ? 1 : 0);

  return { index, title, artist, album, genre, likes };
}
