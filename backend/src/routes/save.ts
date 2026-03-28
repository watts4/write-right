// Save is now handled by Claude directly via Notion MCP during analysis.
// This route is kept as a no-op stub for backwards compatibility.
import { Router, Request, Response } from 'express';

const router = Router();

router.post('/', (_req: Request, res: Response) => {
  res.json({ message: 'Results are saved to Notion automatically during analysis via MCP.' });
});

export default router;
