import express from 'express';
import cors from 'cors';
import api from './routes/api.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());
app.use('/api', api);
app.get('/healthz', (_req, res) => res.json({ ok: true }));

export default app;
if (!process.env.VERCEL && !process.env.AWS_REGION) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Music backend on http://localhost:${PORT}`));
}
