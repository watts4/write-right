import crypto from 'crypto';

interface Session {
  notionAccessToken: string;
  databaseId: string;
  createdAt: number;
}

interface PendingOAuth {
  codeVerifier: string;
  databaseId: string;
  createdAt: number;
}

const sessions = new Map<string, Session>();
const pendingOAuth = new Map<string, PendingOAuth>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createPendingOAuth(state: string, codeVerifier: string, databaseId: string) {
  pendingOAuth.set(state, { codeVerifier, databaseId, createdAt: Date.now() });
}

export function consumePendingOAuth(state: string): PendingOAuth | undefined {
  const pending = pendingOAuth.get(state);
  pendingOAuth.delete(state);
  return pending;
}

export function createSession(notionAccessToken: string, databaseId: string): string {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { notionAccessToken, databaseId, createdAt: Date.now() });
  return sessionId;
}

export function getSession(sessionId: string): Session | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return undefined;
  }
  return session;
}
