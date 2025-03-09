import { EventBus } from '../core/event-bus';

export const mockEventBus = new EventBus();

export const createTestAssistant = (id: string): any => ({
  id,
  name: `Test Assistant ${id}`,
  capabilities: ['test'],
  status: 'active'
});
