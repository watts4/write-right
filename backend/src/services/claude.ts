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

export async function analyzeWritingViaMCP(
  notionToken: string,
  databaseId: string,
  gradeLevel: string
): Promise<AnalysisResult> {
  const port = await getFreePort();
  const authToken = crypto.randomUUID();
  const binPath = path.resolve(__dirname, '../../node_modules/.bin/notion-mcp-server');

  // Spawn the official Notion MCP server as a subprocess
  const mcpProcess = spawn(binPath, ['--transport', 'http', '--port', String(port)], {
    env: {
      ...process.env,
      NOTION_TOKEN: notionToken,
      AUTH_TOKEN: authToken,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  mcpProcess.stderr?.on('data', (d) => process.stderr.write(`[notion-mcp] ${d}`));

  try {
    // Wait for MCP server to be ready
    await waitForPort(port);

    // Connect MCP client
    const mcpClient = new Client({ name: 'write-right', version: '1.0.0' }, { capabilities: {} });
    const transport = new StreamableHTTPClientTransport(
      new URL(`http://127.0.0.1:${port}/mcp`),
      { requestInit: { headers: { Authorization: `Bearer ${authToken}` } } }
    );
    await mcpClient.connect(transport);

    // Get available tools and convert to Anthropic tool format
    const { tools: mcpTools } = await mcpClient.listTools();
    const anthropicTools: Anthropic.Tool[] = mcpTools.map(t => ({
      name: t.name,
      description: t.description || t.name,
      input_schema: t.inputSchema as Anthropic.Tool['input_schema'],
    }));

    const standards = CCSS_WRITING_STANDARDS[gradeLevel] || CCSS_WRITING_STANDARDS['3'];
    const standardsText = standards.map(s => `${s.code}: ${s.description}`).join('\n');

    const prompt = `You are WriteRight, an expert K-8 literacy coach. Use the Notion tools available to you to complete this task.

**Steps:**
1. Query the Notion database with ID \`${databaseId}\` to list all pages (each page is one student's writing sample).
2. For each page, retrieve the full page content to read the student's writing. Use the page title as the student name.
3. Analyze each student's writing ONLY against these Grade ${gradeLevel} California CCSS standards:
${standardsText}
4. Create a new page in the same database (title: "WriteRight Analysis — Grade ${gradeLevel} — ${new Date().toLocaleDateString()}") with the full results formatted clearly.
5. Return the analysis as a JSON object — nothing else, no commentary:

{
  "students": [
    {
      "studentName": "string",
      "teachingPoints": ["2-3 specific actionable points tied to a named standard"],
      "strengths": ["1-2 genuine strengths"],
      "standardsAddressed": ["W.3.1", "L.3.2"]
    }
  ],
  "smallGroups": [
    {
      "groupName": "string",
      "focus": "instructional focus",
      "students": ["student names"],
      "suggestedActivity": "brief small group activity"
    }
  ],
  "notionPageUrl": "URL of the results page you created"
}`;

    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];
    let finalText = '';

    // Agentic tool-use loop
    while (true) {
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
              content: `Error calling ${block.name}: ${err.message}`,
              is_error: true,
            });
          }
        }
        messages.push({ role: 'user', content: toolResults });
      } else {
        // Unexpected stop reason — bail
        break;
      }
    }

    await mcpClient.close();

    const jsonMatch = finalText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Claude did not return a JSON result');
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      gradeLevel,
      analyzedAt: new Date().toLocaleString(),
      students: parsed.students,
      smallGroups: parsed.smallGroups,
      notionPageUrl: parsed.notionPageUrl,
    };
  } finally {
    mcpProcess.kill();
  }
}
