import { EventBus } from '../../../core/event-bus';
    import { logger } from '../../../core/logger';

    export interface UserAction {
      type: 'click' | 'input';
      target: string;
      value?: string;
      timestamp: number;
    }

    export class UserActionRecorder {
      private eventBus: EventBus;
      private isRecording: boolean;
      private actions: UserAction[];

      constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.isRecording = false;
        this.actions = [];
        logger.info('UserActionRecorder module initialized');
      }

      startRecording() {
        if (this.isRecording) {
          logger.warn('Recording is already in progress');
          return;
        }
        this.isRecording = true;
        this.actions = []; // Clear previous actions
        document.addEventListener('click', this.handleAction);
        document.addEventListener('input', this.handleAction);
        logger.info('Recording started');
      }

      stopRecording() {
        if (!this.isRecording) {
          logger.warn('Recording is not in progress');
          return;
        }
        this.isRecording = false;
        document.removeEventListener('click', this.handleAction);
        document.removeEventListener('input', this.handleAction);
        logger.info('Recording stopped');
        this.eventBus.publish('recording:stopped', this.actions);
      }

      getActions(): UserAction[] {
        return [...this.actions]; // Return a copy to prevent external modification
      }

      private handleAction = (event: Event) => {
        if (!this.isRecording) return;

        try {
          let target = '';
          if (event.target instanceof Element) {
            target = event.target.outerHTML;
          }

          const action: UserAction = {
            type: event.type as 'click' | 'input',
            target,
            value: event.type === 'input' && event.target instanceof HTMLInputElement' ? event.target.value : undefined,
            timestamp: Date.now()
          };

          this.actions.push(action);
          this.eventBus.publish('action:recorded', action);
          logger.debug({ action }, 'User action recorded');
        } catch (error) {
          logger.error({ error }, 'Error recording user action');
          // Don't re-throw, allow other actions to be recorded
        }
      };
    }
