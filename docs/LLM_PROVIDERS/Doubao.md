# Doubao Provider Documentation

## Overview

**Provider ID:** `doubao`
**Provider Name:** Doubao (ByteDance)
**Base URL:** `https://ark.cn-beijing.volces.com/api/v3`
**API Reference:** https://www.volcengine.com/docs/82379/1298454

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: Yes
- Audio: No
- Video: Yes (Seed 2.0 series)
- Function Calling: Yes (Seed 2.0 series)
- Reasoning: Yes (Seed 2.0 Pro)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer YOUR_API_KEY
```

API keys are obtained from the Volcano Engine (ByteDance Cloud) console.

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
| `model` | string | Model ID (e.g., `doubao-pro-32k`, `doubao-lite-128k`) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | model-dependent | 0.0 - 2.0 | Sampling temperature. Higher values make output more random. |
| `max_tokens` | integer | model-dependent | 1 - model max | Maximum tokens to generate in the completion. |
| `top_p` | number | model-dependent | 0.0 - 1.0 | Nucleus sampling. Model considers results with top_p probability mass. |
| `stream` | boolean | false | - | Enable streaming responses. |
| `stop` | string/array | null | - | Up to 4 sequences where API stops generating. |
| `response_format` | object | null | - | Format specification (`{type: "json_object"}`). |

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
    }
    finish_reason: "stop" | "length" | null
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

### Seed 2.0 Series (Latest Generation - February 2026)

Doubao Seed 2.0 is ByteDance's next-generation flagship model family, featuring four tiers optimized for different use cases.

#### Seed 2.0 Pro (Flagship)

| Property | Value |
|----------|-------|
| Model ID | `seed-2.0-pro` |
| Context Window | 256,000 tokens |
| Max Output | 131,072 tokens |
| Input Price | $0.47 / 1M tokens |
| Output Price | $2.37 / 1M tokens |
| Vision | Yes |
| Video | Yes |
| Function Calling | Yes |
| Reasoning | Yes |

**Benchmark Performance:**
- AIME 2025: 98.3
- Codeforces: 3020
- GPQA Diamond: 88.9
- LiveCodeBench v6: High

**Features:**
- Advanced reasoning capabilities
- Strong mathematical problem solving
- Excellent code generation
- Native multimodal support (text, image, video)

#### Seed 2.0 Lite (Balanced)

| Property | Value |
|----------|-------|
| Model ID | `seed-2.0-lite` |
| Context Window | 256,000 tokens |
| Max Output | 131,072 tokens |
| Input Price | $0.25 / 1M tokens |
| Output Price | $2.00 / 1M tokens |
| Vision | Yes |
| Video | Yes |
| Function Calling | Yes |

**Features:**
- Cost-effective for production workloads
- Large context with 256K input and 131K output
- Multimodal support
- Balanced performance and cost

#### Seed 2.0 Mini (High Throughput)

| Property | Value |
|----------|-------|
| Model ID | `seed-2.0-mini` |
| Focus | High throughput, cost-sensitive scenarios |
| Vision | Yes |
| Video | Yes |

**Features:**
- Optimized for inference throughput
- Maximum deployment density
- Best for high-volume, cost-sensitive applications
- Multimodal support

#### Seed 2.0 Code (Code Specialized)

| Property | Value |
|----------|-------|
| Model ID | `seed-2.0-code` |
| Context Window | 256,000 tokens |
| Focus | Code generation, debugging, code analysis |
| LiveCodeBench v6 | 87.8 |

**Features:**
- Specialized for programming tasks
- Supports multiple programming languages
- Excellent at code explanation and debugging
- Large context for codebase analysis

### Doubao 1.5 Series (Previous Generation)

#### Doubao 1.5 Pro 256K (Large Context)

| Property | Value |
|----------|-------|
| Model ID | `doubao-1.5-pro-256k` |
| Context Window | 256,000 tokens |
| Max Output | 8,192 tokens |
| Input Price | $5.00 / 1M tokens |
| Output Price | $9.00 / 1M tokens |
| Vision | Yes |

### Doubao 1.5 Pro 32K

| Property | Value |
|----------|-------|
| Model ID | `doubao-1.5-pro-32k` |
| Context Window | 32,000 tokens |
| Max Output | 8,192 tokens |
| Input Price | $1.50 / 1M tokens |
| Output Price | $6.00 / 1M tokens |
| Vision | Yes |

### Doubao Pro 128K

| Property | Value |
|----------|-------|
| Model ID | `doubao-pro-128k` |
| Context Window | 128,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $5.00 / 1M tokens |
| Output Price | $9.00 / 1M tokens |
| Vision | Yes |

### Doubao Pro 32K

| Property | Value |
|----------|-------|
| Model ID | `doubao-pro-32k` |
| Context Window | 32,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $0.80 / 1M tokens |
| Output Price | $2.00 / 1M tokens |
| Vision | Yes |

### Doubao Lite 128K (Economical)

| Property | Value |
|----------|-------|
| Model ID | `doubao-lite-128k` |
| Context Window | 128,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $0.80 / 1M tokens |
| Output Price | $2.00 / 1M tokens |
| Vision | Yes |

### Doubao Lite 32K (Most Economical)

| Property | Value |
|----------|-------|
| Model ID | `doubao-lite-32k` |
| Context Window | 32,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $0.30 / 1M tokens |
| Output Price | $0.60 / 1M tokens |
| Vision | Yes |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'doubao-pro-32k',
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
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'doubao-lite-32k',
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

### Long Context Example (256K model)

```typescript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'doubao-1.5-pro-256k',
    messages: [
      { role: 'system', content: 'You are a document analysis assistant.' },
      { role: 'user', content: longDocument } // Can handle up to 256K tokens
    ],
    temperature: 0.3, // Lower temperature for factual analysis
    max_tokens: 8192,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Vision Example

