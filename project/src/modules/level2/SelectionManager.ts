import { EventBus } from '../../core/event-bus';
import { logger } from '../../core/logger';
import { TextSelector, Selection } from '../level1/ui/TextSelector';
import { ActiveAISelector, AIAssistant } from '../level1/ui/ActiveAISelector';

export interface SelectionContext {
  selection: Selection;
  assistant: AIAssistant | null;
  timestamp: number;
}

export class SelectionManager {
  private eventBus: EventBus;
  private textSelector: TextSelector;
  private aiSelector: ActiveAISelector;
  private selectionHistory: SelectionContext[];
  private maxHistorySize: number;

  constructor(eventBus: EventBus, maxHistorySize: number = 50) {
    this.eventBus = eventBus;
    this.textSelector = new TextSelector(eventBus);
    this.aiSelector = new ActiveAISelector(eventBus);
    this.selectionHistory = [];
    this.maxHistorySize = maxHistorySize;

    this.initializeEventListeners();
    logger.info('SelectionManager initialized');
  }

  private initializeEventListeners(): void {
    this.eventBus.subscribe('selector:text:selected', (selection) => {
      this.handleNewSelection(selection);
    });

    this.eventBus.subscribe('ai:assistant:activated', (assistant) => {
      this.handleAssistantChange(assistant);
    });
  }

  private handleNewSelection(selection: Selection): void {
    if (this.textSelector.validateSelection(selection)) {
      const context: SelectionContext = {
        selection,
        assistant: this.aiSelector.getActiveAssistant(),
        timestamp: Date.now()
      };

      this.addToHistory(context);
      this.eventBus.publish('selection:context:created', context);
      logger.debug({ context }, 'New selection context created');
    }
  }

  private handleAssistantChange(assistant: AIAssistant): void {
    const currentSelection = this.textSelector.getCurrentSelection();
    if (currentSelection) {
      const context: SelectionContext = {
        selection: currentSelection,
        assistant,
        timestamp: Date.now()
      };

      this.addToHistory(context);
      this.eventBus.publish('selection:assistant:changed', context);
      logger.debug({ context }, 'Selection context updated with new assistant');
    }
  }

  private addToHistory(context: SelectionContext): void {
    this.selectionHistory.unshift(context);
    if (this.selectionHistory.length > this.maxHistorySize) {
      this.selectionHistory.pop();
    }
  }

  getCurrentContext(): SelectionContext | null {
    const selection = this.textSelector.getCurrentSelection();
    if (!selection) return null;

    return {
      selection,
      assistant: this.aiSelector.getActiveAssistant(),
      timestamp: Date.now()
    };
  }

  getSelectionHistory(): SelectionContext[] {
    return [...this.selectionHistory];
  }

  clearHistory(): void {
    this.selectionHistory = [];
    logger.info('Selection history cleared');
  }

  setActiveAssistant(assistantId: string): boolean {
    return this.aiSelector.setActiveAssistant(assistantId);
  }

  registerAssistant(assistant: AIAssistant): void {
    this.aiSelector.registerAssistant(assistant);
  }
}
