
    import { SelectionManager, SelectionContext } from '../SelectionManager';
    import { EventBus } from '../../../core/event-bus';
    import { TextSelector, Selection } from '../../level1/ui/TextSelector';
    import { ActiveAISelector, AIAssistant } from '../../level1/ui/ActiveAISelector';

    describe('SelectionManager', () => {
      let selectionManager: SelectionManager;
      let eventBus: EventBus;
      let textSelector: TextSelector;
      let aiSelector: ActiveAISelector;

      const testSelection: Selection = { text: 'test', start: 0, end: 4, source: 'test' };
      const testAssistant: AIAssistant = { id: 'test-ai', name: 'Test AI', capabilities: [], status: 'active' };

      beforeEach(() => {
        eventBus = new EventBus();
        selectionManager = new SelectionManager(eventBus);
        textSelector = new TextSelector(eventBus);
        aiSelector = new ActiveAISelector(eventBus);

        // Mock the methods of TextSelector and ActiveAISelector
        jest.spyOn(textSelector, 'getCurrentSelection').mockReturnValue(testSelection);
        jest.spyOn(aiSelector, 'getActiveAssistant').mockReturnValue(testAssistant);
        jest.spyOn(textSelector, 'validateSelection').mockReturnValue(true);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should create a new selection context', () => {
        selectionManager['handleNewSelection'](testSelection); // Call private method directly
        expect(selectionManager.getSelectionHistory().length).toBe(1);
        expect(selectionManager.getSelectionHistory()[0].selection).toEqual(testSelection);
        expect(selectionManager.getSelectionHistory()[0].assistant).toEqual(testAssistant);
      });

      it('should update selection context with new assistant', () => {
        selectionManager['handleNewSelection'](testSelection);
        const newAssistant: AIAssistant = { id: 'new-ai', name: 'New AI', capabilities: [], status: 'active' };
        jest.spyOn(aiSelector, 'getActiveAssistant').mockReturnValue(newAssistant);

        selectionManager['handleAssistantChange'](newAssistant);
        expect(selectionManager.getSelectionHistory().length).toBe(2);
        expect(selectionManager.getSelectionHistory