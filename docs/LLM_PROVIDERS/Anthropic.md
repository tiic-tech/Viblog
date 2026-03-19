# Anthropic Provider Documentation

## Overview

**Provider ID:** `anthropic`
**Provider Name:** Anthropic
**Base URL:** `https://api.anthropic.com/v1`
**API Reference:** https://docs.anthropic.com/en/api/messages

## Capabilities

- Streaming: Yes (Server-Sent Events)
- Structured Output: Yes (Tool Use)
- Vision: Yes
- Audio: No
- Function Calling: Yes (Tool Use)
- Extended Thinking: Yes

## Authentication

API Key authentication via `x-api-key` header:
```
x-api-key: sk-ant-...
anthropic-version: 2023-06-01
```

## Endpoints

### Messages API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/messages` | Create a message |

## Request Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Model ID (e.g., `claude-opus-4-6`, `claude-sonnet-4-6`) |
| `max_tokens` | integer | Maximum tokens to generate (required, no default) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `system` | string | null | - | System prompt for the model |
| `temperature` | number | 1.0 | 0.0 - 1.0 | Sampling temperature. Higher values increase randomness. |
| `top_p` | number | - | 0.0 - 1.0 | Nucleus sampling threshold. |
| `top_k` | integer | - | - | Only sample from top K options for each token. |
| `stop_sequences` | array | null | - | Custom sequences where API stops generating. |
| `stream` | boolean | false | - | Enable streaming responses. |
| `tools` | array | null | - | List of tools the model may use. |
| `tool_choice` | object | null | - | Controls tool usage behavior. |
| `metadata` | object | null | - | Additional metadata for the request. |

### Message Format

```typescript
interface Message {
  role: "user" | "assistant"
  content: string | ContentBlock[]
}

interface ContentBlock {
  type: "text" | "image" | "tool_use" | "tool_result"
  text?: string
  source?: {
    type: "base64"
    media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
    data: string // base64-encoded
  }
  tool_use_id?: string
  name?: string
  input?: object
}
```

### System Prompt

Anthropic uses a separate `system` parameter instead of a system role message:

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

## Response Format

### Message Object

```typescript
interface Message {
  id: string                    // Message ID (e.g., msg_xxx)
  type: "message"               // Object type
  role: "assistant"             // Always assistant
  content: ContentBlock[]       // Array of content blocks
  model: string                 // Model used
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use" | null
  stop_sequence: string | null  // The stop sequence that stopped generation
  usage: {
    input_tokens: number
    output_tokens: number
    cache_creation_input_tokens?: number
    cache_read_input_tokens?: number
  }
}
```

### Content Block Types

```typescript
interface TextBlock {
  type: "text"
  text: string
}

interface ToolUseBlock {
  type: "tool_use"
  id: string
  name: string
  input: object
}
```

### Streaming Event Types

```typescript
// Message start
{ type: "message_start", message: { id, model, role, content: [], usage } }

// Content block start
{ type: "content_block_start", index: number, content_block: { type, text?, id?, name? } }

// Content delta
{ type: "content_block_delta", index: number, delta: { type: "text_delta", text: string } }

// Content block stop
{ type: "content_block_stop", index: number }

// Message delta (contains stop_reason)
{ type: "message_delta", delta: { stop_reason: string }, usage: { output_tokens: number } }

// Message stop
{ type: "message_stop" }

// Ping (keep-alive)
{ type: "ping" }
```

## Flagship Models

### Claude Opus 4.6 (Flagship)

| Property | Value |
|----------|-------|
| Model ID | `claude-opus-4-6` |
| Context Window | 1,000,000 tokens |
| Max Output | 128,000 tokens |
| Input Price | $5.00 / 1M tokens |
| Output Price | $25.00 / 1M tokens |
| Cached Input | $0.50 / 1M tokens (90% discount) |
| Extended Thinking | Yes |

### Claude Sonnet 4.6 (Balanced)

| Property | Value |
|----------|-------|
| Model ID | `claude-sonnet-4-6` |
| Context Window | 1,000,000 tokens |
| Max Output | 64,000 tokens |
| Input Price | $3.00 / 1M tokens |
| Output Price | $15.00 / 1M tokens |
| Cached Input | $0.30 / 1M tokens (90% discount) |
| Extended Thinking | Yes |

### Claude Haiku 4.5 (Fast)

| Property | Value |
|----------|-------|
| Model ID | `claude-haiku-4-5-20251001` |
| Context Window | 200,000 tokens |
| Max Output | 64,000 tokens |
| Input Price | $1.00 / 1M tokens |
| Output Price | $5.00 / 1M tokens |
| Cached Input | $0.10 / 1M tokens (90% discount) |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
  }),
});

const data = await response.json();
console.log(data.content[0].text);
```

### Streaming Example

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
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
    if (!line.trim() || !line.trim().startsWith('data: ')) continue;

    const jsonStr = line.trim().slice(6);
    try {
      const event = JSON.parse(jsonStr);

      if (event.type === 'content_block_delta') {
        process.stdout.write(event.delta.text);
      }
    } catch {
      // Skip malformed JSON
    }
  }
}
```

### System Prompt Example

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are a helpful coding assistant. Always provide concise answers.',
    messages: [
      { role: 'user', content: 'How do I read a file in Python?' }
    ],
  }),
});
```

### Tool Use Example (Structured Output)

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    tools: [
      {
        name: 'get_weather',
        description: 'Get the current weather in a location',
        input_schema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
          },
          required: ['location'],
        },
      },
    ],
    messages: [
      { role: 'user', content: 'What is the weather in Tokyo?' }
    ],
  }),
});

const data = await response.json();
// Check for tool use in response
const toolUse = data.content.find(block => block.type === 'tool_use');
if (toolUse) {
  console.log('Tool:', toolUse.name);
  console.log('Input:', toolUse.input);
}
```

### Vision Example

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What is in this image?' },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64EncodedImage,
            },
          },
        ],
      },
    ],
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
| 529 | overloaded_error | Server overloaded |

### Error Response Format

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "string"
  }
}
```

## Rate Limits

Rate limits vary by plan and model. Check your limits at:
https://console.anthropic.com/settings/limits

## Best Practices

1. **Use prompt caching**: Reduces input costs by 90% for repeated prompts
2. **Set appropriate max_tokens**: Always set max_tokens to limit output
3. **Use system prompt for instructions**: Anthropic uses `system` parameter, not role-based system messages
4. **Handle streaming events**: Process events incrementally for better UX
5. **Implement retry logic**: Use exponential backoff for rate limits

## Key Differences from OpenAI

1. **System prompt**: Use `system` parameter, not `{ role: "system", content: "..." }`
2. **Max tokens required**: `max_tokens` is a required parameter
3. **Different roles**: Only `user` and `assistant` roles (no system)
4. **Streaming format**: Uses Server-Sent Events with typed events
5. **Tool use**: Structured output via `tools` array with `input_schema`
6. **Vision**: Images passed as base64 in content blocks, not URLs

## References

- API Reference: https://docs.anthropic.com/en/api/messages
- Models: https://docs.anthropic.com/en/docs/about-claude/models
- Pricing: https://www.anthropic.com/pricing
- Prompt Caching: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- Tool Use: https://docs.anthropic.com/en/docs/build-with-claude/tool-use