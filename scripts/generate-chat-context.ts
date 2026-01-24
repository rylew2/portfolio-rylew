import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

const contentDir = path.join(process.cwd(), 'content');
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
  let condensed = content;
  condensed = stripCodeBlocks(condensed);
  condensed = stripImageReferences(condensed);
  condensed = stripHtmlTags(condensed);
  condensed = condensed.replace(/\n{3,}/g, '\n\n');
  condensed = condensed.replace(/[ \t]+/g, ' ');
  return condensed.trim();
}

function readMarkdownFiles(directory: string): ContentItem[] {
  if (!fs.existsSync(directory)) {
    console.warn(`Directory does not exist: ${directory}`);
    return [];
  }

  const files = fs.readdirSync(directory).filter((f) => f.endsWith('.md'));
  const items: ContentItem[] = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    items.push({
      title: data.title || file.replace('.md', ''),
      slug: data.slug || file.replace('.md', ''),
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      content: condenseContent(content),
    });
  }

  return items.sort((a, b) => (b.date > a.date ? 1 : -1));
}

function generateContext(): ChatContext {
  const projectDir = path.join(contentDir, 'project');
  const bookDir = path.join(contentDir, 'book');

  const projects = readMarkdownFiles(projectDir);
  const books = readMarkdownFiles(bookDir);

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
