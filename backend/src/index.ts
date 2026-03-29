import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';
import saveRouter from './routes/save';
import oauthRouter from './routes/oauth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  'https://write-right-app.web.app',
  'http://localhost:5173',
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, health checks)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 analysis runs per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait 15 minutes before analyzing again.' },
});

app.use('/api/analyze', analyzeLimiter, analyzeRouter);
app.use('/api/save', saveRouter);
app.use('/oauth', oauthRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`WriteRight backend running on port ${PORT}`);
});
