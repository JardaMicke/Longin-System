import { EventBus } from '../../../core/event-bus';
import { logger } from '../../../core/logger';

interface StoredFile {
  id: string;
  type: string;
  content: any;
  timestamp: number;
}

export class StorageController {
  private eventBus: EventBus;
  private storage: Map<string, StoredFile>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.storage = new Map();
    
    this.initialize();
    logger.info('StorageController initialized');
  }

  private initialize() {
    this.eventBus.subscribe('file:processed', (file: StoredFile) => {
      this.storeFile(file);
    });
  }

  storeFile(file: StoredFile) {
    try {
      if (this.storage.has(file.id)) {
        throw new Error(`File ${file.id} already exists`);
      }
      
      this.storage.set(file.id, file);
      this.eventBus.publish('storage:file:stored', file);
      logger.info({ fileId: file.id }, 'File stored successfully');
    } catch (error) {
      logger.error({ error, fileId: file.id }, 'File storage failed');
      this.eventBus.publish('storage:error', {
        fileId: file.id,
        error: error.message
      });
    }
  }

  retrieveFile(id: string): StoredFile | undefined {
    const file = this.storage.get(id);
    if (!file) {
      logger.warn({ fileId: id }, 'File not found');
    }
    return file;
  }
}
