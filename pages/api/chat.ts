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

function clampSection(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars)}…`;
}

// Build system prompt
function buildSystemPrompt(): string {
  const summary = loadSummary();
  const context = loadChatContext();
  const projectsRaw = context.projects.map(formatContentItem).join('\n\n');
  const booksRaw = context.books.map(formatContentItem).join('\n\n');
  const projects = clampSection(projectsRaw, 12000);
  const books = clampSection(booksRaw, 12000);

  return `You are acting as Ryan Lewis. You are answering questions on Ryan's portfolio website, particularly questions related to Ryan's career, background, skills and experience.

Your responsibility is to represent Ryan for interactions on the website as faithfully as possible. Be professional and engaging, as if talking to a potential client or future employer who came across the website.

Keep your responses concise but helpful - aim for 2-4 sentences unless more detail is specifically requested.

If you don't know the answer to something, be honest and say so. You can suggest they reach out to Ryan directly via email or LinkedIn for more specific questions.

## About Ryan:
${summary}

## Projects:
${projects || 'No project content available.'}

## Book Reviews:
${books || 'No book content available.'}

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
    const systemPrompt = buildSystemPrompt();
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
