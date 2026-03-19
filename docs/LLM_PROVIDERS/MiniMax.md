# MiniMax Provider Documentation

## Overview

**Provider ID:** `minimax`
**Provider Name:** MiniMax AI
**Base URL:** `https://api.minimax.chat/v1`
**API Reference:** https://www.minimaxi.com/document/

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: Yes (MiniMax-M2.5 series)
- Audio: Yes (MiniMax-M2.5 series)
- Video: Yes (MiniMax-M2.5 series)
- Function Calling: Yes (MiniMax-M2.5 series)
- Reasoning: Yes (MiniMax-M2.5 series)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer YOUR_API_KEY
```

API keys are obtained from the MiniMax console.

## Endpoints

### Chat Completions (OpenAI-compatible)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/completions` | Create chat completion (MiniMax-M2.5 series) |
| POST | `/text/chatcompletion_v2` | Create chat completion (Legacy ABAB series) |
| GET | `/models` | List available models |

**Note:** MiniMax-M2.5 series uses the standard OpenAI-compatible `/chat/completions` endpoint. Legacy ABAB models use `/text/chatcompletion_v2`.

## Request Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Model ID (e.g., `abab6.5s-chat`, `abab5.5s-chat`) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | 1.0 | 0.0 - 2.0 | Sampling temperature. Higher values make output more random. |
| `max_tokens` | integer | model-dependent | 1 - model max | Maximum tokens to generate in the completion. |
| `top_p` | number | 1.0 | 0.0 - 1.0 | Nucleus sampling. Model considers results with top_p probability mass. |
| `stream` | boolean | false | - | Enable streaming responses. |

### Message Format

```typescript
interface Message {
  role: "system" | "user" | "assistant"
  content: string
}
```

## Response Format

### ChatCompletion Object

**Note:** MiniMax uses a different response structure than OpenAI. The response contains `text` directly instead of `message.content`.

```typescript
interface ChatCompletion {
  id: string                    // Unique identifier
  choices: Array<{
    index: number
    text: string                // Direct text content (different from OpenAI)
    finish_reason: "stop" | "length" | null
  }>
  usage: {
    total_tokens: number
  }
}
```

### Streaming Chunk Format

```typescript
interface ChatCompletionChunk {
  id: string
  choices: Array<{
    index: number
    delta: {
      content?: string
    }
    finish_reason: string | null
  }>
}
```

## Flagship Models

### MiniMax-M2.5 Series (Latest Generation - January 2026)

MiniMax M2.5 is the next-generation flagship model featuring native multimodal support and Mixture of Experts architecture.

#### MiniMax-M2.5 (Multimodal Flagship)

| Property | Value |
|----------|-------|
| Model ID | `MiniMax-M2.5` |
| Architecture | MoE (Mixture of Experts) |
| Context Window | 1,000,000 tokens (1M) |
| Max Output | 128,000 tokens |
| Input Price | $0.25 / 1M tokens |
| Output Price | $0.95 / 1M tokens |
| Vision | Yes (Native) |
| Audio | Yes (Native) |
| Video | Yes (Native) |
| Function Calling | Yes |
| Reasoning | Yes |

**Benchmark Performance:**
- SWE-Bench Verified: 80.2%
- Multi-SWE-Bench: 51.3%

**Features:**
- Native multimodal: Text, Image, Video, Music in one model
- Massive 1M context window
- MoE architecture for efficient inference
- Advanced code generation capabilities
- Native tool/function calling support

#### MiniMax-M2.5-Lightning (High Speed)

| Property | Value |
|----------|-------|
| Model ID | `MiniMax-M2.5-Lightning` |
| Focus | High-speed inference |
| Speed | 100+ tokens/second |
| Vision | Yes (Native) |
| Audio | Yes (Native) |
| Video | Yes (Native) |

**Features:**
- Optimized for real-time applications
- Same multimodal capabilities as M2.5
- Best for high-throughput scenarios

### ABAB 6.5s Chat (Large Context - Legacy)

