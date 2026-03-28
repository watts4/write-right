import { Router, Request, Response } from 'express';
import { saveResultsToNotion } from '../services/notion';
import { AnalysisResult } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { notionApiKey, databaseId, result }: { notionApiKey: string; databaseId: string; result: AnalysisResult } = req.body;

  if (!notionApiKey || !databaseId || !result) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pageUrl = await saveResultsToNotion(notionApiKey, databaseId, result);
    res.json({ pageUrl });
  } catch (err: any) {
    console.error('Save error:', err);
    res.status(500).json({ error: err.message || 'Save failed' });
  }
});

export default router;
