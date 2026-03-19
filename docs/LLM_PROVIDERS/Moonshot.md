# Moonshot AI Provider Documentation

## Overview

**Provider ID:** `moonshot`
**Provider Name:** Moonshot AI (Kimi)
**Base URL:** `https://api.moonshot.cn/v1`
**API Reference:** https://platform.moonshot.cn/docs/

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: Yes (kimi-k2.5 only)
- Audio: No
- Function Calling: Yes
- Reasoning: Yes (kimi-k2-thinking, kimi-k2-thinking-turbo, kimi-k2.5 with thinking mode)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer sk-...
```

API keys are obtained from the Moonshot AI platform console.

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
| `model` | string | Model ID (e.g., `kimi-k2.5`, `kimi-k2-turbo-preview`) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | 1.0 | 0.0 - 2.0 | Sampling temperature. Note: kimi-k2.5 uses fixed values (1.0 for thinking, 0.6 for non-thinking). |
| `max_tokens` | integer | model-dependent | 1 - model max | Maximum tokens to generate in the completion. |
| `top_p` | number | 1.0 | 0.0 - 1.0 | Nucleus sampling. Note: kimi-k2.5 uses fixed value 0.95. |
| `stream` | boolean | false | - | Enable streaming responses. |
| `stop` | string/array | null | - | Up to 4 sequences where API stops generating. |
| `thinking` | object | null | - | **kimi-k2.5 only**: `{"type": "enabled"}` or `{"type": "disabled"}` to control reasoning mode. |

### Message Format

```typescript
interface Message {
  role: "system" | "user" | "assistant"
  content: string | ContentPart[]
}

interface ContentPart {
  type: "text" | "image_url"
  text?: string
  image_url?: { url: string }
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
      tool_calls?: ToolCall[]   // Present when function calling is used
    }
    finish_reason: "stop" | "length" | "tool_calls" | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
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
      tool_calls?: ToolCallDelta[]
    }
    finish_reason: string | null
  }>
}
```

## Flagship Models

### Kimi K2.5 (Multimodal Flagship)

| Property | Value |
|----------|-------|
| Model ID | `kimi-k2.5` |
| Context Window | 256,000 tokens |
| Max Output | 32,000 tokens |
| Input Price (Cache Hit) | CNY 0.70 / 1M tokens |
| Input Price (Cache Miss) | CNY 4.00 / 1M tokens |
| Output Price | CNY 21.00 / 1M tokens |
| Vision | Yes |
| Video | Yes |
| Thinking Mode | Yes |

**Features:**
- Multimodal: Supports text, images, and video
- Thinking mode: Advanced reasoning with `thinking` parameter
- Large context: 256K context window
- Tool calling: Supports function calling and multimodal tools

### Kimi K2 Series (Code & Agent Focused)

**Architecture:** MoE (Mixture of Experts) - 1T total parameters, 32B active

#### Kimi K2 0905 Preview

| Property | Value |
|----------|-------|
| Model ID | `kimi-k2-0905-preview` |
| Context Window | 256,000 tokens |
| Focus | Code generation, agent applications |

#### Kimi K2 Turbo Preview

| Property | Value |
|----------|-------|
| Model ID | `kimi-k2-turbo-preview` |
| Context Window | 256,000 tokens |
| Speed | 60-100 tokens/second |
| Focus | High-speed inference |

#### Kimi K2 Thinking

| Property | Value |
|----------|-------|
| Model ID | `kimi-k2-thinking` |
| Context Window | 256,000 tokens |
| Focus | Deep reasoning and complex problem-solving |

#### Kimi K2 Thinking Turbo

| Property | Value |
|----------|-------|
| Model ID | `kimi-k2-thinking-turbo` |
| Context Window | 256,000 tokens |
| Focus | Fast reasoning with thinking traces |

### Moonshot V1 Series (Legacy)

#### Moonshot V1 8K

| Property | Value |
|----------|-------|
| Model ID | `moonshot-v1-8k` |
| Context Window | 8,192 tokens |
| Max Output | 4,096 tokens |

#### Moonshot V1 32K

| Property | Value |
|----------|-------|
| Model ID | `moonshot-v1-32k` |
| Context Window | 32,768 tokens |
| Max Output | 4,096 tokens |

#### Moonshot V1 128K

| Property | Value |
|----------|-------|
| Model ID | `moonshot-v1-128k` |
| Context Window | 131,072 tokens |
| Max Output | 4,096 tokens |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2-turbo-preview',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' }
    ],
    max_tokens: 1000,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Kimi K2.5 with Thinking Mode

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2.5',
    messages: [
      { role: 'user', content: 'Solve this complex math problem step by step...' }
    ],
    thinking: { type: 'enabled' },
    // Note: temperature and top_p are fixed for kimi-k2.5
    // thinking mode: temperature=1.0, top_p=0.95
    // non-thinking mode: temperature=0.6, top_p=0.95
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Vision Example (Kimi K2.5)

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2.5',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'What is in this image?' },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.png',
          },
        },
      ],
    }],
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Video Analysis (Kimi K2.5)

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2.5',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Summarize this video' },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/video.mp4',
          },
        },
      ],
    }],
  }),
});
```

