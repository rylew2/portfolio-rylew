export const MAX_MESSAGE_LENGTH = 1_000;
export const MAX_HISTORY_ENTRIES = 12;
export const MAX_HISTORY_CONTENT_LENGTH = 1_000;
export const MAX_AGGREGATE_HISTORY_LENGTH = 6_000;
export const RATE_LIMIT_ATTEMPTS = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_BUCKETS = 10_000;
export const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000;

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

export type RateLimiterOptions = {
  now?: () => number;
  maxBuckets?: number;
  cleanupIntervalMs?: number;
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

export function createRateLimiter(
  optionsOrNow: RateLimiterOptions | (() => number) = {}
): RateLimiter {
  const options =
    typeof optionsOrNow === 'function' ? { now: optionsOrNow } : optionsOrNow;
  const now = options.now ?? Date.now;
  const maxBuckets = Math.max(1, options.maxBuckets ?? RATE_LIMIT_MAX_BUCKETS);
  const cleanupIntervalMs = Math.max(
    1,
    options.cleanupIntervalMs ?? RATE_LIMIT_CLEANUP_INTERVAL_MS
  );
  const attemptsByClient = new Map<string, number[]>();
  let nextCleanupAt = now() + cleanupIntervalMs;

  function pruneCurrentBucket(attempts: number[], currentTime: number): void {
    const cutoff = currentTime - RATE_LIMIT_WINDOW_MS;
    let firstActiveAttempt = 0;

    while (
      firstActiveAttempt < attempts.length &&
      attempts[firstActiveAttempt] <= cutoff
    ) {
      firstActiveAttempt += 1;
    }

    if (firstActiveAttempt > 0) {
      attempts.splice(0, firstActiveAttempt);
    }
  }

  function cleanupExpiredBuckets(currentTime: number): void {
    if (currentTime < nextCleanupAt) {
      return;
    }

    const cutoff = currentTime - RATE_LIMIT_WINDOW_MS;
    for (const [clientIdentifier, attempts] of attemptsByClient) {
      if (attempts[attempts.length - 1] <= cutoff) {
        attemptsByClient.delete(clientIdentifier);
      }
    }

    nextCleanupAt = currentTime + cleanupIntervalMs;
  }

  function makeRoomForBucket(): void {
    if (attemptsByClient.size < maxBuckets) {
      return;
    }

    // Map insertion order gives constant-time FIFO eviction without a scan.
    const oldestBucket = attemptsByClient.keys().next();
    if (!oldestBucket.done) {
      attemptsByClient.delete(oldestBucket.value);
    }
  }

  return {
    check(clientIdentifier: string): RateLimitResult {
      const currentTime = now();
      cleanupExpiredBuckets(currentTime);

      let attempts = attemptsByClient.get(clientIdentifier);
      if (attempts) {
        pruneCurrentBucket(attempts, currentTime);
        if (attempts.length === 0) {
          attemptsByClient.delete(clientIdentifier);
          attempts = undefined;
        }
      }

      if (!attempts) {
        makeRoomForBucket();
        attempts = [];
        attemptsByClient.set(clientIdentifier, attempts);
      }

      if (attempts.length >= RATE_LIMIT_ATTEMPTS) {
        const retryAfterMs = attempts[0] + RATE_LIMIT_WINDOW_MS - currentTime;
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1_000)),
        };
      }

      attempts.push(currentTime);
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
