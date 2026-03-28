import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';
import saveRouter from './routes/save';
import oauthRouter from './routes/oauth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/analyze', analyzeRouter);
app.use('/api/save', saveRouter);
app.use('/oauth', oauthRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`WriteRight backend running on port ${PORT}`);
});
