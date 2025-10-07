
export function combineSeed(userSeed, page, idx, lang) {
  let seed = BigInt.asUintN(64, BigInt(userSeed || '1'));
  const langHash = BigInt([...String(lang)].reduce((h,c)=>((h*131 + c.charCodeAt(0))>>>0), 2166136261));
  seed = BigInt.asUintN(64, (seed ^ (BigInt(page) * 0x9E3779B185EBCA87n)) + (BigInt(idx) * 0xC2B2AE3D27D4EB4Fn) + langHash);
  if (seed === 0n) seed = 1n;
  return seed;
}
export class RNG {
  constructor(seed){ this.state = seed || 1n; }
  next64(){
    let x = this.state;
    x ^= x >> 12n; x ^= x << 25n; x ^= x >> 27n;
    this.state = x;
    return BigInt.asUintN(64, x * 0x2545F4914F6CDD1Dn);
  }
  next(){ const v = this.next64() >> 11n; return Number(v)/Math.pow(2,53); }
  int(n){ return Math.floor(this.next()*n); }
  bool(p=0.5){ return this.next() < p; }
}
