import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

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

// Load context from summary file
function loadSummary(): string {
  try {
    const summaryPath = path.join(process.cwd(), 'me', 'summary.txt');
    return fs.readFileSync(summaryPath, 'utf-8');
  } catch {
    return '';
  }
}

// Load site content context
function loadChatContext(): ChatContext {
  try {
    const contextPath = path.join(process.cwd(), 'me', 'chat-context.json');
    const raw = fs.readFileSync(contextPath, 'utf-8');
    const parsed = JSON.parse(raw) as ChatContext;

    return {
      projects: parsed.projects || [],
      books: parsed.books || [],
      generatedAt: parsed.generatedAt || '',
    };
  } catch {
    return { projects: [], books: [], generatedAt: '' };
  }
}

function formatContentItem(item: ContentItem): string {
  const maxDetailsLength = 1400;
  const tags = item.tags?.length ? item.tags.join(', ') : 'None';
  const date = item.date || 'Unknown';
  const description = item.description || 'No description provided.';
  const detailsRaw = item.content || '';
  const details =
    detailsRaw.length > maxDetailsLength
      ? `${detailsRaw.slice(0, maxDetailsLength)}…`
      : detailsRaw;

  return `- Title: ${item.title}
- Date: ${date}
- Tags: ${tags}
- Description: ${description}
- Details: ${details}`;
}

function formatContentSummary(item: ContentItem): string {
  const tags = item.tags?.length ? item.tags.join(', ') : 'None';
  const date = item.date || 'Unknown';
  const description = item.description || 'No description provided.';

  return `- Title: ${item.title}
- Date: ${date}
- Tags: ${tags}
- Description: ${description}`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2);
}

function scoreItem(queryTokens: Set<string>, item: ContentItem): number {
  let score = 0;
  const title = item.title?.toLowerCase() || '';
  const description = item.description?.toLowerCase() || '';
  const tags = (item.tags || []).map((tag) => tag.toLowerCase());
  const content = item.content?.toLowerCase() || '';

  for (const token of queryTokens) {
    if (title.includes(token)) score += 5;
    if (tags.some((tag) => tag.includes(token))) score += 3;
    if (description.includes(token)) score += 2;
    if (content.includes(token)) score += 1;
  }

  return score;
}

function selectTopMatches(
  query: string,
  items: ContentItem[],
  limit: number
): ContentItem[] {
  const tokens = new Set(tokenize(query));
  if (tokens.size === 0) {
    return [];
  }

  const scored = items
    .map((item) => ({
      item,
      score: scoreItem(tokens, item),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.item);
}

function includesAnyPhrase(message: string, phrases: string[]): boolean {
  const normalized = message.toLowerCase();
  return phrases.some((phrase) => normalized.includes(phrase));
}

function matchesSpecificItems(message: string, items: ContentItem[]): ContentItem[] {
  const normalized = message.toLowerCase();

  return items.filter((item) => {
    const title = item.title?.toLowerCase() || '';
    const slug = item.slug?.toLowerCase() || '';
    return (
      (title && normalized.includes(title)) ||
      (slug && normalized.includes(slug))
    );
  });
}

// Build system prompt
function buildSystemPrompt(message: string): string {
  const summary = loadSummary();
  const context = loadChatContext();
  const projectSummaries = context.projects
    .map(formatContentSummary)
    .join('\n\n');
  const bookSummaries = context.books.map(formatContentSummary).join('\n\n');
  const wantsAllProjects = includesAnyPhrase(message, [
    'all projects',
    'list projects',
    'what projects',
    'projects have you worked on',
    'projects you have worked on',
    'portfolio projects',
    'projects you worked on',
  ]);
  const wantsAllBooks = includesAnyPhrase(message, [
    'all books',
    'list books',
    'what books',
    'books have you read',
    'books you have read',
    'book reviews',
  ]);
  const specificProjectMatches = matchesSpecificItems(
    message,
    context.projects
  );
  const specificBookMatches = matchesSpecificItems(message, context.books);
  const projectMatches = wantsAllProjects
    ? context.projects
    : specificProjectMatches.length > 0
      ? specificProjectMatches
      : selectTopMatches(message, context.projects, 3);
  const bookMatches = wantsAllBooks
    ? context.books
    : specificBookMatches.length > 0
      ? specificBookMatches
      : selectTopMatches(message, context.books, 3);
  const projectDetails = projectMatches.map(formatContentItem).join('\n\n');
  const bookDetails = bookMatches.map(formatContentItem).join('\n\n');

  return `You are acting as Ryan Lewis. You are answering questions on Ryan's portfolio website, particularly questions related to Ryan's career, background, skills and experience.

Your responsibility is to represent Ryan for interactions on the website as faithfully as possible. Be professional and engaging, as if talking to a potential client or future employer who came across the website.

Keep your responses concise but helpful - aim for 2-4 sentences unless more detail is specifically requested.

If you don't know the answer to something, be honest and say so. You can suggest they reach out to Ryan directly via email or LinkedIn for more specific questions.

When listing projects or books, format them as a numbered list with each item on its own line. If you provide details, use short sub-bullets under each numbered item.

## About Ryan:
${summary}

## Projects:
${projectSummaries || 'No project content available.'}

## Book Reviews:
${bookSummaries || 'No book content available.'}

## Project Details (Most Relevant):
${projectDetails || 'No relevant project details found.'}

## Book Details (Most Relevant):
${bookDetails || 'No relevant book details found.'}

With this context, please chat with the visitor, always staying in character as Ryan. Be friendly and approachable while remaining professional.`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { message, history = [] }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build messages array with system prompt
    const systemPrompt = buildSystemPrompt(message);
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    // Call Groq API (OpenAI-compatible)
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return res.status(500).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
