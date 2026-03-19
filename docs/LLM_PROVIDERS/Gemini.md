# Google Gemini Provider Documentation

## Overview

**Provider ID:** `google`
**Provider Name:** Google (Gemini)
**Base URL:** `https://generativelanguage.googleapis.com/v1beta`
**API Reference:** https://ai.google.dev/tutorials/rest_quickstart

## Capabilities

- Streaming: Yes (Server-Sent Events)
- Structured Output: Yes (JSON Schema)
- Vision: Yes
- Audio: Yes (multimodal)
- Function Calling: Yes
- Reasoning: No

## Authentication

API Key authentication via query parameter:
```
?key=YOUR_API_KEY
```

No Authorization header required - API key is passed as query parameter.

## Endpoints

### Generate Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/models/{model}:generateContent` | Generate content (non-streaming) |
| POST | `/models/{model}:streamGenerateContent?alt=sse` | Generate content (streaming) |

## Request Parameters

### Request Body Structure

```json
{
  "contents": [...],
  "generationConfig": {...},
  "safetySettings": [...],
  "tools": [...]
}
```

### contents (Required)

Array of content objects representing the conversation:

```typescript
interface Content {
  role: "user" | "model"
  parts: Part[]
}

interface Part {
  text?: string
  inlineData?: {
    mimeType: string
    data: string  // base64-encoded
  }
  functionCall?: {
    name: string
    args: object
  }
  functionResponse?: {
    name: string
    response: object
  }
}
```

### generationConfig (Optional)

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `temperature` | number | 1.0 | 0.0 - 2.0 | Sampling temperature. Controls randomness. |
| `maxOutputTokens` | integer | varies | 1 - model max | Maximum tokens to generate. |
| `topP` | number | 0.95 | 0.0 - 1.0 | Nucleus sampling threshold. |
| `topK` | integer | 40 | 1 - 100 | Top-K sampling parameter. |
| `candidateCount` | integer | 1 | 1 - 8 | Number of responses to generate. |
| `stopSequences` | array | null | - | Stop sequences for generation. |
| `responseMimeType` | string | "text/plain" | - | Response format ("application/json" for structured output). |
| `responseSchema` | object | null | - | JSON Schema for structured output. |

### safetySettings (Optional)

Configure content safety filters:

```typescript
interface SafetySetting {
  category: "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_HATE_SPEECH" |
            "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_DANGEROUS_CONTENT"
  threshold: "BLOCK_NONE" | "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" |
             "BLOCK_ONLY_HIGH" | "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
}
```

## Response Format

### GenerateContentResponse

```typescript
interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string
        functionCall?: {
          name: string
          args: object
        }
      }>
      role: string
    }
    finishReason: "STOP" | "MAX_TOKENS" | "SAFETY" | "RECITATION" | "OTHER"
    safetyRatings?: Array<{
      category: string
      probability: "NEGLIGIBLE" | "LOW" | "MEDIUM" | "HIGH"
    }>
    citationMetadata?: {
      citationSources: Array<{
        uri: string
        startIndex: number
        endIndex: number
      }>
    }
  }>
  usageMetadata: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
    cachedContentTokenCount?: number
  }
  promptFeedback?: {
    blockReason: string
    safetyRatings: Array<{ category: string; probability: string }>
  }
}
```

## Flagship Models

### Gemini 2.0 Flash (Fast)

| Property | Value |
|----------|-------|
| Model ID | `gemini-2.0-flash` |
| Context Window | 1,048,576 tokens (1M) |
| Max Output | 8,192 tokens |
| Input Price | $0.10 / 1M tokens |
| Output Price | $0.40 / 1M tokens |
| Multimodal | Yes (text, images, audio, video) |

### Gemini 1.5 Pro (Large Context)

| Property | Value |
|----------|-------|
| Model ID | `gemini-1.5-pro` |
| Context Window | 2,097,152 tokens (2M) |
| Max Output | 8,192 tokens |
| Input Price | $1.25 / 1M tokens |
| Output Price | $5.00 / 1M tokens |
| Multimodal | Yes (text, images, audio, video) |

### Gemini 2.5 Pro Preview (Latest)

| Property | Value |
|----------|-------|
| Model ID | `gemini-2.5-pro-preview-06-05` |
| Context Window | 1,048,576 tokens |
| Max Output | 65,536 tokens |
| Input Price | $1.25 / 1M tokens |
| Output Price | $10.00 / 1M tokens |

