import fs from 'fs';
import path from 'path';

import { readContentDocuments } from '../lib/content/repository';
import type { ContentType } from '../lib/content/types';

interface ContentItem {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

interface ChatContext {
  projects: ContentItem[];
  books: ContentItem[];
  generatedAt: string;
}

const outputPath = path.join(process.cwd(), 'me', 'chat-context.json');

function stripCodeBlocks(text: string): string {
  return text.replace(/```[\s\S]*?```/g, '[code snippet]');
}

function stripImageReferences(text: string): string {
  return text.replace(/!\[.*?\]\(.*?\)/g, '');
}

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, '');
}

function condenseContent(content: string): string {
  let condensed = content.replace(/\r\n?/g, '\n');
  condensed = stripCodeBlocks(condensed);
  condensed = stripImageReferences(condensed);
  condensed = stripHtmlTags(condensed);
  condensed = condensed.replace(/\n{3,}/g, '\n\n');
  condensed = condensed.replace(/[ \t]+/g, ' ');
  return condensed.trim();
}

function readMarkdownFiles(contentType: ContentType): ContentItem[] {
  return readContentDocuments(contentType)
    .map(({ metadata, markdown }) => ({
      title: metadata.title,
      slug: metadata.slug,
      date: metadata.date,
      description: metadata.description,
      tags: metadata.tags,
      content: condenseContent(markdown),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function generateContext(): ChatContext {
  const projects = readMarkdownFiles('project');
  const books = readMarkdownFiles('book');

  return {
    projects,
    books,
    generatedAt: new Date().toISOString(),
  };
}

function main() {
  console.log('Generating chat context...');

  const context = generateContext();

  const meDir = path.dirname(outputPath);
  if (!fs.existsSync(meDir)) {
    fs.mkdirSync(meDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(context, null, 2));

  const stats = {
    projects: context.projects.length,
    books: context.books.length,
    totalSize: Buffer.byteLength(JSON.stringify(context), 'utf8'),
  };

  console.log(`Generated chat context:`);
  console.log(`  - ${stats.projects} projects`);
  console.log(`  - ${stats.books} books`);
  console.log(`  - Total size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Output: ${outputPath}`);
}

main();
