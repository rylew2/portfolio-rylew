import { setTimeout as delay } from 'node:timers/promises';

const url = process.env.CHAT_SMOKE_URL || 'https://www.rylew.dev/api/chat';

async function checkChat() {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Briefly describe your software engineering background.',
      history: [],
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (response.status !== 200) {
    throw new Error(`Expected HTTP 200, received HTTP ${response.status}`);
  }
  const body = await response.json();
  if (typeof body?.response !== 'string' || !body.response.trim()) {
    throw new Error('Expected a nonempty answer in the response JSON');
  }
  console.log('Chat smoke check passed (HTTP 200 with a nonempty answer).');
}

for (let attempt = 1; attempt <= 2; attempt += 1) {
  try {
    await checkChat();
    break;
  } catch (error) {
    console.error(
      `Chat smoke check attempt ${attempt} failed: ${error.message}`
    );
    if (attempt === 2) {
      process.exitCode = 1;
    } else {
      console.log('Retrying in 10 seconds...');
      await delay(10_000);
    }
  }
}