| Property | Value |
|----------|-------|
| Model ID | `abab6.5s-chat` |
| Context Window | 245,000 tokens |
| Max Output | 16,384 tokens |
| Input Price | $1.00 / 1M tokens |
| Output Price | $1.00 / 1M tokens |
| Vision | No |

### ABAB 5.5s Chat (Standard)

| Property | Value |
|----------|-------|
| Model ID | `abab5.5s-chat` |
| Context Window | 8,192 tokens |
| Max Output | 4,096 tokens |
| Input Price | $0.50 / 1M tokens |
| Output Price | $0.50 / 1M tokens |
| Vision | No |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'abab6.5s-chat',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  }),
});

const data = await response.json();
// Note: Access text directly from choices[0].text (not message.content)
console.log(data.choices[0].text);
```

### Streaming Example

```typescript
const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'abab6.5s-chat',
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

### Long Context Example (245K model)

```typescript
const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'abab6.5s-chat',
    messages: [
      { role: 'system', content: 'You are a document analysis assistant.' },
      { role: 'user', content: longDocument } // Can handle up to 245K tokens
    ],
    temperature: 0.3, // Lower temperature for factual analysis
    max_tokens: 16384,
  }),
});

const data = await response.json();
console.log(data.choices[0].text);
```

### Structured Output (JSON Mode)

```typescript
const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'abab5.5s-chat',
    messages: [
      { role: 'user', content: 'Generate a JSON object with name and age.' }
    ],
    temperature: 0, // Use low temperature for consistent structured output
  }),
});

const data = await response.json();
const parsed = JSON.parse(data.choices[0].text);
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
https://www.minimaxi.com/console

## Best Practices

1. **Choose the right model**: Use `MiniMax-M2.5` for multimodal tasks and long context, `MiniMax-M2.5-Lightning` for high-speed inference, `abab6.5s-chat` for legacy text-only long context
2. **Use M2.5 endpoint for new projects**: M2.5 series uses standard OpenAI-compatible `/chat/completions` endpoint
3. **Leverage 1M context**: MiniMax-M2.5 supports 1M tokens for massive documents
4. **Handle the unique response format (ABAB only)**: Legacy ABAB returns `choices[0].text` directly, not `choices[0].message.content`
5. **Set reasonable max_tokens**: Prevent runaway generation
6. **Handle streaming properly**: Process chunks incrementally
7. **Implement retry logic**: Use exponential backoff for rate limits
8. **Use native multimodal**: M2.5 series supports text, image, video, music in one model

## Key Differences from OpenAI

1. **Dual endpoint system**: M2.5 series uses standard `/chat/completions`, legacy ABAB uses `/text/chatcompletion_v2`
2. **Different response structure (ABAB only)**: Legacy returns `choices[0].text` instead of `choices[0].message.content`
3. **Massive 1M context**: MiniMax-M2.5 offers 1M context window at competitive pricing
4. **Native multimodal**: M2.5 series supports text, image, video, music in one model
5. **MoE architecture**: Efficient Mixture of Experts for better performance
6. **Simplified usage (ABAB only)**: Only returns `total_tokens` in usage, not separate prompt/completion counts
7. **Vision support (M2.5 only)**: Legacy ABAB models are text-only
8. **Chinese AI company**: Optimized for Chinese language tasks
9. **High-speed variant**: M2.5-Lightning offers 100+ tokens/second for real-time applications
10. **Strong coding performance**: 80.2% SWE-Bench Verified on M2.5

## Pricing Comparison

| Model | Context | Input ($/MTok) | Output ($/MTok) |
|-------|---------|----------------|-----------------|
| MiniMax-M2.5 | 1M | $0.25 | $0.95 |
| MiniMax-M2.5-Lightning | 1M | Competitive | Competitive |
| abab6.5s-chat | 245K | $1.00 | $1.00 |
| abab5.5s-chat | 8K | $0.50 | $0.50 |

## References

- API Reference: https://www.minimaxi.com/document/
- Console: https://www.minimaxi.com/console
- Pricing: https://www.minimaxi.com/pricing