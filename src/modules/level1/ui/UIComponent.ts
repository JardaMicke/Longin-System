import { EventBus } from '../../../core/event-bus';
    import { logger } from '../../../core/logger';

    export interface UIComponentConfig {
      id: string;
      type: 'button' | 'input' | 'select' | 'list';
      label?: string;
      value?: string;
      options?: string[];
    }

    export class UIComponent {
      private eventBus: EventBus;
      private components: Map<string, UIComponentConfig>;

      constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.components = new Map();
        logger.info('UIComponent module initialized');
      }

      createComponent(config: UIComponentConfig): void {
        if (this.components.has(config.id)) {
          const error = new Error(`Component with ID ${config.id} already exists.`);
          logger.error({ error, componentId: config.id }, 'Failed to create component');
          this.eventBus.publish('ui:component:creation:failed', { componentId: config.id, error });
          throw error;
        }
        this.components.set(config.id, config);
        this.eventBus.publish('ui:component:created', config);
        logger.debug({ componentId: config.id, type: config.type }, 'UI component created');
      }

      updateComponent(id: string, updates: Partial<UIComponentConfig>): void {
        const component = this.components.get(id);
        if (!component) {
          logger.warn({ componentId: id }, 'Attempted to update non-existent UI component');
          this.eventBus.publish('ui:component:update:failed', { componentId: id });
          return;
        }
        const updated = { ...component, ...updates };
        this.components.set(id, updated);
        this.eventBus.publish('ui:component:updated', updated);
        logger.debug({ componentId: id, updates }, 'UI component updated');
      }

      removeComponent(id: string): void {
        if (!this.components.has(id)) {
            logger.warn({ componentId: id }, 'Attempted to remove non-existent UI component');
            this.eventBus.publish('ui:component:removal:failed', { componentId: id });
            return;
        }
        if (this.components.delete(id)) {
          this.eventBus.publish('ui:component:removed', { id });
          logger.debug({ componentId: id }, 'UI component removed');
        }
      }

      getComponent(id: string): UIComponentConfig | undefined {
        const component = this.components.get(id);
        if (!component) {
          logger.warn({ componentId: id }, 'Attempted to get non-existent UI component');
        }
        return component;
      }
    }
