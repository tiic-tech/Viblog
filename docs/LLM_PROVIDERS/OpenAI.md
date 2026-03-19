# OpenAI Provider Documentation

## Overview

**Provider ID:** `openai`
**Provider Name:** OpenAI
**Base URL:** `https://api.openai.com/v1`
**API Reference:** https://platform.openai.com/docs/api-reference/chat

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: Yes
- Audio: Yes (input and output)
- Function Calling: Yes
- Reasoning: No

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer sk-...
```

## Endpoints

### Chat Completions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/completions` | Create chat completion |
| GET | `/chat/completions` | List chat completions |
| GET | `/chat/completions/{id}` | Get chat completion |
| POST | `/chat/completions/{id}` | Update chat completion |
| DELETE | `/chat/completions/{id}` | Delete chat completion |

## Request Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Model ID (e.g., `gpt-5.4`, `gpt-5-mini`) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | 1.0 | 0.0 - 2.0 | Sampling temperature. Higher values make output more random, lower values more deterministic. |
| `max_tokens` | integer | model-dependent | 1 - model max | Maximum tokens to generate in the completion. |
| `top_p` | number | 1.0 | 0.0 - 1.0 | Nucleus sampling. Model considers results with top_p probability mass. |
| `n` | integer | 1 | 1 - 128 | Number of completions to generate. |
| `stream` | boolean | false | - | Enable streaming responses. |
| `stream_options` | object | null | - | Streaming options (`{include_usage: true}`). |
| `stop` | string/array | null | - | Up to 4 sequences where API stops generating. |
| `presence_penalty` | number | 0.0 | -2.0 - 2.0 | Penalize new tokens based on presence in text so far. |
| `frequency_penalty` | number | 0.0 | -2.0 - 2.0 | Penalize new tokens based on frequency in text so far. |
| `logit_bias` | object | null | - | Modify likelihood of specified tokens appearing. |
| `user` | string | null | - | End-user identifier for abuse monitoring. |
| `tools` | array | null | - | List of tools the model may call. |
| `tool_choice` | string/object | "auto" | "none", "auto", "required", or specific tool | Controls tool usage. |
| `response_format` | object | null | - | Format specification (`{type: "json_object"}`). |
| `seed` | integer | null | - | Seed for deterministic sampling. |
| `service_tier` | string | "auto" | "auto", "default", "flex", "scale", "priority" | Processing tier. |

### Message Format

```typescript
interface Message {
  role: "system" | "developer" | "user" | "assistant" | "tool"
  content: string | ContentPart[]
  name?: string // Optional participant name
  tool_call_id?: string // For tool messages
  tool_calls?: ToolCall[] // For assistant messages with tool calls
}

interface ContentPart {
  type: "text" | "image_url" | "input_audio" | "file"
  text?: string
  image_url?: { url: string; detail?: "auto" | "low" | "high" }
  input_audio?: { data: string; format: "wav" | "mp3" }
}
```

## Response Format

### ChatCompletion Object

```typescript
interface ChatCompletion {
  id: string                    // Unique identifier
  object: "chat.completion"     // Object type
  created: number               // Unix timestamp
  model: string                 // Model used
  choices: Array<{
    index: number
    message: {
      role: "assistant"
      content: string | null
      refusal: string | null
      tool_calls?: ToolCall[]
    }
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | "function_call"
    logprobs: object | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_tokens_details?: {
      cached_tokens: number
      audio_tokens: number
    }
    completion_tokens_details?: {
      reasoning_tokens: number
      audio_tokens: number
    }
  }
  service_tier?: "auto" | "default" | "flex" | "scale" | "priority"
  system_fingerprint?: string   // Deprecated
}
```

### Streaming Chunk Format

```typescript
interface ChatCompletionChunk {
  id: string
  object: "chat.completion.chunk"
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
      tool_calls?: ToolCallDelta[]
    }
    finish_reason: string | null
  }>
  usage?: Usage // Only in final chunk with stream_options.include_usage
}
```

## Flagship Models

### GPT-5.4 (Flagship)

| Property | Value |
|----------|-------|
| Model ID | `gpt-5.4` |
| Context Window | 1,000,000 tokens |
| Max Output | 128,000 tokens |
| Input Price | $2.50 / 1M tokens |
| Output Price | $15.00 / 1M tokens |
| Cached Input | $0.25 / 1M tokens (90% discount) |

### GPT-5 Mini (Cost-Effective)

| Property | Value |
|----------|-------|
| Model ID | `gpt-5-mini` |
| Context Window | 400,000 tokens |
| Max Output | 128,000 tokens |
| Input Price | $0.25 / 1M tokens |
| Output Price | $2.00 / 1M tokens |
| Cached Input | $0.025 / 1M tokens (90% discount) |

## Example Request

```typescript
// Basic chat completion
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5-mini',
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
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5-mini',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: true,
    stream_options: { include_usage: true },
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

### Structured Output (JSON Mode)

```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5-mini',
    messages: [
      { role: 'user', content: 'Generate a JSON object with name and age.' }
    ],
    response_format: { type: 'json_object' },
  }),
});

const data = await response.json();
const parsed = JSON.parse(data.choices[0].message.content);
```

### Vision Example

```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5-mini',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'What is in this image?' },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.png',
            detail: 'auto', // 'low', 'high', or 'auto'
          },
        },
      ],
    }],
  }),
});
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
https://platform.openai.com/account/limits

## Best Practices

1. **Use caching**: Prompt caching reduces input costs by 90%
2. **Set reasonable max_tokens**: Prevent runaway generation
3. **Handle streaming properly**: Process chunks incrementally
4. **Implement retry logic**: Use exponential backoff for rate limits
5. **Validate responses**: Model may hallucinate in structured output

## References

- API Reference: https://platform.openai.com/docs/api-reference/chat
- Models: https://platform.openai.com/docs/models
- Pricing: https://openai.com/pricing
- Prompt Caching: https://platform.openai.com/docs/guides/prompt-caching