import { EventBus } from '../../../core/event-bus';
    import { logger } from '../../../core/logger';

    export interface Selection {
      text: string;
      start: number;
      end: number;
      source: string;
    }

    export class TextSelector {
      private eventBus: EventBus;
      private currentSelection: Selection | null;

      constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.currentSelection = null;
        logger.info('TextSelector module initialized');
      }

      setSelection(selection: Selection): void {
        if (!this.validateSelection(selection)) {
          return; // Don't set invalid selection
        }
        this.currentSelection = selection;
        this.eventBus.publish('selector:text:selected', selection);
        logger.debug({ selection }, 'Text selection updated');
      }

      clearSelection(): void {
        this.currentSelection = null;
        this.eventBus.publish('selector:text:cleared', {});
        logger.debug('Text selection cleared');
      }

      getCurrentSelection(): Selection | null {
        return this.currentSelection;
      }

      validateSelection(selection: Selection): boolean {
        const isValid = selection.text.length > 0 &&
          selection.start >= 0 &&
          selection.end > selection.start &&
          selection.source.length > 0;

        if (!isValid) {
          logger.warn({ selection }, 'Invalid text selection');
          this.eventBus.publish('selector:validation:failed', selection);
        }

        return isValid;
      }
    }
