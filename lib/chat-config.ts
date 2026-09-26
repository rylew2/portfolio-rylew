// Keep the model and its supported request settings together when migrating.
export const CHAT_MODEL_CONFIG = {
  model: 'openai/gpt-oss-120b',
  // Allow room for reasoning as well as the concise visitor answer.
  max_completion_tokens: 2048,
  reasoning_effort: 'low',
  include_reasoning: false,
} as const;
