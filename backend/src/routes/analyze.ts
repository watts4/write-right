import { Router, Request, Response } from 'express';
import { analyzeWritingViaMCP } from '../services/claude';
import { getSession } from '../services/sessionStore';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { sessionId, gradeLevel } = req.body;

  if (!sessionId || !gradeLevel) {
    return res.status(400).json({ error: 'Missing required fields: sessionId, gradeLevel' });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please reconnect with Notion.' });
  }

  try {
    const result = await analyzeWritingViaMCP(session.notionAccessToken, session.databaseId, gradeLevel);
    res.json(result);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

export default router;
