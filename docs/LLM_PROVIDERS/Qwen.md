# Qwen Provider Documentation

## Overview

**Provider ID:** `qwen`
**Provider Name:** Qwen (Alibaba Tongyi Qianwen)
**Base URL:** `https://dashscope.aliyuncs.com/compatible-mode/v1`
**API Reference:** https://help.aliyun.com/zh/model-studio/developer-reference/api-details

## Capabilities

- Streaming: Yes
- Structured Output: Yes (JSON mode)
- Vision: Yes (qwen-vl series, qwen3.5-plus multimodal)
- Audio: Yes (qwen-audio series)
- Video: Yes (qwen3.5-plus multimodal)
- Function Calling: Yes
- Reasoning: Yes (qwen3-vl-235b-a22b-thinking)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer sk-...
```

API keys are obtained from the Alibaba Cloud DashScope console or Alibaba Cloud Model Studio.

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
| `model` | string | Model ID (e.g., `qwen3-max`, `qwen3.5-plus`) |
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
| `enable_thinking` | boolean | false | - | Enable thinking mode for reasoning models. |

### Message Format

```typescript
interface Message {
  role: "system" | "user" | "assistant"
  content: string | ContentPart[]
}

interface ContentPart {
  type: "text" | "image_url" | "video_url" | "audio_url"
  text?: string
  image_url?: { url: string }
  video_url?: { url: string }
  audio_url?: { url: string }
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

### Qwen3 Series (Latest Generation)

#### Qwen3-Max (Flagship)

| Property | Value |
|----------|-------|
| Model ID | `qwen3-max` |
| Context Window | 262,144 tokens (256K) |
| Max Output | 32,768 tokens |
| Input Price | $1.20 / 1M tokens |
| Output Price | $6.00 / 1M tokens |
| Vision | No |
| Reasoning | Yes |

**Features:**
- Best overall performance for complex tasks
- Advanced reasoning capabilities
- Excellent instruction following

#### Qwen3 235B A22B (MoE Efficiency)

| Property | Value |
|----------|-------|
| Model ID | `qwen3-235b-a22b-instruct-2507` |
| Architecture | MoE (235B total, 22B active parameters) |
| Context Window | 131,072 tokens (128K) |
| Max Output | 16,384 tokens |
| Input Price | $0.40 / 1M tokens |
| Output Price | $0.80 / 1M tokens |
| Vision | No |
| License | Apache 2.0 |

**Features:**
- Mixture of Experts architecture for efficient inference
- Only 22B active parameters during generation
- Open-source with Apache 2.0 license
- Excellent cost-to-performance ratio

#### Qwen3 Coder Plus (Code Specialized)

| Property | Value |
|----------|-------|
| Model ID | `qwen3-coder-plus` |
| Context Window | 131,072 tokens (128K) |
| Max Output | 8,192 tokens |
| Focus | Code generation, debugging, code analysis |

**Features:**
- Specialized for programming tasks
- Supports multiple programming languages
- Excellent at code explanation and debugging

#### Qwen3 VL Plus (Vision)

| Property | Value |
|----------|-------|
| Model ID | `qwen3-vl-plus` |
| Context Window | 131,072 tokens (128K) |
| Max Output | 8,192 tokens |
| Vision | Yes |
| Input Price | $0.28 / 1M tokens |
| Output Price | $0.56 / 1M tokens |

**Features:**
- Advanced visual understanding
- Document and chart analysis
- Image captioning and Q&A

#### Qwen3 VL 235B A22B Thinking (Vision + Reasoning)

| Property | Value |
|----------|-------|
| Model ID | `qwen3-vl-235b-a22b-thinking` |
| Architecture | MoE (235B total, 22B active) |
| Context Window | 262,144 tokens (256K) |
| Max Output | 32,768 tokens |
| Input Price | $0.45 / 1M tokens |
| Output Price | $3.49 / 1M tokens |
| Vision | Yes |
| Reasoning | Yes |

**Features:**
- Vision model with deep reasoning capabilities
- Thinking mode for complex visual problems
- MoE architecture for efficiency

### Qwen3.5 Series (Multimodal)

#### Qwen3.5-Plus (Native Multimodal)

| Property | Value |
|----------|-------|
| Model ID | `qwen3.5-plus` |
| Context Window | 1,048,576 tokens (1M) |
| Max Output | 8,192 tokens |
| Input Price | $0.40 / 1M tokens |
| Output Price | $2.40 / 1M tokens |
| Vision | Yes (native) |
| Video | Yes |
| Audio | Yes |

**Features:**
- Native multimodal: text, image, video, audio in one model
- Massive 1M context window
- Competitive pricing for multimodal tasks
- Ideal for document analysis with images

#### Qwen3.5-Flash (Fast Multimodal)

| Property | Value |
|----------|-------|
| Model ID | `qwen3.5-flash` |
| Context Window | 1,048,576 tokens (1M) |
| Max Output | 8,192 tokens |
| Input Price | $0.10 / 1M tokens |
| Output Price | $0.40 / 1M tokens |
| Vision | Yes (native) |
| Video | Yes |

**Features:**
- Ultra-fast multimodal inference
- 1M context window
- Best value for high-volume multimodal tasks
- Excellent for real-time applications

### Qwen Max (Legacy)

| Property | Value |
|----------|-------|
| Model ID | `qwen-max` |
| Context Window | 32,768 tokens |
| Max Output | 8,192 tokens |
| Input Price | $2.80 / 1M tokens |
| Output Price | $8.40 / 1M tokens |

### Qwen Plus (Legacy Large Context)

| Property | Value |
|----------|-------|
| Model ID | `qwen-plus` |
| Context Window | 131,072 tokens (128K) |
| Max Output | 8,192 tokens |
| Input Price | $0.56 / 1M tokens |
| Output Price | $2.24 / 1M tokens |

### Specialized Models

#### Qwen Image 2.0 (Image Generation)

| Property | Value |
|----------|-------|
| Model ID | `wanx-v1` |
| Type | Text-to-Image |
| Max Resolution | 2048 x 2048 |
| Features | Text rendering, multiple aspect ratios |

**Features:**
- High-quality image generation
- Text rendering in images
- Multiple styles and aspect ratios

#### Qwen Audio (Speech Understanding)

| Property | Value |
|----------|-------|
| Model ID | `qwen-audio-turbo` |
| Type | Speech-to-Text / Audio Understanding |
| Features | Multiple languages, transcription |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3.5-plus',
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
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3.5-flash',
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

### Multimodal Example (Image + Text)

```typescript
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3.5-plus',
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

### Video Analysis Example

```typescript
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3.5-plus',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Summarize this video' },
        {
          type: 'video_url',
          video_url: {
            url: 'https://example.com/video.mp4',
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
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3.5-flash',
    messages: [
      { role: 'user', content: 'Generate a JSON object with name and age.' }
    ],
    response_format: { type: 'json_object' },
  }),
});

