import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { spawn } from 'child_process';
import * as net from 'net';
import * as crypto from 'crypto';
import * as path from 'path';
import { CCSS_WRITING_STANDARDS } from './standards';
import { AnalysisResult } from '../types';

const anthropic = new Anthropic();

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

function waitForPort(port: number, retries = 20, delay = 300): Promise<void> {
  return new Promise((resolve, reject) => {
    const attempt = (remaining: number) => {
      const sock = net.createConnection({ port, host: '127.0.0.1' });
      sock.on('connect', () => { sock.destroy(); resolve(); });
      sock.on('error', () => {
        if (remaining <= 0) return reject(new Error(`MCP server did not start on port ${port}`));
        setTimeout(() => attempt(remaining - 1), delay);
      });
    };
    attempt(retries);
  });
}

/**
 * Phase 1: Use Notion MCP tools to read all student writing samples from the database.
 * This is the core MCP usage — Claude orchestrates the reads via tool calls.
 */
async function readStudentsViaMCP(
  notionToken: string,
  databaseId: string
): Promise<{ name: string; content: string }[]> {
  const port = await getFreePort();
  const authToken = crypto.randomUUID();
  const binPath = path.resolve(__dirname, '../../node_modules/.bin/notion-mcp-server');

  const mcpProcess = spawn(binPath, ['--transport', 'http', '--port', String(port)], {
    env: { ...process.env, NOTION_TOKEN: notionToken, AUTH_TOKEN: authToken },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  mcpProcess.stderr?.on('data', (d) => process.stderr.write(`[notion-mcp] ${d}`));

  try {
    await waitForPort(port);

    const mcpClient = new Client({ name: 'write-right', version: '1.0.0' }, { capabilities: {} });
    const transport = new StreamableHTTPClientTransport(
      new URL(`http://127.0.0.1:${port}/mcp`),
      { requestInit: { headers: { Authorization: `Bearer ${authToken}` } } }
    );
    await mcpClient.connect(transport);

    const { tools: mcpTools } = await mcpClient.listTools();
    const anthropicTools: Anthropic.Tool[] = mcpTools.map(t => ({
      name: t.name,
      description: t.description || t.name,
      input_schema: t.inputSchema as Anthropic.Tool['input_schema'],
    }));

    const prompt = `Use the Notion tools to read student writing samples from database ID: ${databaseId}

Steps:
1. Query the database to list all pages.
2. For each page, retrieve its block content to get the writing sample text.
3. Once you have all students' names and writing, return ONLY a JSON array — no other text:

[
  { "name": "Student Name", "content": "their full writing sample text" },
  ...
]`;

    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];
    let finalText = '';
    let iterations = 0;

    while (iterations++ < 30) {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8096,
        tools: anthropicTools,
        messages,
      });

      if (response.stop_reason === 'end_turn') {
        const textBlock = response.content.find(b => b.type === 'text');
        if (textBlock?.type === 'text') finalText = textBlock.text;
        break;
      }

      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });
        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const block of response.content) {
          if (block.type !== 'tool_use') continue;
          try {
            const result = await mcpClient.callTool({
              name: block.name,
              arguments: block.input as Record<string, unknown>,
            });
            const content = (result.content as any[])
              .map((c: any) => (c.type === 'text' ? c.text : JSON.stringify(c)))
              .join('\n');
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content });
          } catch (err: any) {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: `Error: ${err.message}`,
              is_error: true,
            });
          }
        }
        messages.push({ role: 'user', content: toolResults });
      } else {
        break;
      }
    }

    await mcpClient.close();

    const jsonMatch = finalText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Could not read student data from Notion via MCP');
    return JSON.parse(jsonMatch[0]);
  } finally {
    mcpProcess.kill();
  }
}

/**
 * Phase 2: Analyze student writing with Claude (no tools needed — pure LLM).
 */
async function analyzeStudents(
  students: { name: string; content: string }[],
  gradeLevel: string
): Promise<Omit<AnalysisResult, 'gradeLevel' | 'analyzedAt' | 'notionPageUrl'>> {
  const standards = CCSS_WRITING_STANDARDS[gradeLevel] || CCSS_WRITING_STANDARDS['3'];
  const standardsText = standards.map(s => `${s.code}: ${s.description}`).join('\n');
  const studentsText = students.map(s => `=== ${s.name} ===\n${s.content}`).join('\n\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are an expert K-8 literacy coach.

Grade Level: ${gradeLevel}
California CCSS Writing/Language Standards for Grade ${gradeLevel}:
${standardsText}

Student Writing Samples:
${studentsText}

Analyze each student ONLY against the grade-level standards above. Return ONLY valid JSON:
{
  "students": [{
    "studentName": "string",
    "teachingPoints": ["2-3 specific actionable points tied to a named standard"],
    "strengths": ["1-2 genuine strengths"],
    "standardsAddressed": ["W.3.1"]
  }],
  "smallGroups": [{
    "groupName": "string",
    "focus": "instructional focus",
    "students": ["names"],
    "suggestedActivity": "brief activity"
  }]
}`,
    }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Claude analysis response');
  return JSON.parse(jsonMatch[0]);
}

export async function analyzeWritingViaMCP(
  notionToken: string,
  databaseId: string,
  gradeLevel: string
): Promise<AnalysisResult> {
  // Phase 1: Read student data via Notion MCP (the core MCP integration)
  const students = await readStudentsViaMCP(notionToken, databaseId);
  if (students.length === 0) throw new Error('No student pages found in the Notion database.');

  // Phase 2: Analyze with Claude
  const analysis = await analyzeStudents(students, gradeLevel);

  const result: AnalysisResult = {
    gradeLevel,
    analyzedAt: new Date().toLocaleString(),
    ...analysis,
  };

  return result;
}