**Supported Video Formats:** mp4, mpeg, mpg, mov, avi, wmv, ram, rmvb, flv, asf, 3gp, webm

### Streaming Example

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2-turbo-preview',
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

### Function Calling Example

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2.5',
    messages: [
      { role: 'user', content: 'What is the weather in Beijing?' }
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name',
            },
          },
          required: ['location'],
        },
      },
    }],
  }),
});

const data = await response.json();
if (data.choices[0].message.tool_calls) {
  const toolCall = data.choices[0].message.tool_calls[0];
  console.log('Function to call:', toolCall.function.name);
  console.log('Arguments:', toolCall.function.arguments);
}
```

### Structured Output (JSON Mode)

```typescript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'kimi-k2-turbo-preview',
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
https://platform.moonshot.cn/console

## Best Practices

1. **Choose the right model**: Use `kimi-k2.5` for multimodal tasks, `kimi-k2-turbo-preview` for high-speed text tasks
2. **Use thinking mode for complex problems**: Enable with `thinking: { type: 'enabled' }` on kimi-k2.5
3. **Leverage the 256K context**: Excellent for document processing and long conversations
4. **Use cache effectively**: Cache hits are significantly cheaper (CNY 0.70 vs CNY 4.00 per 1M tokens)
5. **Handle streaming properly**: Process chunks incrementally for better user experience
6. **Implement retry logic**: Use exponential backoff for rate limits

## Key Differences from OpenAI

1. **Kimi branding**: Core models are now branded as "Kimi" series, not "Moonshot V1"
2. **Massive MoE models**: K2 series uses 1T parameter MoE architecture with 32B active parameters
3. **Video support**: kimi-k2.5 supports video analysis natively
4. **Thinking mode**: Built-in reasoning mode with configurable thinking parameter
5. **Fixed sampling parameters**: kimi-k2.5 uses fixed temperature and top_p values
6. **Cache pricing**: Distinct cache hit/miss pricing for cost optimization
7. **Multimodal tools**: Supports function calling with vision capabilities
8. **Chinese optimization**: Excellent performance on Chinese language tasks

## Pricing Comparison

| Model | Context | Input (Cache Hit) | Input (Cache Miss) | Output |
|-------|---------|-------------------|-------------------|--------|
| kimi-k2.5 | 256K | CNY 0.70/MTok | CNY 4.00/MTok | CNY 21.00/MTok |
| kimi-k2-turbo-preview | 256K | Check official pricing | - | - |
| kimi-k2-thinking | 256K | Check official pricing | - | - |
| moonshot-v1-8k | 8K | CNY 1.50/MTok | - | CNY 1.50/MTok |
| moonshot-v1-32k | 32K | CNY 3.00/MTok | - | CNY 3.00/MTok |
| moonshot-v1-128k | 128K | CNY 6.00/MTok | - | CNY 6.00/MTok |

## References

- API Reference: https://platform.moonshot.cn/docs/
- Pricing: https://platform.moonshot.cn/docs/pricing/chat
- Kimi K2.5 Guide: https://platform.moonshot.cn/docs/guide/kimi-k2-5-quickstart
- Console: https://platform.moonshot.cn/console