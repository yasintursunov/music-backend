import { Faker, en, de, base } from '@faker-js/faker';
import { RNG, combineSeed } from './rng.js';

export function generateLyrics(lang, userSeed, page, idxOnPage, pageSize) {
  const index   = (page - 1) * pageSize + idxOnPage;
  const seedStr = combineSeed(userSeed, page, index, lang);
  const rng     = new RNG(seedStr);

  const locales = lang === 'de-DE' ? [de, en, base] : [en, base];
  const faker = new Faker({ locale: locales });
  faker.seed(Math.floor(rng.next() * 0x7fffffff));

  
  const makeSentence = () => {
    const len = 4 + rng.int(7); // 4..10 kelime
    const words = Array.from({ length: len }, () => faker.word.sample());
    let s = words.join(' ').trim();
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return s + (rng.bool(0.2) ? '!' : '.');
   
  };

  const linesCount = 10 + rng.int(5);     // 10..14 satır
  const step       = 0.6 + rng.next() * 0.2;
  const lines = Array.from({ length: linesCount }, (_, i) => ({
    t: +(i * step).toFixed(2),
    text: makeSentence(),
  }));

  return { index, lines, duration: +(linesCount * step).toFixed(2) };
}
