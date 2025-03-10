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
        if (this.assistants.has(assistant.id)) {
          const error = new Error(`Assistant with ID ${assistant.id} already exists.`);
          logger.error({ error, assistantId: assistant.id }, 'Failed to register assistant');
          this.eventBus.publish('ai:assistant:registration:failed', { assistantId: assistant.id, error });
          throw error;
        }
        this.assistants.set(assistant.id, assistant);
        this.eventBus.publish('ai:assistant:registered', assistant);
        logger.debug({ assistantId: assistant.id }, 'AI assistant registered');
      }

      setActiveAssistant(assistantId: string): boolean {
        if (!this.assistants.has(assistantId)) {
          logger.warn({ assistantId }, 'Attempted to activate non-existent AI assistant');
          this.eventBus.publish('ai:assistant:activation:failed', { assistantId });
          return false;
        }
        this.activeAssistant = assistantId;
        const assistant = this.assistants.get(assistantId);
        this.eventBus.publish('ai:assistant:activated', assistant);
        logger.info({ assistantId }, 'Active AI assistant changed');
        return true;
      }

      getActiveAssistant(): AIAssistant | null {
        if (!this.activeAssistant) {
          return null;
        }
        const assistant = this.assistants.get(this.activeAssistant);
        if (!assistant) {
          logger.error({ assistantId: this.activeAssistant }, 'Active assistant not found');
          this.activeAssistant = null; // Reset active assistant
          return null;
        }
        return assistant;
      }

      listAssistants(): AIAssistant[] {
        return Array.from(this.assistants.values());
      }

      updateAssistantStatus(assistantId: string, status: AIAssistant['status']): void {
        const assistant = this.assistants.get(assistantId);
        if (!assistant) {
          logger.warn({ assistantId, status }, 'Attempted to update status of non-existent AI assistant');
          this.eventBus.publish('ai:assistant:status:update:failed', { assistantId, status });
          return;
        }
        assistant.status = status;
        this.assistants.set(assistantId, assistant);
        this.eventBus.publish('ai:assistant:status:updated', { assistantId, status });
        logger.debug({ assistantId, status }, 'AI assistant status updated');
      }
    }
