import { combineSeed, RNG } from './rng.js';

function floatTo16(i) {
  let s = Math.max(-1, Math.min(1, i));
  return s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
}

function makeWavBuffer(left, right, sampleRate) {
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const dataSize = left.length * numChannels * bytesPerSample;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);              
  header.writeUInt16LE(1, 20);                
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); 
  header.writeUInt16LE(numChannels * bytesPerSample, 32);              
  header.writeUInt16LE(8 * bytesPerSample, 34);                         
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  const pcm = Buffer.alloc(dataSize);
  let o = 0;
  for (let i = 0; i < left.length; i++) {
    const l = floatTo16(left[i]);
    const r = floatTo16(right[i]);
    pcm.writeInt16LE(l, o); o += 2;
    pcm.writeInt16LE(r, o); o += 2;
  }
  return Buffer.concat([header, pcm]);
}


export function generatePreviewWav(lang, userSeed, page, idxOnPage, pageSize) {
  const globalIdx = (page - 1) * pageSize + idxOnPage;
  const seed = combineSeed(userSeed, page, globalIdx, lang);
  const rng = new RNG(seed);

  const sampleRate = 44100;
  const seconds = 8;
  const total = sampleRate * seconds;

  const tempo = 100 + Math.floor(rng.next() * 40);
  const spb = 60 / tempo;
  const spbSamples = Math.max(1, Math.floor(sampleRate * spb));

  const scales = [[0,2,4,7,9],[0,3,5,7,10],[0,2,3,5,7,8,10]];
  const scale = scales[Math.floor(rng.next() * scales.length)];
  const root = 48 + Math.floor(rng.next() * 18);

  const L = new Float32Array(total), R = new Float32Array(total);
  const twoPI = Math.PI * 2;

  function env(i, a, r, start, end) {
    if (i < start || i > end) return 0;
    const t = i - start, len = end - start;
    const aa = Math.min(1, t / a), rr = Math.max(0, 1 - (t - a) / r);
    return Math.max(0, Math.min(1, Math.min(aa, rr, t / len)));
  }

 
  for (let i = 0; i < total; i++) {
    const beat = Math.floor(i / spbSamples);
    const midi = root + scale[beat % scale.length] - 12;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const phase = (i * f / sampleRate) % 1;
    const v = (phase < 0.5 ? 1 : -1) * 0.18 * env(i, spbSamples * 0.1, spbSamples * 0.9, beat * spbSamples, (beat + 1) * spbSamples);
    L[i] += v * 0.9; R[i] += v * 0.9;
  }

  
  const hop = Math.max(1, Math.floor(spbSamples / 2));
  for (let start = 0; start < total; start += hop) {
    const midi = root + scale[Math.floor(rng.next() * scale.length)] + 12;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const end = Math.min(total - 1, start + hop);
    for (let i = start; i <= end; i++) {
      const phase = (i * f / sampleRate) % 1;
      const v = Math.sin(phase * twoPI) * 0.28 * env(i, hop * 0.15, hop * 0.85, start, end);
      L[i] += v; R[i] += v;
    }
  }


  for (let i = 0; i < total; i++) {
    L[i] = Math.tanh(L[i] * 1.6);
    R[i] = Math.tanh(R[i] * 1.6);
  }

  return makeWavBuffer(L, R, sampleRate);    
}
