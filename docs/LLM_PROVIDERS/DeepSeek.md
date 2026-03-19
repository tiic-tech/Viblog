# DeepSeek Provider Documentation

## Overview

**Provider ID:** `deepseek`
**Provider Name:** DeepSeek
**Base URL:** `https://api.deepseek.com/v1`
**API Reference:** https://platform.deepseek.com/api-docs/

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: No
- Audio: No
- Function Calling: No
- Reasoning: Yes (R1 model)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer sk-...
```

## Endpoints

### Chat Completions (OpenAI-compatible)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/completions` | Create chat completion |
| GET | `/models` | List available models |

## Request Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Model ID (e.g., `deepseek-chat`, `deepseek-reasoner`) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | 1.0 | 0.0 - 2.0 | Sampling temperature. Higher values make output more random. |
| `max_tokens` | integer | model-dependent | 1 - model max | Maximum tokens to generate in the completion. |
| `top_p` | number | 1.0 | 0.0 - 1.0 | Nucleus sampling. Model considers results with top_p probability mass. |
| `stream` | boolean | false | - | Enable streaming responses. |
| `stop` | string/array | null | - | Up to 4 sequences where API stops generating. |
| `response_format` | object | null | - | Format specification (`{type: "json_object"}`). |

### Message Format

```typescript
interface Message {
  role: "system" | "user" | "assistant"
  content: string
}
```

## Response Format

### ChatCompletion Object

```typescript
interface ChatCompletion {
  id: string                    // Unique identifier
  object: string                // Object type
  created: number               // Unix timestamp
  model: string                 // Model used
  choices: Array<{
    index: number
    message: {
      role: "assistant"
      content: string | null
      reasoning_content?: string  // Present for R1 model
    }
    finish_reason: "stop" | "length" | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_cache_hit_tokens?: number   // Cached tokens
    prompt_cache_miss_tokens?: number  // Non-cached tokens
  }
}
```

### Streaming Chunk Format

```typescript
interface ChatCompletionChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
```

## Flagship Models

### DeepSeek Chat

| Property | Value |
|----------|-------|
| Model ID | `deepseek-chat` |
| Context Window | 64,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $0.14 / 1M tokens |
| Output Price | $0.28 / 1M tokens |
| Reasoning | No |

### DeepSeek Reasoner (R1)

| Property | Value |
|----------|-------|
| Model ID | `deepseek-reasoner` |
| Context Window | 64,000 tokens |
| Max Output | 8,192 tokens |
| Input Price | $0.55 / 1M tokens |
| Output Price | $2.19 / 1M tokens |
| Reasoning | Yes (Chain-of-Thought) |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Streaming Example

```typescript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: true,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (line.trim() === 'data: [DONE]') continue;
    if (!line.trim().startsWith('data: ')) continue;

    const chunk = JSON.parse(line.slice(6));
    const content = chunk.choices[0]?.delta?.content;
    if (content) process.stdout.write(content);
  }
}
```

### Reasoning Model (R1) Example

```typescript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek-reasoner',
    messages: [
      { role: 'user', content: 'Solve this step by step: What is 15% of 240?' }
    ],
  }),
});

const data = await response.json();
console.log('Reasoning:', data.choices[0].message.reasoning_content);
console.log('Answer:', data.choices[0].message.content);
```

### Structured Output (JSON Mode)

```typescript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'user', content: 'Generate a JSON object with name and age.' }
    ],
    response_format: { type: 'json_object' },
  }),
});

const data = await response.json();
const parsed = JSON.parse(data.choices[0].message.content);
```

## Error Handling

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | invalid_request_error | Invalid request parameters |
| 401 | authentication_error | Invalid API key |
| 403 | permission_error | Insufficient permissions |
| 404 | not_found_error | Resource not found |
| 429 | rate_limit_error | Rate limit exceeded |
| 500 | api_error | Server error |
| 503 | overloaded_error | Server overloaded |

### Error Response Format

```json
{
  "error": {
    "message": "string",
    "type": "invalid_request_error",
    "param": "string | null",
    "code": "string | null"
  }
}
```

## Rate Limits

Rate limits vary by tier and model. Check your limits at:
https://platform.deepseek.com/account/limits

## Prompt Caching

DeepSeek supports prompt caching for reduced costs on repeated prompts. Cached tokens are tracked in the response:

```typescript
usage: {
  prompt_tokens: 1000,
  completion_tokens: 500,
  total_tokens: 1500,
  prompt_cache_hit_tokens: 800,    // 80% of prompt was cached
  prompt_cache_miss_tokens: 200    // 20% was new
}
```

## Best Practices

1. **Use prompt caching**: Reduces input costs significantly for repeated prompts
2. **Choose the right model**: Use `deepseek-chat` for general tasks, `deepseek-reasoner` for complex reasoning
3. **Set reasonable max_tokens**: Prevent runaway generation
4. **Handle streaming properly**: Process chunks incrementally
5. **Implement retry logic**: Use exponential backoff for rate limits

## Key Differences from OpenAI

1. **Lower pricing**: Significantly cheaper than OpenAI models
2. **Reasoning model**: R1 model provides `reasoning_content` field
3. **No vision support**: Cannot process images
4. **Smaller context window**: 64K vs OpenAI's 1M tokens
5. **OpenAI-compatible API**: Easy migration from OpenAI

## References

- API Reference: https://platform.deepseek.com/api-docs/
- Pricing: https://platform.deepseek.com/pricing
- Models: https://platform.deepseek.com/models