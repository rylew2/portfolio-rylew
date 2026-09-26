import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer, type RequestListener } from 'node:http';
import path from 'node:path';
import test from 'node:test';

async function runSmokeCheck(listener: RequestListener) {
  const server = createServer(listener);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');

  try {
    const child = spawn(
      process.execPath,
      [path.join(process.cwd(), 'scripts', 'chat-smoke.mjs')],
      {
        env: {
          ...process.env,
          CHAT_SMOKE_URL: `http://127.0.0.1:${address.port}/api/chat`,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 80_000,
      }
    );
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    const code = await new Promise<number | null>((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    });
    return { code, output };
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test('smoke check sends a visitor question and accepts an answer', async () => {
  let requestBody = '';
  let method: string | undefined;
  let requestPath: string | undefined;
  const result = await runSmokeCheck((request, response) => {
    method = request.method;
    requestPath = request.url;
    request.on('data', (chunk) => (requestBody += chunk));
    request.on('end', () => {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ response: 'I am a software engineer.' }));
    });
  });

  assert.equal(result.code, 0, result.output);
  assert.equal(method, 'POST');
  assert.equal(requestPath, '/api/chat');
  const body = JSON.parse(requestBody);
  assert.ok(typeof body.message === 'string' && body.message.trim().length > 0);
  assert.deepEqual(body.history, []);
});

test('smoke check fails when the chatbot returns a server error', async () => {
  const result = await runSmokeCheck((_request, response) => {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Failed to get response from AI' }));
  });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /HTTP 500/);
});

test('smoke check fails when an HTTP 200 response has no usable answer', async () => {
  const result = await runSmokeCheck((_request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ response: '   ' }));
  });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /nonempty answer/);
});

test('smoke check recovers from a temporary failure on its retry', async () => {
  let attempts = 0;
  const result = await runSmokeCheck((_request, response) => {
    attempts += 1;
    response.setHeader('Content-Type', 'application/json');
    if (attempts === 1) {
      response.writeHead(503);
      response.end(JSON.stringify({ error: 'Temporarily unavailable' }));
    } else {
      response.end(JSON.stringify({ response: 'I build web applications.' }));
    }
  });

  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /passed/);
});

test('smoke check fails when the chatbot returns invalid JSON', async () => {
  const result = await runSmokeCheck((_request, response) => {
    response.end('<html>Service unavailable</html>');
  });

  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /attempt 2 failed/);
});
