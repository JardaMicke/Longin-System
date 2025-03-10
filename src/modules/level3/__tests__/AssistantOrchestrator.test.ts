import { AssistantOrchestrator } from '../AssistantOrchestrator';
    import { EventBus } from '../../../core/event-bus';
    import { AIAssistant } from '../../level1/ui/ActiveAISelector';
    import { Query } from '../../level2/QueryManager';

    describe('AssistantOrchestrator', () => {
      let orchestrator: AssistantOrchestrator;
      let eventBus: EventBus;

      const testAssistant: AIAssistant = { id: 'test-ai', name: 'Test AI', capabilities: [], status: 'active' };
      const testQuery: Query = {
        id: 'test-query',
        text: 'Test query',
        assistant: testAssistant,
        timestamp: Date.now(),
        status: 'pending',
      };

      beforeEach(() => {
        eventBus = new EventBus();
        orchestrator = new AssistantOrchestrator(eventBus);
      });

      it('should register an assistant', () => {
        orchestrator.registerAssistant(testAssistant);
        // @ts-ignore - Accessing private property for testing
        expect(orchestrator.assistants.get(testAssistant.id)).toEqual(testAssistant);
      });

      it('should handle a query', async () => {
        orchestrator.registerAssistant(testAssistant);
        const publishSpy = jest.spyOn(eventBus, 'publish');
        // @ts-ignore - Accessing private method for testing
        await orchestrator.handleQuery(testQuery);
        expect(publishSpy).toHaveBeenCalledWith('orchestrator:response', {
          queryId: testQuery.id,
          response: 'Mock response',
        });
      });

      it('should handle query errors', async () => {
        orchestrator.registerAssistant(testAssistant);
        const publishSpy = jest.spyOn(eventBus, 'publish');
        // @ts-ignore - Mocking the distributeQuery method to throw an error
        orchestrator.distributeQuery = jest.fn().mockRejectedValue(new Error('Test error'));
        // @ts-ignore - Accessing private method for testing
        await orchestrator.handleQuery(testQuery);
        expect(publishSpy).toHaveBeenCalledWith('orchestrator:error', {
          queryId: testQuery.id,
          error: 'Test error',
        });
      });

      it('should not handle query if assistant not found', async () => {
        const publishSpy = jest.spyOn(eventBus, 'publish');
        // @ts-ignore - Accessing private method for testing
        await orchestrator.handleQuery(testQuery);
        expect(publishSpy).toHaveBeenCalledWith('orchestrator:error', {
          queryId: testQuery.id,
          error: 'Assistant test-ai not found',
        });
      });
    });
