import { Router, Request, Response } from 'express';
import { getStudentPages } from '../services/notion';
import { analyzeWriting } from '../services/claude';
import { AnalyzeRequest } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { notionApiKey, databaseId, gradeLevel }: AnalyzeRequest = req.body;

  if (!notionApiKey || !databaseId || !gradeLevel) {
    return res.status(400).json({ error: 'Missing required fields: notionApiKey, databaseId, gradeLevel' });
  }

  try {
    const students = await getStudentPages(notionApiKey, databaseId);

    if (students.length === 0) {
      return res.status(400).json({ error: 'No student writing samples found in the Notion database. Make sure pages have content and the integration is connected.' });
    }

    const result = await analyzeWriting(students, gradeLevel);
    res.json(result);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

export default router;
