import { EventBus } from '../../../core/event-bus';
import { logger } from '../../../core/logger';

export interface AIAssistant {
  id: string;
  name: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
}

export class ActiveAISelector {
  private eventBus: EventBus;
  private assistants: Map<string, AIAssistant>;
  private activeAssistant: string | null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.assistants = new Map();
    this.activeAssistant = null;
    logger.info('ActiveAISelector module initialized');
  }

  registerAssistant(assistant: AIAssistant): void {
    this.assistants.set(assistant.id, assistant);
    this.eventBus.publish('ai:assistant:registered', assistant);
    logger.debug({ assistantId: assistant.id }, 'AI assistant registered');
  }

  setActiveAssistant(assistantId: string): boolean {
    if (this.assistants.has(assistantId)) {
      this.activeAssistant = assistantId;
      const assistant = this.assistants.get(assistantId);
      this.eventBus.publish('ai:assistant:activated', assistant);
      logger.info({ assistantId }, 'Active AI assistant changed');
      return true;
    }
    logger.warn({ assistantId }, 'Attempted to activate non-existent AI assistant');
    return false;
  }

  getActiveAssistant(): AIAssistant | null {
    return this.activeAssistant ? this.assistants.get(this.activeAssistant) || null : null;
  }

  listAssistants(): AIAssistant[] {
    return Array.from(this.assistants.values());
  }

  updateAssistantStatus(assistantId: string, status: AIAssistant['status']): void {
    const assistant = this.assistants.get(assistantId);
    if (assistant) {
      assistant.status = status;
      this.assistants.set(assistantId, assistant);
      this.eventBus.publish('ai:assistant:status:updated', { assistantId, status });
      logger.debug({ assistantId, status }, 'AI assistant status updated');
    }
  }
}