```typescript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'doubao-pro-32k',
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

### Structured Output (JSON Mode)

```typescript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'doubao-lite-32k',
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
https://console.volcengine.com/ark

## Best Practices

1. **Choose the right model**: Use `doubao-lite-32k` for simple tasks, `doubao-1.5-pro-256k` for complex analysis
2. **Use Lite models for high volume**: Best cost-efficiency for production workloads
3. **Set reasonable max_tokens**: Prevent runaway generation
4. **Handle streaming properly**: Process chunks incrementally
5. **Implement retry logic**: Use exponential backoff for rate limits
6. **Use JSON mode for structured output**: Set `response_format: { type: 'json_object' }`

## Key Differences from OpenAI

1. **ByteDance origin**: Chinese tech giant's LLM service via Volcano Engine
2. **Extremely competitive pricing**: Lite models start at $0.30/MTok input
3. **Large context windows**: Up to 256K context on doubao-1.5-pro-256k
4. **Vision support**: All models support image analysis
5. **OpenAI-compatible API**: Easy migration from OpenAI
6. **Chinese language optimization**: Better performance on Chinese text
7. **Volcano Engine integration**: Part of ByteDance's cloud ecosystem

## Pricing Comparison

| Model | Context | Input ($/MTok) | Output ($/MTok) |
|-------|---------|----------------|-----------------|
| seed-2.0-pro | 256K | $0.47 | $2.37 |
| seed-2.0-lite | 256K | $0.25 | $2.00 |
| seed-2.0-mini | varies | Competitive | Competitive |
| seed-2.0-code | 256K | Competitive | Competitive |
| doubao-lite-32k | 32K | $0.30 | $0.60 |
| doubao-lite-128k | 128K | $0.80 | $2.00 |
| doubao-pro-32k | 32K | $0.80 | $2.00 |
| doubao-pro-128k | 128K | $5.00 | $9.00 |
| doubao-1.5-pro-32k | 32K | $1.50 | $6.00 |
| doubao-1.5-pro-256k | 256K | $5.00 | $9.00 |

## References

- API Reference: https://www.volcengine.com/docs/82379/1298454
- Console: https://console.volcengine.com/ark
- Volcano Engine: https://www.volcengine.com/
- Pricing: https://www.volcengine.com/docs/82379/1299348