import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createPendingOAuth, consumePendingOAuth, createSession, getSession } from '../services/sessionStore';

const router = Router();

const CLIENT_ID = process.env.NOTION_OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.NOTION_OAUTH_CLIENT_SECRET!;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI!;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://write-right-app.web.app';

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

// GET /oauth/authorize?database_id=xxx
router.get('/authorize', (req: Request, res: Response) => {
  const databaseId = req.query.database_id as string;
  if (!databaseId) return res.status(400).json({ error: 'database_id is required' });

  const state = crypto.randomUUID();
  const { verifier, challenge } = generatePKCE();

  createPendingOAuth(state, verifier, databaseId);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    owner: 'user',
  });

  res.redirect(`https://api.notion.com/v1/oauth/authorize?${params}`);
});

// GET /oauth/callback
router.get('/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return res.redirect(`${FRONTEND_URL}?oauth_error=${encodeURIComponent(error)}`);
  }

  const pending = consumePendingOAuth(state);
  if (!pending) {
    return res.redirect(`${FRONTEND_URL}?oauth_error=invalid_state`);
  }

  try {
    const tokenRes = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: pending.codeVerifier,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Notion token exchange failed:', err);
      return res.redirect(`${FRONTEND_URL}?oauth_error=token_exchange_failed`);
    }

    const tokenData = await tokenRes.json() as { access_token: string };
    const sessionId = createSession(tokenData.access_token, pending.databaseId);

    res.redirect(`${FRONTEND_URL}?session=${sessionId}&database_id=${pending.databaseId}`);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    res.redirect(`${FRONTEND_URL}?oauth_error=server_error`);
  }
});

// GET /oauth/status?session=xxx
router.get('/status', (req: Request, res: Response) => {
  const sessionId = req.query.session as string;
  if (!sessionId) return res.json({ connected: false });
  const session = getSession(sessionId);
  res.json({ connected: !!session, databaseId: session?.databaseId });
});

export default router;
