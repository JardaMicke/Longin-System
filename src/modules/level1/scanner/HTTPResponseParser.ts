import { EventBus } from '../../../core/event-bus';
    import { logger } from '../../../core/logger';
    import { z, ZodError } from 'zod';

    const ResponseSchema = z.object({
      status: z.number(),
      headers: z.record(z.string()),
      body: z.unknown(),
    });

    export class HTTPResponseParser {
      private eventBus: EventBus;

      constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        logger.info('HTTPResponseParser module initialized');
      }

      async parseResponse(response: Response): Promise<z.infer<typeof ResponseSchema>> {
        if (!response) {
          const error = new Error("Response cannot be undefined.");
          logger.error({ error }, 'Invalid response object');
          this.eventBus.publish('parser:error', { error });
          throw error;
        }
        try {
          const parsedResponse = {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: await this.parseBody(response.clone()),
          };

          const validatedResponse = ResponseSchema.parse(parsedResponse);
          this.eventBus.publish('parser:response:parsed', validatedResponse);
          logger.debug({ status: response.status }, 'Response parsed successfully');

          return validatedResponse;
        } catch (error) {
          if (error instanceof ZodError) {
            logger.error({ error: error.format() }, 'Response validation error');
          } else {
            logger.error({ error }, 'Response parsing error');
          }
          this.eventBus.publish('parser:error', { error });
          throw error; // Re-throw for higher-level handling
        }
      }

      private async parseBody(response: Response): Promise<unknown> {
        const contentType = response.headers.get('content-type') || '';

        try {
          if (contentType.includes('application/json')) {
            return await response.json();
          } else if (contentType.includes('text/html')) {
            return await response.text();
          } else if (contentType.includes('text/plain')) {
            return await response.text();
          } else {
            return await response.blob(); // Default to Blob
          }
        } catch (error) {
          logger.error({ error, contentType }, 'Error parsing response body');
          throw error; // Re-throw for consistent error handling
        }
      }
    }
