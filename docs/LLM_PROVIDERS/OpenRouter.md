# OpenRouter Provider Documentation

## Overview

**Provider ID:** `openrouter`
**Provider Name:** OpenRouter
**Base URL:** `https://openrouter.ai/api/v1`
**API Reference:** https://openrouter.ai/docs

## Capabilities

- Streaming: Yes
- Structured Output: Yes (varies by underlying model)
- Vision: Yes (varies by underlying model)
- Audio: No
- Function Calling: Yes (varies by underlying model)
- Reasoning: Yes (varies by underlying model)

## Authentication

API Key authentication via `Authorization` header:
```
Authorization: Bearer sk-or-...
```

API keys are obtained from the OpenRouter console.

### Required Headers

OpenRouter requires additional headers for app identification:

```
HTTP-Referer: https://your-site.com
X-Title: Your App Name
```

These headers help OpenRouter track usage and provide better support.

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
| `model` | string | Model ID in format `provider/model` (e.g., `openai/gpt-4o`) |
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

### OpenRouter-Specific Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `transforms` | array | Apply transforms like `["middle-out"]` for context compression |
| `route` | string | Routing strategy: `fallback` to try providers in order |
| `provider` | object | Provider-specific settings (e.g., `{"order": ["openai", "azure"]}`) |

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
  model: string                 // Model used (e.g., "openai/gpt-4o")
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
}
```

## Popular Models

OpenRouter provides access to 100+ models from various providers. Here are some popular options:

### OpenAI Models

| Property | Value |
|----------|-------|
| Model ID | `openai/gpt-4o` |
| Provider | OpenAI |
| Vision | Yes |
| Pricing | Dynamic (check API) |

| Property | Value |
|----------|-------|
| Model ID | `openai/gpt-4o-mini` |
| Provider | OpenAI |
| Vision | Yes |
| Pricing | Dynamic (check API) |

### Anthropic Models

| Property | Value |
|----------|-------|
| Model ID | `anthropic/claude-sonnet-4` |
| Provider | Anthropic |
| Vision | Yes |
| Pricing | Dynamic (check API) |

| Property | Value |
|----------|-------|
| Model ID | `anthropic/claude-3.5-haiku` |
| Provider | Anthropic |
| Vision | Yes |
| Pricing | Dynamic (check API) |

### Google Models

| Property | Value |
|----------|-------|
| Model ID | `google/gemini-2.0-flash-001` |
| Provider | Google |
| Vision | Yes |
| Pricing | Dynamic (check API) |

### DeepSeek Models

| Property | Value |
|----------|-------|
| Model ID | `deepseek/deepseek-chat` |
| Provider | DeepSeek |
| Vision | No |
| Pricing | Dynamic (check API) |

| Property | Value |
|----------|-------|
| Model ID | `deepseek/deepseek-reasoner` |
| Provider | DeepSeek |
| Vision | No |
| Reasoning | Yes |
| Pricing | Dynamic (check API) |

### Meta Models

| Property | Value |
|----------|-------|
| Model ID | `meta-llama/llama-3.3-70b-instruct` |
| Provider | Meta |
| Vision | No |
| Pricing | Dynamic (check API) |

### Mistral Models

| Property | Value |
|----------|-------|
| Model ID | `mistralai/mistral-large` |
| Provider | Mistral AI |
| Vision | No |
| Pricing | Dynamic (check API) |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your App Name',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4',
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
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your App Name',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
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

### Vision Example

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your App Name',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.0-flash-001',
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

### Fallback Routing Example

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your App Name',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4',
    messages: [{ role: 'user', content: 'Hello!' }],
    route: 'fallback',
    provider: {
      order: ['anthropic', 'openai'],
    },
  }),
});

// Will try Anthropic first, then OpenAI if Anthropic fails
```

### Context Compression Example

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your App Name',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: longConversationHistory,
    transforms: ['middle-out'], // Compress middle of context
  }),
});
```

### Structured Output (JSON Mode)

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'Your App Name',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
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

Rate limits vary by model and your subscription tier. Check your limits at:
https://openrouter.ai/limits

## Pricing

OpenRouter uses dynamic pricing that reflects the underlying provider's pricing. Prices are returned in the `/models` endpoint:

```typescript
interface ModelPricing {
  prompt: string      // Price per token for input
  completion: string  // Price per token for output
}
```

Always check current pricing via the API, as prices can change.

## Best Practices

1. **Include app identification headers**: Set `HTTP-Referer` and `X-Title` for better support
2. **Use fallback routing**: Configure backup providers for reliability
3. **Check model capabilities**: Vision, function calling, and structured output vary by model
4. **Monitor pricing**: Use the `/models` endpoint to get current pricing
5. **Implement retry logic**: Use exponential backoff for rate limits
6. **Consider context compression**: Use `transforms: ['middle-out']` for long conversations

## Key Differences from OpenAI

1. **Gateway model**: Provides access to 100+ models from multiple providers
2. **Required headers**: Must include `HTTP-Referer` and `X-Title` for app identification
3. **Model naming**: Uses `provider/model` format (e.g., `openai/gpt-4o`)
4. **Dynamic pricing**: Prices fetched from API, not hardcoded
5. **Fallback routing**: Can automatically failover to alternative providers
6. **Context compression**: Built-in transforms like `middle-out` for long contexts
7. **Provider selection**: Can specify preferred providers or routing order

## References

- API Reference: https://openrouter.ai/docs
- Console: https://openrouter.ai/dashboard
- Models: https://openrouter.ai/models
- Pricing: https://openrouter.ai/pricing