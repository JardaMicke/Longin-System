import { TextSelector, Selection } from '../TextSelector';
    import { EventBus } from '../../../../core/event-bus';

    describe('TextSelector', () => {
      let selector: TextSelector;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        selector = new TextSelector(eventBus);
      });

      const validSelection: Selection = {
        text: 'test',
        start: 0,
        end: 4,
        source: 'test-source',
      };

      it('should set a valid selection', () => {
        selector.setSelection(validSelection);
        expect(selector.getCurrentSelection()).toEqual(validSelection);
      });

      it('should clear the current selection', () => {
        selector.setSelection(validSelection);
        selector.clearSelection();
        expect(selector.getCurrentSelection()).toBeNull();
      });

      it('should validate a valid selection', () => {
        expect(selector.validateSelection(validSelection)).toBe(true);
      });

      it('should invalidate a selection with empty text', () => {
        const invalidSelection = { ...validSelection, text: '' };
        expect(selector.validateSelection(invalidSelection)).toBe(false);
      });

      it('should invalidate a selection with negative start', () => {
        const invalidSelection = { ...validSelection, start: -1 };
        expect(selector.validateSelection(invalidSelection)).toBe(false);
      });

      it('should invalidate a selection with end <= start', () => {
        const invalidSelection = { ...validSelection, end: 0 };
        expect(selector.validateSelection(invalidSelection)).toBe(false);
      });

      it('should invalidate a selection with empty source', () => {
        const invalidSelection = { ...validSelection, source: '' };
        expect(selector.validateSelection(invalidSelection)).toBe(false);
      });

      it('should not set an invalid selection', () => {
          const invalidSelection = { ...validSelection, text: '' };
          selector.setSelection(invalidSelection);
          expect(selector.getCurrentSelection()).toBeNull();
      });
    });
