import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OpenAIAdapter } from './openai'
import type { LLMModel, ProviderAdapterContext, ChatMessage } from '../types'
import { LLMError } from '../types'

describe('OpenAIAdapter', () => {
  let adapter: OpenAIAdapter
  let mockModel: LLMModel
  let mockContext: ProviderAdapterContext

  beforeEach(() => {
    adapter = new OpenAIAdapter()
    mockModel = {
      id: 'gpt-4o',
      providerId: 'openai',
      modelId: 'gpt-4o',
      displayName: 'GPT-4o',
      capabilities: {
        streaming: true,
        structured_output: true,
        vision: true,
      },
      contextWindow: 128000,
      maxOutputTokens: 4096,
      inputPricePer1k: 0.005,
      outputPricePer1k: 0.015,
      supportedParams: [
        'temperature',
        'max_tokens',
        'top_p',
        'frequency_penalty',
        'presence_penalty',
      ],
    }
    mockContext = {
      apiKey: 'test-api-key',
      model: mockModel,
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should have correct providerId', () => {
      expect(adapter.providerId).toBe('openai')
    })

    it('should have correct capabilities', () => {
      expect(adapter.capabilities).toEqual({
        streaming: true,
        structured_output: true,
        vision: true,
        audio: true,
      })
    })
  })

  describe('chat', () => {
    const mockMessages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' },
    ]

    it('should return chat response on success', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Hello! How can I help you?',
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 20,
          completion_tokens: 10,
          total_tokens: 30,
        },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await adapter.chat({ messages: mockMessages }, mockContext)

      expect(result.content).toBe('Hello! How can I help you?')
      expect(result.model).toBe('gpt-4o')
      expect(result.usage?.inputTokens).toBe(20)
      expect(result.usage?.outputTokens).toBe(10)
      expect(result.finishReason).toBe('stop')
    })

    it('should use custom model from options', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Response' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await adapter.chat(
        { messages: mockMessages, model: 'gpt-3.5-turbo' },
        mockContext
      )

      expect(result.model).toBe('gpt-3.5-turbo')

      // Verify request body
      const fetchCall = vi.mocked(fetch).mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1]?.body as string)
      expect(requestBody.model).toBe('gpt-3.5-turbo')
    })

    it('should pass temperature and other options', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Response' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await adapter.chat(
        {
          messages: mockMessages,
          temperature: 0.5,
          maxTokens: 100,
          topP: 0.9,
        },
        mockContext
      )

      const requestBody = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string)
      expect(requestBody.temperature).toBe(0.5)
      expect(requestBody.max_tokens).toBe(100)
      expect(requestBody.top_p).toBe(0.9)
    })

    it('should use custom baseUrl when provided', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Response' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const customContext = {
        ...mockContext,
        baseUrl: 'https://custom.openai.com/v1',
      }

      await adapter.chat({ messages: mockMessages }, customContext)

      const fetchCall = vi.mocked(fetch).mock.calls[0]
      expect(fetchCall[0]).toBe('https://custom.openai.com/v1/chat/completions')
    })

    it('should throw INVALID_API_KEY on 401', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      } as Response)

      try {
        await adapter.chat({ messages: mockMessages }, mockContext)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(LLMError)
        expect((error as LLMError).code).toBe('INVALID_API_KEY')
      }
    })

    it('should throw RATE_LIMITED on 429', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limit exceeded',
      } as Response)

      try {
        await adapter.chat({ messages: mockMessages }, mockContext)
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as LLMError).code).toBe('RATE_LIMITED')
      }
    })

    it('should throw CONTEXT_TOO_LONG on 400 with context error', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'context length exceeded',
      } as Response)

      try {
        await adapter.chat({ messages: mockMessages }, mockContext)
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as LLMError).code).toBe('CONTEXT_TOO_LONG')
      }
    })

    it('should throw CONTENT_FILTERED on 400 with filter error', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'content filtered',
      } as Response)

      try {
        await adapter.chat({ messages: mockMessages }, mockContext)
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as LLMError).code).toBe('CONTENT_FILTERED')
      }
    })

    it('should map finish_reason correctly', async () => {
      const testCases = [
        { finish_reason: 'stop', expected: 'stop' },
        { finish_reason: 'length', expected: 'length' },
        { finish_reason: 'content_filter', expected: 'content_filter' },
        { finish_reason: null, expected: 'stop' },
      ]

      for (const { finish_reason, expected } of testCases) {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 'chatcmpl-123',
            object: 'chat.completion',
            created: 1700000000,
            model: 'gpt-4o',
            choices: [
              {
                index: 0,
                message: { role: 'assistant', content: 'Response' },
                finish_reason,
              },
            ],
            usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
          }),
        } as Response)

        const result = await adapter.chat({ messages: mockMessages }, mockContext)
        expect(result.finishReason).toBe(expected)
      }
    })
  })

  describe('chatStream', () => {
    const mockMessages: ChatMessage[] = [{ role: 'user', content: 'Hello!' }]

    it('should yield content chunks from stream', async () => {
      const mockStreamData = [
        'data: {"id":"chatcmpl-123","choices":[{"delta":{"content":"Hello"}}]}\n\n',
        'data: {"id":"chatcmpl-123","choices":[{"delta":{"content":" there"}}]}\n\n',
        'data: {"id":"chatcmpl-123","choices":[{"delta":{},"finish_reason":"stop"}]}\n\n',
        'data: [DONE]\n\n',
      ]

      const mockReader = {
        read: vi
          .fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[0]),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[1]),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[2]),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[3]),
          })
          .mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: vi.fn(),
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => mockReader },
      } as unknown as Response)

      const chunks: string[] = []
      for await (const chunk of adapter.chatStream({ messages: mockMessages }, mockContext)) {
        if (chunk.delta) {
          chunks.push(chunk.delta)
        }
      }

      expect(chunks).toEqual(['Hello', ' there'])
    })

    it('should yield usage in final chunk when available', async () => {
      const mockStreamData = [
        'data: {"id":"chatcmpl-123","choices":[{"delta":{"content":"Hi"}}]}\n\n',
        'data: {"id":"chatcmpl-123","choices":[],"usage":{"prompt_tokens":10,"completion_tokens":5}}\n\n',
        'data: [DONE]\n\n',
      ]

      const mockReader = {
        read: vi
          .fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[0]),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[1]),
          })
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(mockStreamData[2]),
          })
          .mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: vi.fn(),
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => mockReader },
      } as unknown as Response)

      const chunks = []
      for await (const chunk of adapter.chatStream({ messages: mockMessages }, mockContext)) {
        chunks.push(chunk)
      }

      const usageChunk = chunks.find((c) => c.usage)
      expect(usageChunk?.usage).toEqual({
        inputTokens: 10,
        outputTokens: 5,
      })
    })

    it('should throw error on non-ok response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      } as Response)

      const generator = adapter.chatStream({ messages: mockMessages }, mockContext)
      const iterator = generator[Symbol.asyncIterator]()

      await expect(iterator.next()).rejects.toThrow(LLMError)
    })

    it('should throw error when no response body', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: null,
      } as Response)

      const generator = adapter.chatStream({ messages: mockMessages }, mockContext)
      const iterator = generator[Symbol.asyncIterator]()

      await expect(iterator.next()).rejects.toThrow('No response body')
    })

    it('should set stream_options for usage tracking', async () => {
      const mockReader = {
        read: vi.fn().mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: vi.fn(),
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => mockReader },
      } as unknown as Response)

      const generator = adapter.chatStream({ messages: mockMessages }, mockContext)
      const iterator = generator[Symbol.asyncIterator]()
      // Iterate the generator to trigger the fetch call
      await iterator.next()

      const fetchCall = vi.mocked(fetch).mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1]?.body as string)
      expect(requestBody.stream).toBe(true)
      expect(requestBody.stream_options).toEqual({ include_usage: true })
    })

    it('should release reader lock after streaming', async () => {
      const mockReader = {
        read: vi.fn().mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: vi.fn(),
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: { getReader: () => mockReader },
      } as unknown as Response)

      const generator = adapter.chatStream({ messages: mockMessages }, mockContext)
      const iterator = generator[Symbol.asyncIterator]()
      await iterator.next()

      expect(mockReader.releaseLock).toHaveBeenCalled()
    })
  })

  describe('structuredOutput', () => {
    const mockMessages: ChatMessage[] = [{ role: 'user', content: 'Extract info' }]

    const testSchema = {
      type: 'object' as const,
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
    }

    it('should return parsed JSON from response', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: '{"name":"John","age":30}',
            },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await adapter.structuredOutput(
        { messages: mockMessages, schema: testSchema },
        mockContext
      )

      expect(result).toEqual({ name: 'John', age: 30 })
    })

    it('should include json_schema in request body', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: '{"name":"Jane","age":25}' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await adapter.structuredOutput(
        {
          messages: mockMessages,
          schema: testSchema,
          schemaName: 'person',
        },
        mockContext
      )

      const requestBody = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string)
      expect(requestBody.response_format).toEqual({
        type: 'json_schema',
        json_schema: {
          name: 'person',
          strict: true,
          schema: testSchema,
        },
      })
    })

    it('should throw error on empty response', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: null },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await expect(
        adapter.structuredOutput({ messages: mockMessages, schema: testSchema }, mockContext)
      ).rejects.toThrow('Empty response')
    })

    it('should throw error on invalid JSON response', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1700000000,
        model: 'gpt-4o',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'not valid json' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await expect(
        adapter.structuredOutput({ messages: mockMessages, schema: testSchema }, mockContext)
      ).rejects.toThrow('Failed to parse structured output')
    })
  })

  describe('validateApiKey', () => {
    it('should return true on successful models fetch', async () => {
      const mockResponse = {
        data: [{ id: 'gpt-4o', object: 'model', created: 1700000000, owned_by: 'openai' }],
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await adapter.validateApiKey('test-key', { apiKey: 'test-key' })

      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      } as Response)

      const result = await adapter.validateApiKey('invalid-key', { apiKey: 'invalid-key' })

      expect(result).toBe(false)
    })
  })

  describe('getModels', () => {
    it('should return filtered models', async () => {
      const mockResponse = {
        data: [
          { id: 'gpt-4o', object: 'model', created: 1700000000, owned_by: 'openai' },
          { id: 'gpt-4o-mini', object: 'model', created: 1700000000, owned_by: 'openai' },
          { id: 'gpt-3.5-turbo', object: 'model', created: 1700000000, owned_by: 'openai' },
          { id: 'davinci-002', object: 'model', created: 1700000000, owned_by: 'openai' },
          { id: 'whisper-1', object: 'model', created: 1700000000, owned_by: 'openai' },
        ],
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const models = await adapter.getModels({ apiKey: 'test-key' })

      // Should filter to known model families
      expect(models.some((m) => m.modelId === 'gpt-5.4')).toBe(true)
      expect(models.some((m) => m.modelId === 'gpt-5-mini')).toBe(true)
      expect(models.some((m) => m.modelId === 'davinci-002')).toBe(false)
      expect(models.some((m) => m.modelId === 'whisper-1')).toBe(false)
    })

    it('should set correct provider capabilities', async () => {
      const mockResponse = {
        data: [{ id: 'gpt-4o', object: 'model', created: 1700000000, owned_by: 'openai' }],
      }

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const models = await adapter.getModels({ apiKey: 'test-key' })

      expect(models[0].capabilities).toEqual({
        streaming: true,
        structured_output: true,
        vision: true,
        audio: true,
      })
    })
  })
})
