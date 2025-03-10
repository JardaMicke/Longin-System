import { QueryManager, Query } from '../QueryManager';
    import { EventBus } from '../../../core/event-bus';
    import { AIAssistant } from '../../level1/ui/ActiveAISelector';

    describe('QueryManager', () => {
      let queryManager: QueryManager;
      let eventBus: EventBus;
      const testAssistant: AIAssistant = { id: 'test-ai', name: 'Test AI', capabilities: [], status: 'active' };

      beforeEach(() => {
        eventBus = new EventBus();
        queryManager = new QueryManager(eventBus);
      });

      it('should submit a query', async () => {
        const queryId = await queryManager.submitQuery('Test query', testAssistant);
        expect(queryId).toBeDefined();
        expect(queryManager.getQuery(queryId)).toBeDefined();
      });

      it('should process a query', async () => {
        const queryId = await queryManager.submitQuery('Test query', testAssistant);
        await new Promise(resolve => setTimeout(resolve, 1100)); // Wait for processing
        const query = queryManager.getQuery(queryId);
        expect(query?.status).toBe('completed');
        expect(query?.response).toEqual({ answer: 'Simulated response' });
      });

      it('should handle query errors', async () => {
        const mockError = new Error('Simulated error');
        jest.spyOn(global, 'setTimeout').mockImplementation(() => { throw mockError; });

        const queryId = await queryManager.submitQuery('Test query', testAssistant);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow promise to resolve
        const query = queryManager.getQuery(queryId);
        expect(query?.status).toBe('error');

        // Restore the original setTimeout implementation
        jest.restoreAllMocks();
      });

      it('should queue queries if max concurrent queries are reached', async () => {
        queryManager = new QueryManager(eventBus, 1); // Set max concurrent queries to 1
        const queryId1 = await queryManager.submitQuery('Query 1', testAssistant);
        const queryId2 = await queryManager.submitQuery('Query 2', testAssistant);

        expect(queryManager.getActiveQueries().length).toBe(1);
        expect(queryManager.getPendingQueries().length).toBe(1);
      });

      it('should process the next query after one completes', async () => {
        queryManager = new QueryManager(eventBus, 1);
        const queryId1 = await queryManager.submitQuery('Query 1', testAssistant);
        const queryId2 = await queryManager.submitQuery('Query 2', testAssistant);

        await new Promise(resolve => setTimeout(resolve, 1100)); // Wait for first query

        expect(queryManager.getActiveQueries().length).toBe(1); // Second query should be active
        expect(queryManager.getPendingQueries().length).toBe(0);
      });

      it('should clear all queries', async () => {
        await queryManager.submitQuery('Test query', testAssistant);
        queryManager.clearQueries();
        expect(queryManager.getAllQueries().length).toBe(0);
      });

      it('should get all queries', async () => {
          await queryManager.submitQuery('Test query', testAssistant);
          expect(queryManager.getAllQueries().length).toBeGreaterThan(0);
      });

      it('should get pending queries', async () => {
          await queryManager.submitQuery('Test query', testAssistant);
          expect(queryManager.getPendingQueries().length).toBeGreaterThan(0);
      });

      it('should get active queries', async () => {
          await queryManager.submitQuery('Test query', testAssistant);
          expect(queryManager.getActiveQueries().length).toBeGreaterThan(0);
      });
    });
