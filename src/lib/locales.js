
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function load(code){
  const p = path.join(__dirname, '..', 'locales', `${code}.json`);
  const txt = fs.readFileSync(p, 'utf-8');
  return JSON.parse(txt);
}

export const locales = {
  'en-US': load('en-US'),
  'de-DE': load('de-DE'),
};
