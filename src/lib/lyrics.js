import { locales } from './locales.js';
import { RNG, combineSeed } from './rng.js';

export function generateLyrics(lang, userSeed, page, idxOnPage, pageSize){
  const loc = locales[lang] ?? locales['en-US'];
  const phrases = loc.lyricPhrases || ["La la la","Oooh","Yeah"];
  const index = (page - 1) * pageSize + idxOnPage;
  const seed = combineSeed(userSeed, page, index, lang);
  const rng = new RNG(seed);

  const linesCount = 10 + rng.int(5);         // 10..14 satır
  const step = 0.6 + rng.next()*0.2;          // 0.6..0.8 sn
  const lines = [];
  for(let i=0;i<linesCount;i++){
    const t = +(i*step).toFixed(2);
    const text = phrases[rng.int(phrases.length)];
    lines.push({ t, text });
  }
  return { index, lines, duration: +(linesCount*step).toFixed(2) };
}
