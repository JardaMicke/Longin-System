import { HTTPResponseParser } from '../HTTPResponseParser';
    import { EventBus } from '../../../../core/event-bus';
    import { Response } from 'node-fetch';

    describe('HTTPResponseParser', () => {
      let parser: HTTPResponseParser;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        parser = new HTTPResponseParser(eventBus);
      });

      it('should parse JSON response', async () => {
        const response = new Response(JSON.stringify({ key: 'value' }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        });
        const parsed = await parser.parseResponse(response as any);
        expect(parsed.body).toEqual({ key: 'value' });
        expect(parsed.status).toBe(200);
      });

      it('should parse HTML response', async () => {
        const response = new Response('<html><body>Hello</body></html>', {
          headers: { 'content-type': 'text/html' },
          status: 200,
        });
        const parsed = await parser.parseResponse(response as any);
        expect(parsed.body).toBe('<html><body>Hello</body></html>');
      });

      it('should parse text response', async () => {
        const response = new Response('Hello, world!', {
          headers: { 'content-type': 'text/plain' },
          status: 200,
        });
        const parsed = await parser.parseResponse(response as any);
        expect(parsed.body).toBe('Hello, world!');
      });

      it('should handle unknown content type as Blob', async () => {
        const response = new Response('Some binary data', {
          headers: { 'content-type': 'application/octet-stream' },
          status: 200,
        });
        const parsed = await parser.parseResponse(response as any);
        expect(parsed.body).toBeInstanceOf(Blob);
      });

      it('should handle invalid response object', async () => {
          await expect(parser.parseResponse(undefined as any)).rejects.toThrow("Response cannot be undefined.");
      });

      it('should handle JSON parsing error', async () => {
        const response = new Response('invalid json', {
          headers: { 'content-type': 'application/json' },
          status: 200,
        });
        await expect(parser.parseResponse(response as any)).rejects.toThrow();
      });

      it('should handle Zod validation error', async () => {
        const response = new Response(JSON.stringify({ invalid: 'data' }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        });
        await expect(parser.parseResponse(response as any)).rejects.toThrow();
      });
    });
