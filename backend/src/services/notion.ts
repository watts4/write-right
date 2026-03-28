import { Client } from '@notionhq/client';
import { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export async function getStudentPages(apiKey: string, databaseId: string): Promise<{ name: string; content: string }[]> {
  const notion = new Client({ auth: apiKey });

  const response = await notion.databases.query({ database_id: databaseId });

  const students = [];
  for (const page of response.results) {
    const pageObj = page as PageObjectResponse;
    // Get title from Name property
    const titleProp = pageObj.properties['Name'] || pageObj.properties['title'] || Object.values(pageObj.properties).find((p: any) => p.type === 'title');
    let name = 'Unknown Student';
    if (titleProp && titleProp.type === 'title' && titleProp.title.length > 0) {
      name = titleProp.title[0].plain_text;
    }

    // Get page content
    const blocks = await notion.blocks.children.list({ block_id: page.id });
    const content = blocks.results
      .filter((b): b is BlockObjectResponse => 'type' in b)
      .map((block: any) => {
        if (block.paragraph?.rich_text) return block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
        if (block.heading_1?.rich_text) return block.heading_1.rich_text.map((t: any) => t.plain_text).join('');
        if (block.heading_2?.rich_text) return block.heading_2.rich_text.map((t: any) => t.plain_text).join('');
        if (block.bulleted_list_item?.rich_text) return block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('');
        return '';
      })
      .filter(Boolean)
      .join('\n');

    if (content.trim()) {
      students.push({ name, content });
    }
  }

  return students;
}

export async function saveResultsToNotion(
  apiKey: string,
  databaseId: string,
  result: import('../types').AnalysisResult
): Promise<string> {
  const notion = new Client({ auth: apiKey });

  // Build page content blocks
  const children: any[] = [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: { rich_text: [{ type: 'text', text: { content: `WriteSight Analysis — Grade ${result.gradeLevel}` } }] }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Analyzed: ${result.analyzedAt}` } }] }
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: [{ type: 'text', text: { content: 'Individual Student Analysis' } }] }
    }
  ];

  for (const student of result.students) {
    children.push({
      object: 'block',
      type: 'heading_3',
      heading_3: { rich_text: [{ type: 'text', text: { content: student.studentName } }] }
    });
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Standards: ${student.standardsAddressed.join(', ')}` } }] }
    });
    for (const point of student.teachingPoints) {
      children.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: [{ type: 'text', text: { content: point } }] }
      });
    }
  }

  children.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: 'Small Group Recommendations' } }] }
  });

  for (const group of result.smallGroups) {
    children.push({
      object: 'block',
      type: 'heading_3',
      heading_3: { rich_text: [{ type: 'text', text: { content: group.groupName } }] }
    });
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Focus: ${group.focus}` } }] }
    });
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Students: ${group.students.join(', ')}` } }] }
    });
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Suggested activity: ${group.suggestedActivity}` } }] }
    });
  }

  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: `WriteSight Analysis — ${result.analyzedAt}` } }] }
    },
    children
  });

  return `https://notion.so/${page.id.replace(/-/g, '')}`;
}
