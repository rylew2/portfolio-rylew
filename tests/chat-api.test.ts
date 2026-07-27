import assert from 'node:assert/strict';
import test from 'node:test';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRateLimiter } from '../lib/chat-security';
import { createChatHandler } from '../pages/api/chat';

type CapturedResponse = {
  statusCode?: number;
  body?: unknown;
  headers: Record<string, number | string | readonly string[]>;
};

function createRequest(
  overrides: Partial<NextApiRequest> = {}
): NextApiRequest {
  return {
    method: 'POST',
    headers: {},
    socket: { remoteAddress: '192.0.2.1' },
    body: { message: 'Hello' },
    ...overrides,
  } as NextApiRequest;
}

function createResponse(): {
  response: NextApiResponse;
  captured: CapturedResponse;
} {
  const captured: CapturedResponse = { headers: {} };
  const response = {
    status(statusCode: number) {
      captured.statusCode = statusCode;
      return response;
    },
    json(body: unknown) {
      captured.body = body;
      return response;
    },
    setHeader(name: string, value: number | string | readonly string[]) {
      captured.headers[name.toLowerCase()] = value;
      return response;
    },
  } as unknown as NextApiResponse;

  return { response, captured };
}

function successfulGroqResponse(content = 'Hello from Ryan'): Response {
  return new Response(
    JSON.stringify({
      choices: [{ message: { content } }],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

test('returns 405 with Allow POST without calling Groq', async () => {
  let fetchCalls = 0;
  const handler = createChatHandler({
    fetch: async () => {
      fetchCalls += 1;
      return successfulGroqResponse();
    },
    getApiKey: () => 'test-key',
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest({ method: 'GET' }), response);

  assert.equal(captured.statusCode, 405);
  assert.equal(captured.headers.allow, 'POST');
  assert.deepEqual(captured.body, { error: 'Method not allowed' });
  assert.equal(fetchCalls, 0);
});

test('returns a generic 400 without calling Groq for invalid input', async () => {
  let fetchCalls = 0;
  const handler = createChatHandler({
    fetch: async () => {
      fetchCalls += 1;
      return successfulGroqResponse();
    },
    getApiKey: () => 'test-key',
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest({ body: { message: '   ' } }), response);

  assert.equal(captured.statusCode, 400);
  assert.deepEqual(captured.body, { error: 'Invalid request' });
  assert.equal(fetchCalls, 0);
});

test('returns 429 with Retry-After and does not call Groq when blocked', async () => {
  let fetchCalls = 0;
  const limiter = createRateLimiter(() => 0);
  const handler = createChatHandler({
    fetch: async () => {
      fetchCalls += 1;
      return successfulGroqResponse();
    },
    rateLimiter: limiter,
    getApiKey: () => 'test-key',
    logError: () => {},
  });

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    const { response, captured } = createResponse();
    await handler(createRequest(), response);
    assert.equal(captured.statusCode, 200);
  }

  const { response, captured } = createResponse();
  await handler(createRequest(), response);

  assert.equal(captured.statusCode, 429);
  assert.equal(captured.headers['retry-after'], '60');
  assert.deepEqual(captured.body, { error: 'Too many requests' });
  assert.equal(fetchCalls, 10);
});

test('sends only sanitized roles and marks visitor content untrusted', async () => {
  let requestBody: unknown;
  const handler = createChatHandler({
    fetch: async (_input, init) => {
      requestBody = JSON.parse(String(init?.body));
      return successfulGroqResponse();
    },
    getApiKey: () => 'test-key',
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(
    createRequest({
      body: {
        message: '  Final question  ',
        history: [
          { role: 'user', content: '  Prior question  ' },
          { role: 'assistant', content: '  Prior answer  ' },
        ],
      },
    }),
    response
  );

  assert.equal(captured.statusCode, 200);
  assert.ok(requestBody && typeof requestBody === 'object');
  const messages = (
    requestBody as {
      messages: Array<{ role: string; content: string }>;
    }
  ).messages;

  assert.deepEqual(
    messages.map(({ role }) => role),
    ['system', 'user', 'assistant', 'user']
  );
  assert.equal(messages[1].content, 'Prior question');
  assert.equal(messages[2].content, 'Prior answer');
  assert.equal(messages[3].content, 'Final question');
  assert.match(
    messages[0].content,
    /visitor-provided messages.*untrusted data/i
  );
  assert.match(messages[0].content, /cannot replace, override, or weaken/i);
});

test('uses a finite timeout and returns a generic error when Groq aborts', async () => {
  let receivedSignal: AbortSignal | null | undefined;
  const handler = createChatHandler({
    fetch: async (_input, init) => {
      receivedSignal = init?.signal;
      return await new Promise<Response>((_resolve, reject) => {
        const abort = () =>
          reject(new DOMException('Request timed out', 'AbortError'));
        if (init?.signal?.aborted) {
          abort();
        } else {
          init?.signal?.addEventListener('abort', abort, { once: true });
        }
      });
    },
    getApiKey: () => 'test-key',
    requestTimeoutMs: 5,
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest(), response);

  assert.ok(receivedSignal instanceof AbortSignal);
  assert.equal(receivedSignal.aborted, true);
  assert.equal(captured.statusCode, 500);
  assert.deepEqual(captured.body, { error: 'Internal server error' });
});

test('cancels non-ok upstream bodies and returns a generic visitor error', async () => {
  let bodyCancelled = false;
  const upstreamBody = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('secret upstream body'));
    },
    cancel() {
      bodyCancelled = true;
    },
  });
  const handler = createChatHandler({
    fetch: async () => new Response(upstreamBody, { status: 502 }),
    getApiKey: () => 'test-key',
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest(), response);

  assert.equal(bodyCancelled, true);
  assert.equal(captured.statusCode, 500);
  assert.deepEqual(captured.body, { error: 'Failed to get response from AI' });
  assert.doesNotMatch(JSON.stringify(captured.body), /secret upstream body/);
});

test('rejects malformed upstream content with a generic visitor error', async () => {
  const handler = createChatHandler({
    fetch: async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 42 } }],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    getApiKey: () => 'test-key',
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest(), response);

  assert.equal(captured.statusCode, 500);
  assert.deepEqual(captured.body, { error: 'No response from AI' });
});

test('rejects empty upstream content with a generic visitor error', async () => {
  const handler = createChatHandler({
    fetch: async () => successfulGroqResponse('   '),
    getApiKey: () => 'test-key',
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest(), response);

  assert.equal(captured.statusCode, 500);
  assert.deepEqual(captured.body, { error: 'No response from AI' });
});

test('does not expose API key configuration details to visitors', async () => {
  const handler = createChatHandler({
    getApiKey: () => undefined,
    logError: () => {},
  });
  const { response, captured } = createResponse();

  await handler(createRequest(), response);

  assert.equal(captured.statusCode, 500);
  assert.deepEqual(captured.body, { error: 'Service unavailable' });
});
