import Anthropic from '@anthropic-ai/sdk';
import { CCSS_WRITING_STANDARDS } from './standards';
import { AnalysisResult } from '../types';

const client = new Anthropic();

export async function analyzeWriting(
  students: { name: string; content: string }[],
  gradeLevel: string
): Promise<AnalysisResult> {
  const standards = CCSS_WRITING_STANDARDS[gradeLevel] || CCSS_WRITING_STANDARDS['3'];

  const standardsText = standards
    .map(s => `${s.code}: ${s.description}`)
    .join('\n');

  const studentsText = students
    .map(s => `=== ${s.name} ===\n${s.content}`)
    .join('\n\n');

  const prompt = `You are an expert K-8 literacy coach analyzing student writing samples.

Grade Level: ${gradeLevel}

California Common Core Writing and Language Standards for Grade ${gradeLevel}:
${standardsText}

Student Writing Samples:
${studentsText}

Analyze each student's writing ONLY against the grade-level standards above. Do not apply standards from other grade levels.

Return a JSON object with this exact structure:
{
  "students": [
    {
      "studentName": "string",
      "teachingPoints": ["2-3 specific, actionable teaching points tied to the standards above"],
      "strengths": ["1-2 genuine strengths observed in their writing"],
      "standardsAddressed": ["e.g. W.3.1", "L.3.2"]
    }
  ],
  "smallGroups": [
    {
      "groupName": "string (e.g. 'Opinion Writing Structure')",
      "focus": "specific instructional focus",
      "students": ["names of students who share this need"],
      "suggestedActivity": "brief description of a responsive small group activity"
    }
  ]
}

Group students by shared instructional needs for small group instruction. Only return valid JSON, no other text.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    gradeLevel,
    analyzedAt: new Date().toLocaleString(),
    students: parsed.students,
    smallGroups: parsed.smallGroups
  };
}
