import { Router, Request, Response } from 'express';
import { saveResultsToNotion } from '../services/notion';
import { getSession } from '../services/sessionStore';
import { AnalysisResult } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { sessionId, result }: { sessionId: string; result: AnalysisResult } = req.body;

  if (!sessionId || !result) {
    return res.status(400).json({ error: 'Missing required fields: sessionId, result' });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please reconnect with Notion.' });
  }

  try {
    const notionPageUrl = await saveResultsToNotion(session.notionAccessToken, session.databaseId, result);
    res.json({ notionPageUrl });
  } catch (err: any) {
    console.error('Save to Notion error:', err);
    res.status(500).json({ error: err.message || 'Failed to save to Notion' });
  }
});

export default router;
