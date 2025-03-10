import { logger } from './logger';

type Callback = (data: any) => void;

export class EventBus {
  private subscribers: Map<string, Callback[]>;

  constructor() {
    this.subscribers = new Map();
    logger.info('EventBus initialized');
  }

  subscribe(eventType: string, callback: Callback): void {
    const subscribers = this.subscribers.get(eventType) || [];
    subscribers.push(callback);
    this.subscribers.set(eventType, subscribers);
    logger.debug({ eventType }, 'Subscribed to event');
  }

  publish(eventType: string, data: any): void {
    const subscribers = this.subscribers.get(eventType) || [];
    subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error({ error, eventType }, 'Error in event handler');
      }
    });
    logger.debug({ eventType }, 'Published event');
  }
}
