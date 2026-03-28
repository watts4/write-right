import type { AnalysisResult, SetupConfig } from './types'

const BASE_URL = 'http://localhost:3001'

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

/**
 * Trigger analysis of the Notion database for the given config.
 * Returns the full AnalysisResult once the backend has processed all entries.
 */
export async function analyzeClass(config: SetupConfig): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notionApiKey: config.notionApiKey,
      notionDatabaseId: config.notionDatabaseId,
      gradeLevel: config.gradeLevel,
    }),
  })
  return handleResponse<AnalysisResult>(res)
}

/**
 * Save the analysis results as a new Notion page and return the updated
 * AnalysisResult (which will include notionPageUrl).
 */
export async function saveToNotion(
  config: SetupConfig,
  result: AnalysisResult,
): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/api/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notionApiKey: config.notionApiKey,
      notionDatabaseId: config.notionDatabaseId,
      result,
    }),
  })
  return handleResponse<AnalysisResult>(res)
}
