import { ActiveAISelector, AIAssistant } from '../ActiveAISelector';
    import { EventBus } from '../../../../core/event-bus';

    describe('ActiveAISelector', () => {
      let selector: ActiveAISelector;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        selector = new ActiveAISelector(eventBus);
      });

      const testAssistant: AIAssistant = {
        id: 'test-assistant',
        name: 'Test Assistant',
        capabilities: ['test'],
        status: 'inactive',
      };

      it('should register an assistant', () => {
        selector.registerAssistant(testAssistant);
        expect(selector.listAssistants()).toContainEqual(testAssistant);
      });

      it('should throw error when registering existing assistant', () => {
          selector.registerAssistant(testAssistant);
          expect(() => selector.registerAssistant(testAssistant)).toThrow("Assistant with ID test-assistant already exists.");
      });

      it('should set an assistant as active', () => {
        selector.registerAssistant(testAssistant);
        expect(selector.setActiveAssistant('test-assistant')).toBe(true);
        expect(selector.getActiveAssistant()).toEqual(testAssistant);
      });

      it('should return false when setting a non-existent assistant as active', () => {
        expect(selector.setActiveAssistant('non-existent')).toBe(false);
      });

      it('should return null when there is no active assistant', () => {
        expect(selector.getActiveAssistant()).toBeNull();
      });

      it('should update the status of an assistant', () => {
        selector.registerAssistant(testAssistant);
        selector.updateAssistantStatus('test-assistant', 'active');
        const updatedAssistant = selector.listAssistants()[0];
        expect(updatedAssistant.status).toBe('active');
      });

      it('should not update status of non-existent assistant', () => {
          selector.updateAssistantStatus('non-existent', 'active');
          expect(selector.listAssistants()).toEqual([]);
      });

      it('should return null when active assistant is not found', () => {
          selector.setActiveAssistant('test-assistant');
          selector['assistants'] = new Map(); // Simulate assistant not found
          expect(selector.getActiveAssistant()).toBeNull();
      });
    });