const data = await response.json();
const parsed = JSON.parse(data.choices[0].message.content);
```

### Long Context Example (1M tokens)

```typescript
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3.5-plus',
    messages: [
      { role: 'system', content: 'You are a document analysis assistant.' },
      { role: 'user', content: longDocument } // Can handle up to 1M tokens
    ],
    temperature: 0.3, // Lower temperature for factual analysis
    max_tokens: 8192,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Function Calling Example

```typescript
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen3-max',
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
https://dashscope.console.aliyun.com/

## Best Practices

1. **Choose the right model**: Use `qwen3-max` for complex reasoning, `qwen3.5-flash` for high-volume multimodal
2. **Leverage 1M context**: qwen3.5 series supports 1M tokens for massive documents
3. **Use MoE for efficiency**: qwen3-235b-a22b offers great value with MoE architecture
4. **Set reasonable max_tokens**: Prevent runaway generation
5. **Handle streaming properly**: Process chunks incrementally
6. **Implement retry logic**: Use exponential backoff for rate limits
7. **Use JSON mode for structured output**: Set `response_format: { type: 'json_object' }`

## Key Differences from OpenAI

1. **DashScope/Model Studio**: Requires Alibaba Cloud account and DashScope service
2. **OpenAI-compatible endpoint**: Uses `/compatible-mode/v1` path for compatibility
3. **Chinese language optimization**: Better performance on Chinese text
4. **Massive context windows**: Up to 1M tokens on qwen3.5 series
5. **Native multimodal**: qwen3.5-plus supports text, image, video, audio natively
6. **MoE architecture**: Efficient inference with Mixture of Experts
7. **Reasoning models**: qwen3-vl-235b-a22b-thinking with thinking mode
8. **Open-source options**: Some models available with Apache 2.0 license

## Pricing Comparison

| Model | Context | Input ($/MTok) | Output ($/MTok) |
|-------|---------|----------------|-----------------|
| qwen3-max | 256K | $1.20 | $6.00 |
| qwen3-235b-a22b | 128K | $0.40 | $0.80 |
| qwen3.5-plus | 1M | $0.40 | $2.40 |
| qwen3.5-flash | 1M | $0.10 | $0.40 |
| qwen3-vl-235b-a22b-thinking | 256K | $0.45 | $3.49 |
| qwen-plus | 128K | $0.56 | $2.24 |
| qwen-max | 32K | $2.80 | $8.40 |

## References

- API Reference: https://help.aliyun.com/zh/model-studio/developer-reference/api-details
- DashScope Console: https://dashscope.console.aliyun.com/
- Model Documentation: https://help.aliyun.com/zh/model-studio/getting-started/models
- Pricing: https://help.aliyun.com/zh/model-studio/billing
- Qwen GitHub: https://github.com/QwenLM/Qwen