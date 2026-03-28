import { Router, Request, Response } from 'express';
import { analyzeWritingViaMCP } from '../services/claude';
import { saveResultsToNotion } from '../services/notion';
import { getSession } from '../services/sessionStore';
import { AnalysisResult } from '../types';

function saveResultsBackground(token: string, dbId: string, result: AnalysisResult) {
  saveResultsToNotion(token, dbId, result)
    .then(url => console.log('Results saved to Notion:', url))
    .catch(err => console.error('Background Notion save failed:', err.message));
}

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
    const result = await analyzeWritingViaMCP(
      session.notionAccessToken,
      session.databaseId,
      gradeLevel
    );

    // Return results immediately — Notion write-back happens in background
    res.json(result);

    // Fire-and-forget: write results to Notion after response is sent
    saveResultsBackground(session.notionAccessToken, session.databaseId, result);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

export default router;
