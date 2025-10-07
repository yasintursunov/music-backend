import seedrandom from 'seedrandom';


export function combineSeed(userSeed, page, index, lang) {
  return `${lang}|${userSeed || '1'}|p${page}|i${index}`;
}


export class RNG {
  constructor(seed) {
    this._rng = seedrandom(String(seed)); 
  }
  next() {              // 0..1
    return this._rng();
  }
  int(n) {              // 0..n-1
    return Math.floor(this._rng() * n);
  }
  bool(p = 0.5) {       
    return this._rng() < p;
  }
}
