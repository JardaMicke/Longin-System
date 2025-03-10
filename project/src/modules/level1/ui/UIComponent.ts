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
    this.components.set(config.id, config);
    this.eventBus.publish('ui:component:created', config);
    logger.debug({ componentId: config.id, type: config.type }, 'UI component created');
  }

  updateComponent(id: string, updates: Partial<UIComponentConfig>): void {
    const component = this.components.get(id);
    if (component) {
      const updated = { ...component, ...updates };
      this.components.set(id, updated);
      this.eventBus.publish('ui:component:updated', updated);
      logger.debug({ componentId: id, updates }, 'UI component updated');
    }
  }

  removeComponent(id: string): void {
    if (this.components.delete(id)) {
      this.eventBus.publish('ui:component:removed', { id });
      logger.debug({ componentId: id }, 'UI component removed');
    }
  }

  getComponent(id: string): UIComponentConfig | undefined {
    return this.components.get(id);
  }
}
