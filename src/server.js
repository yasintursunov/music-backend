import express from 'express';
import cors from 'cors';
import api from './routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', api);
app.get('/healthz', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Music backend (JS, no native deps) on http://localhost:${PORT}`);
});
