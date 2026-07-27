export const MAX_MESSAGE_LENGTH = 1_000;
export const MAX_HISTORY_ENTRIES = 12;
export const MAX_HISTORY_CONTENT_LENGTH = 1_000;
export const MAX_AGGREGATE_HISTORY_LENGTH = 6_000;
export const RATE_LIMIT_ATTEMPTS = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export type ChatHistoryEntry = {
  role: 'user' | 'assistant';
  content: string;
};

export type ValidatedChatRequest = {
  message: string;
  history: ChatHistoryEntry[];
};

export type ChatValidationResult =
  | { ok: true; value: ValidatedChatRequest }
  | { ok: false; reason: 'invalid-request' };

export type RateLimitResult =
  { allowed: true } | { allowed: false; retryAfterSeconds: number };

export type RateLimiter = {
  check(clientIdentifier: string): RateLimitResult;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function invalidRequest(): ChatValidationResult {
  return { ok: false, reason: 'invalid-request' };
}

export function validateChatRequest(input: unknown): ChatValidationResult {
  if (!isRecord(input) || typeof input.message !== 'string') {
    return invalidRequest();
  }

  const message = input.message.trim();
  if (message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return invalidRequest();
  }

  const rawHistory = input.history === undefined ? [] : input.history;
  if (!Array.isArray(rawHistory) || rawHistory.length > MAX_HISTORY_ENTRIES) {
    return invalidRequest();
  }

  const history: ChatHistoryEntry[] = [];
  let aggregateLength = 0;

  for (const rawEntry of rawHistory) {
    if (
      !isRecord(rawEntry) ||
      (rawEntry.role !== 'user' && rawEntry.role !== 'assistant') ||
      typeof rawEntry.content !== 'string'
    ) {
      return invalidRequest();
    }

    const content = rawEntry.content.trim();
    if (content.length === 0 || content.length > MAX_HISTORY_CONTENT_LENGTH) {
      return invalidRequest();
    }

    aggregateLength += content.length;
    if (aggregateLength > MAX_AGGREGATE_HISTORY_LENGTH) {
      return invalidRequest();
    }

    history.push({ role: rawEntry.role, content });
  }

  return { ok: true, value: { message, history } };
}

export function createRateLimiter(now: () => number = Date.now): RateLimiter {
  const attemptsByClient = new Map<string, number[]>();

  function pruneExpired(currentTime: number): void {
    const cutoff = currentTime - RATE_LIMIT_WINDOW_MS;

    for (const [clientIdentifier, attempts] of attemptsByClient) {
      const activeAttempts = attempts.filter(
        (attemptTime) => attemptTime > cutoff
      );

      if (activeAttempts.length === 0) {
        attemptsByClient.delete(clientIdentifier);
      } else if (activeAttempts.length !== attempts.length) {
        attemptsByClient.set(clientIdentifier, activeAttempts);
      }
    }
  }

  return {
    check(clientIdentifier: string): RateLimitResult {
      const currentTime = now();
      pruneExpired(currentTime);

      const attempts = attemptsByClient.get(clientIdentifier) ?? [];
      if (attempts.length >= RATE_LIMIT_ATTEMPTS) {
        const retryAfterMs = attempts[0] + RATE_LIMIT_WINDOW_MS - currentTime;
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1_000)),
        };
      }

      attempts.push(currentTime);
      attemptsByClient.set(clientIdentifier, attempts);
      return { allowed: true };
    },
  };
}

export function getClientIdentifier(
  forwardedFor: string | string[] | undefined,
  socketAddress: string | undefined
): string {
  const forwardedValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor;
  const firstForwardedAddress = forwardedValue?.split(',')[0]?.trim();

  if (firstForwardedAddress) {
    return firstForwardedAddress;
  }

  return socketAddress?.trim() || 'unknown-client';
}
