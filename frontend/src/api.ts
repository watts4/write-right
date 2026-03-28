import type { AnalysisResult, SetupConfig } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status)
  }
  return res.json() as Promise<T>
}

export function getAuthorizeUrl(databaseId: string): string {
  return `${BASE_URL}/oauth/authorize?database_id=${encodeURIComponent(databaseId)}`
}

export async function checkOAuthStatus(sessionId: string): Promise<{ connected: boolean; databaseId?: string }> {
  const res = await fetch(`${BASE_URL}/oauth/status?session=${encodeURIComponent(sessionId)}`)
  return handleResponse(res)
}

export async function analyzeClass(config: SetupConfig): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: config.sessionId,
      gradeLevel: config.gradeLevel,
    }),
  })
  return handleResponse<AnalysisResult>(res)
}

export async function saveToNotion(config: SetupConfig, result: AnalysisResult): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/api/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: config.sessionId, result }),
  })
  const data = await handleResponse<{ notionPageUrl: string }>(res)
  return { ...result, notionPageUrl: data.notionPageUrl }
}
