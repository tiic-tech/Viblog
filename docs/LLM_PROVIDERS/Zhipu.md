# Zhipu AI Provider Documentation

## Overview

**Provider ID:** `zhipu`
**Provider Name:** Zhipu AI (Tsinghua University)
**Base URL:** `https://open.bigmodel.cn/api/paas/v4`
**API Reference:** https://open.bigmodel.cn/dev/api

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: Yes (glm-4.6v, glm-5, glm-4.6 series)
- Audio: No
- Function Calling: Yes (glm-5, glm-4.6 series)
- Reasoning: Yes (glm-5 with thinking mode)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer YOUR_API_KEY
```

API keys are obtained from the Zhipu AI open platform console.

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
| `model` | string | Model ID (e.g., `glm-5`, `glm-4.6-flash`) |
| `messages` | array | Array of message objects |

### Optional Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | 0.95 | 0.0 - 1.0 | Sampling temperature. Higher values make output more random. |
| `max_tokens` | integer | model-dependent | 1 - model max | Maximum tokens to generate in the completion. |
| `top_p` | number | 0.7 | 0.0 - 1.0 | Nucleus sampling. Model considers results with top_p probability mass. |
| `stream` | boolean | false | - | Enable streaming responses. |
| `stop` | string/array | null | - | Up to 4 sequences where API stops generating. |
| `tools` | array | null | - | Function calling tools (supported on glm-5, glm-4.6 series). |

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

### GLM-5 (Flagship Reasoning Model - February 2026)

| Property | Value |
|----------|-------|
| Model ID | `glm-5` |
| Architecture | MoE (744B total, 40-44B active parameters) |
| Context Window | 200,000 tokens |
| Max Output | 128,000 tokens |
| Input Price | $1.00 / 1M tokens |
| Output Price | $3.20 / 1M tokens |
| Vision | Yes |
| Function Calling | Yes |
| Reasoning | Yes (Thinking Mode) |

**Features:**
- Next-generation flagship model with advanced reasoning capabilities
- Massive MoE architecture with efficient 40-44B active parameters
- SWE-Bench 77.8% - state-of-the-art code generation
- Native "Thinking Mode" for complex problem solving
- Agentic engineering capabilities for autonomous task execution
- Supports tools/function calling natively
- Native multimodal understanding

### GLM-5 Code (Code Specialized)

| Property | Value |
|----------|-------|
| Model ID | `glm-5-code` |
| Context Window | 200,000 tokens |
| Max Output | 128,000 tokens |
| Input Price | $1.20 / 1M tokens |
| Output Price | $5.00 / 1M tokens |
| Focus | Code generation, debugging, code analysis |

**Features:**
- Specialized for programming tasks
- Excellent at code explanation and debugging
- Supports multiple programming languages
- Large context for codebase analysis

### GLM-4.6 Series (Multimodal Balanced)

#### GLM-4.6 (Balanced Multimodal)

| Property | Value |
|----------|-------|
| Model ID | `glm-4.6` |
| Context Window | 128,000 tokens |
| Max Output | 16,384 tokens |
| Input Price | $2.00 / 1M tokens |
| Output Price | $6.00 / 1M tokens |
| Vision | Yes |
| Function Calling | Yes |

**Features:**
- Balanced multimodal model for general tasks
- Native function calling support
- Strong performance on Chinese and English tasks

#### GLM-4.6-Flash (Fast & Economical)

| Property | Value |
|----------|-------|
| Model ID | `glm-4.6-flash` |
| Context Window | 128,000 tokens |
| Max Output | 8,192 tokens |
| Input Price | $0.10 / 1M tokens |
| Output Price | $0.30 / 1M tokens |
| Vision | Yes |
| Function Calling | Yes |

**Features:**
- Ultra-fast inference for high-volume workloads
- Best value for cost-sensitive applications
- Multimodal support at minimal cost

#### GLM-4.6-Long (Massive Context)

| Property | Value |
|----------|-------|
| Model ID | `glm-4.6-long` |
| Context Window | 1,000,000 tokens (1M) |
| Max Output | 16,384 tokens |
| Input Price | $1.00 / 1M tokens |
| Output Price | $3.00 / 1M tokens |
| Vision | No |

**Features:**
- Massive 1M token context window
- Ideal for document analysis, book processing
- Competitive pricing for long-context tasks

### GLM-4.6V (Vision-Language MoE)

| Property | Value |
|----------|-------|
| Model ID | `glm-4.6v` |
| Architecture | MoE (106B total, 12B active parameters) |
| Context Window | 128,000 tokens |
| Max Output | 8,192 tokens |
| Input Price | $0.30 / 1M tokens |
| Output Price | $0.90 / 1M tokens |
| Vision | Yes |
| Function Calling | Yes (Native Multimodal) |

**Features:**
- Efficient MoE vision-language model
- Native multimodal function calling
- Excellent for document OCR, chart analysis
- Only 12B active parameters for fast inference

### GLM-4 Plus (Legacy Balanced)

| Property | Value |
|----------|-------|
| Model ID | `glm-4-plus` |
| Context Window | 128,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $6.25 / 1M tokens |
| Output Price | $6.25 / 1M tokens |
| Vision | No |

### GLM-4 Flash (Legacy Fast & Economical)

| Property | Value |
|----------|-------|
| Model ID | `glm-4-flash` |
| Context Window | 128,000 tokens |
| Max Output | 4,096 tokens |
| Input Price | $0.01 / 1M tokens |
| Output Price | $0.01 / 1M tokens |
| Vision | No |

### GLM-4V Plus (Legacy Vision)

| Property | Value |
|----------|-------|
| Model ID | `glm-4v-plus` |
| Context Window | 8,192 tokens |
| Max Output | 4,096 tokens |
| Input Price | $6.25 / 1M tokens |
| Output Price | $6.25 / 1M tokens |
| Vision | Yes |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4.6-flash',
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

### GLM-5 with Thinking Mode (Complex Reasoning)

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-5',
    messages: [
      { role: 'user', content: 'Solve this complex math problem step by step...' }
    ],
    // GLM-5 automatically activates thinking mode for complex problems
    max_tokens: 32768,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Streaming Example

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4.6-flash',
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

### Long Context Example (1M tokens with glm-4.6-long)

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4.6-long',
    messages: [
      { role: 'system', content: 'You are a document analysis assistant.' },
      { role: 'user', content: longDocument } // Can handle up to 1M tokens
    ],
    temperature: 0.3, // Lower temperature for factual analysis
    max_tokens: 16384,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Vision Example (glm-4.6v)

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4.6v',
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

### Function Calling Example (glm-5)

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-5',
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
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4.6-flash',
    messages: [
      { role: 'user', content: 'Generate a JSON object with name and age.' }
    ],
    temperature: 0, // Use low temperature for consistent structured output
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
https://open.bigmodel.cn/console

## Best Practices

1. **Choose the right model**: Use `glm-5` for complex reasoning, `glm-4.6-flash` for high volume, `glm-4.6-long` for massive context
2. **Leverage thinking mode**: GLM-5 automatically activates thinking mode for complex problems
3. **Use 1M context wisely**: glm-4.6-long supports 1M tokens for document analysis
4. **Cost optimization**: glm-4.6-flash at $0.10/$0.30 per MTok is extremely economical
5. **Vision tasks**: glm-4.6v offers efficient MoE vision with native function calling
6. **Set reasonable max_tokens**: Prevent runaway generation
7. **Handle streaming properly**: Process chunks incrementally
8. **Implement retry logic**: Use exponential backoff for rate limits

## Key Differences from OpenAI

1. **Tsinghua University origin**: Chinese academic LLM with strong Chinese language support
2. **GLM-5 reasoning model**: Native thinking mode for complex problem solving
3. **Massive MoE architecture**: GLM-5 uses 744B params with only 40-44B active
4. **Agentic capabilities**: GLM-5 supports autonomous task execution
5. **1M context window**: glm-4.6-long offers massive context at competitive pricing
6. **Native multimodal function calling**: glm-4.6v supports vision + tools natively
7. **Extremely competitive pricing**: glm-4.6-flash at $0.10/$0.30 per MTok
8. **Lower temperature default**: Default temperature is 0.95, higher than OpenAI's 1.0

## Pricing Comparison

| Model | Context | Input ($/MTok) | Output ($/MTok) |
|-------|---------|----------------|-----------------|
| glm-5 | 200K | $1.00 | $3.20 |
| glm-5-code | 200K | $1.20 | $5.00 |
| glm-4.6 | 128K | $2.00 | $6.00 |
| glm-4.6-flash | 128K | $0.10 | $0.30 |
| glm-4.6-long | 1M | $1.00 | $3.00 |
| glm-4.6v | 128K | $0.30 | $0.90 |
| glm-4-plus | 128K | $6.25 | $6.25 |
| glm-4-flash | 128K | $0.01 | $0.01 |
| glm-4v-plus | 8K | $6.25 | $6.25 |

## References

- API Reference: https://open.bigmodel.cn/dev/api
- Console: https://open.bigmodel.cn/console
- Model Documentation: https://open.bigmodel.cn/dev/api#model
- Pricing: https://open.bigmodel.cn/pricing
- GLM-5 Announcement: https://www.zhipuai.cn/glm-5