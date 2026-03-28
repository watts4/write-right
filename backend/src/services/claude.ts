import Anthropic from '@anthropic-ai/sdk';
import { CCSS_WRITING_STANDARDS } from './standards';
import { AnalysisResult } from '../types';

const client = new Anthropic();

export async function analyzeWritingViaMCP(
  notionAccessToken: string,
  databaseId: string,
  gradeLevel: string
): Promise<AnalysisResult> {
  const standards = CCSS_WRITING_STANDARDS[gradeLevel] || CCSS_WRITING_STANDARDS['3'];
  const standardsText = standards.map(s => `${s.code}: ${s.description}`).join('\n');

  const prompt = `You are WriteRight, an expert K-8 literacy coach. Your job is to analyze student writing samples stored in a Notion database and produce individualized teaching recommendations.

**Grade Level:** ${gradeLevel}

**California Common Core Writing and Language Standards for Grade ${gradeLevel}:**
${standardsText}

**Your task — use the Notion tools to complete these steps:**

1. Query the Notion database (ID: ${databaseId}) to list all student pages.
2. For each page, retrieve its full content to read the student's writing sample. Use the page title as the student's name.
3. Analyze each student's writing ONLY against the grade-level standards listed above. Do not apply standards from other grade levels.
4. For each student, identify:
   - 2-3 specific, actionable teaching points tied to named standards (e.g. "W.3.1: Strengthen opinion claim — Marcus states 'I like dogs' but doesn't present a clear argument")
   - 1-2 genuine strengths
   - Which standard codes are most relevant
5. Group students by shared instructional need for small group instruction.
6. Create a new page in the database titled "WriteRight Analysis — Grade ${gradeLevel} — [today's date]" with the full analysis formatted clearly. Include per-student sections and a small group recommendations section.

After completing all steps, return a JSON summary in this exact format (and only this JSON, no other text):
{
  "students": [
    {
      "studentName": "string",
      "teachingPoints": ["specific teaching point tied to a standard"],
      "strengths": ["genuine strength"],
      "standardsAddressed": ["W.3.1", "L.3.2"]
    }
  ],
  "smallGroups": [
    {
      "groupName": "string",
      "focus": "specific instructional focus",
      "students": ["student names"],
      "suggestedActivity": "brief responsive small group activity description"
    }
  ],
  "notionPageUrl": "the URL of the results page you created in Notion"
}`;

  const response = await (client.beta.messages as any).create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    betas: ['mcp-client-2025-04-04'],
    mcp_servers: [
      {
        type: 'url',
        url: 'https://mcp.notion.com/mcp',
        name: 'notion',
        authorization_token: notionAccessToken,
      },
    ],
    messages: [{ role: 'user', content: prompt }],
  });

  // Find the last text block (Claude's final JSON response after tool use)
  const textBlock = [...response.content].reverse().find((b: any) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    gradeLevel,
    analyzedAt: new Date().toLocaleString(),
    students: parsed.students,
    smallGroups: parsed.smallGroups,
    notionPageUrl: parsed.notionPageUrl,
  };
}
