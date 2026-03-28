/**
 * WriteRight — Notion database seeder
 * Creates 8 mock 3rd-grade student writing pages for demo/testing.
 *
 * Usage:
 *   cp .env.example .env   (add NOTION_TOKEN and NOTION_DATABASE_ID)
 *   npx ts-node seed.ts
 */

import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
dotenv.config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DATABASE_ID in .env');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ---------------------------------------------------------------------------
// Mock student writing samples — Grade 3
// Genres: Personal Narrative, Opinion, Expository
// Skill levels deliberately varied to produce meaningful instructional groups
// ---------------------------------------------------------------------------

const students: { name: string; writing: string }[] = [
  // ── PERSONAL NARRATIVE ───────────────────────────────────────────────────

  {
    name: 'Marcus T.',
    writing: `The Best Day at the Beach

I went to the beach with my family. It was hot. We drove for a long time. I was excited. We got there and I ran to the water. The water was cold. My little sister cried because the waves scared her. I helped her. We built a sandcastle. It fell down. We built another one. My dad got us ice cream. The ice cream was good. It was chocolate. We went home when the sun went down. I was tired. It was a fun day.`,
  },

  {
    name: 'Emma R.',
    writing: `The Day I Lost My Dog

Last summer, the scariest thing happened to me. My dog Biscuit ran out the front door when the delivery man came, and I couldn't catch him. I searched our whole street calling his name over and over. My heart was pounding so hard I could feel it in my ears.

After almost an hour, my neighbor Mrs. Flores came outside. She said she had seen a small brown dog run into her backyard. Sure enough, there was Biscuit, happily digging in her garden. I scooped him up and hugged him so tight.

That day taught me to always check that the door is closed before answering it. I never want to feel that scared again but I'm glad it had a happy ending.`,
  },

  {
    name: 'Noah K.',
    writing: `My Birthday

My birthday was fun. I got a new bike. It is blue. We had cake. The end.`,
  },

  // ── OPINION ──────────────────────────────────────────────────────────────

  {
    name: 'Sofia M.',
    writing: `Why Kids Should Have Recess Every Day

I think kids should have recess every day because it is good for them. First, recess is important. Kids need to move around. Also, recess is fun and kids like it. Another reason is that it helps you focus. When you come back inside you can pay attention better. Some people think recess wastes time but I disagree. In conclusion, recess should happen every day at school.`,
  },

  {
    name: 'Diego V.',
    writing: `Schools should not give homework because it is too much and kids already do work all day at school and then they have to go home and do more work and it is not fair because we need time to play and be with our families and I think teachers should know that kids get tired and homework makes kids not like school and my mom has to help me every night and she is tired too so no homework is better for everyone.`,
  },

  {
    name: 'Priya S.',
    writing: `The School Library Should Stay Open During Lunch

I strongly believe our school library should be open during lunch because students deserve a quiet place to read and learn even during their free time.

One reason is that many students love books but don't have time to read during class. If the library were open at lunch, we could finish chapters or discover new series. For example, last week I wanted to check out a book about space but the library was closed and I had to wait three more days.

A second reason is that some students feel overwhelmed by the loud cafeteria. The library gives those students a calm place to recharge. My friend always gets headaches from the noise, and she would definitely use the library if it was open.

For these reasons, I think our principal should consider opening the library during lunch at least three days a week. It would make our school a better place for readers and kids who need a quiet break.`,
  },

  // ── EXPOSITORY ───────────────────────────────────────────────────────────

  {
    name: 'Jaylen B.',
    writing: `Dolphins

Dolphins are mammals. They live in the ocean. They breathe air. They have blowholes on top of their heads. Dolphins eat fish. They swim fast. Dolphins are smart. They can learn tricks. Some dolphins live in rivers. Dolphins talk to each other using clicks and whistles. Baby dolphins are called calves. Mother dolphins take care of their babies. Dolphins are interesting animals.`,
  },

  {
    name: 'Aaliyah W.',
    writing: `How Volcanoes Work

Volcanoes are really cool and scary at the same time. Deep underground there is melted rock called magma, it is extremely hot and it builds up pressure over time. When there is too much pressure the magma pushes up through cracks in the earth. Once it comes out it is called lava. Lava can flow really slowly or really fast it depends on how thick it is. Sometimes volcanoes explode with a lot of ash and rocks too not just lava. The ash can travel really far and block out the sun. After a volcano erupts the lava cools down and turns into new rock. That is how islands like Hawaii were made because volcanoes kept erupting under the ocean until the rock piled up above the water. Volcanoes are dangerous but they also create new land.`,
  },
];

// ---------------------------------------------------------------------------

async function createStudentPage(name: string, writing: string) {
  // Split writing into paragraphs → separate paragraph blocks
  const paragraphs = writing.split(/\n+/).filter(p => p.trim().length > 0);

  const children: any[] = paragraphs.map((para, i) => {
    if (i === 0) {
      return {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: para.trim() } }],
        },
      };
    }
    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: para.trim() } }],
      },
    };
  });

  await notion.pages.create({
    parent: { database_id: DATABASE_ID! },
    properties: {
      Name: {
        title: [{ text: { content: name } }],
      },
    },
    children,
  });

  console.log(`✅ Created: ${name}`);
}

async function seed() {
  console.log(`Seeding ${students.length} student pages into database ${DATABASE_ID}\n`);
  for (const student of students) {
    await createStudentPage(student.name, student.writing);
  }
  console.log('\nDone! Open your Notion database to verify the pages.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