## Example Request

### Basic Chat Completion

```typescript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: 'Hello!' }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  }
);

const data = await response.json();
const text = data.candidates[0].content.parts.map(p => p.text).join('');
console.log(text);
```

### Streaming Example

```typescript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=' + apiKey + '&alt=sse',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: 'Tell me a story.' }] }
      ],
      generationConfig: { temperature: 0.7 },
    }),
  }
);

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
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith('data: ')) continue;

    const jsonStr = trimmed.slice(6);
    try {
      const chunk = JSON.parse(jsonStr);
      const text = chunk.candidates[0]?.content?.parts
        ?.map(p => p.text || '')
        .join('') || '';
      if (text) process.stdout.write(text);
    } catch {
      // Skip malformed JSON
    }
  }
}
```

### Multi-turn Conversation

```typescript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: 'What is the capital of France?' }] },
        { role: 'model', parts: [{ text: 'The capital of France is Paris.' }] },
        { role: 'user', parts: [{ text: 'What is its population?' }] },
      ],
    }),
  }
);
```

### Structured Output (JSON Mode)

```typescript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: 'List 3 popular programming languages.' }] }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            languages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  year: { type: 'integer' },
                },
                required: ['name', 'year'],
              },
            },
          },
          required: ['languages'],
        },
      },
    }),
  }
);

const data = await response.json();
const result = JSON.parse(data.candidates[0].content.parts[0].text);
```

### Vision Example (Image Analysis)

```typescript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'What is in this image?' },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64EncodedImage,
              },
            },
          ],
        },
      ],
    }),
  }
);
```

### Function Calling Example

```typescript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: 'What is the weather in Tokyo?' }] }
      ],
      tools: [
        {
          functionDeclarations: [
            {
              name: 'get_weather',
              description: 'Get the current weather in a location',
              parameters: {
                type: 'object',
                properties: {
                  location: {
                    type: 'string',
                    description: 'The city name',
                  },
                },
                required: ['location'],
              },
            },
          ],
        },
      ],
    }),
  }
);

const data = await response.json();
const functionCall = data.candidates[0].content.parts.find(
  p => p.functionCall
)?.functionCall;

if (functionCall) {
  console.log('Function:', functionCall.name);
  console.log('Arguments:', functionCall.args);
}
```

## Error Handling

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | INVALID_ARGUMENT | Invalid request parameters |
| 403 | PERMISSION_DENIED | API key invalid or quota exceeded |
| 404 | NOT_FOUND | Resource not found |
| 429 | RESOURCE_EXHAUSTED | Rate limit exceeded |
| 500 | INTERNAL | Server error |
| 503 | UNAVAILABLE | Service temporarily unavailable |

### Error Response Format

```json
{
  "error": {
    "code": 400,
    "message": "Invalid request",
    "status": "INVALID_ARGUMENT"
  }
}
```

## Rate Limits

Rate limits vary by model and plan:
- Free tier: 15 RPM, 1,500 RPD, 1M TPM
- Paid tier: 2,000 RPM, 4M TPM

Check quotas at: https://aistudio.google.com/apikey

## Best Practices

1. **Use appropriate models**: Flash for speed, Pro for quality and large context
2. **Leverage context caching**: Cache frequent prompts for cost savings
3. **Handle safety ratings**: Check safetyRatings for content filtering
4. **Use system instructions**: Set behavior via systemInstruction parameter
5. **Implement retry logic**: Use exponential backoff for rate limits

## Key Differences from OpenAI

1. **Role naming**: Use `"model"` instead of `"assistant"` in contents
2. **Auth method**: API key in query parameter, not Authorization header
3. **Message structure**: `contents` array with `parts` instead of `messages`
4. **Config placement**: Parameters in `generationConfig` object, not root
5. **Structured output**: Uses `responseSchema` with JSON Schema format
6. **Finish reason format**: UPPERCASE (e.g., `"STOP"`, `"MAX_TOKENS"`)

## References

- API Reference: https://ai.google.dev/tutorials/rest_quickstart
- Models: https://ai.google.dev/models/gemini
- Pricing: https://ai.google.dev/pricing
- Safety: https://ai.google.dev/docs/safety_setting_gemini
- Function Calling: https://ai.google.dev/tutorials/function_calling