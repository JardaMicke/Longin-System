import { EventBus } from '../../src/core/event-bus';
import { ScrapManager } from '../../src/modules/level2/ScrapManager';
import { QueryManager } from '../../src/modules/level2/QueryManager';
import { StorageController } from '../../src/modules/level3/StorageController';

describe('Full Workflow', () => {
  const eventBus = new EventBus();
  const scrapManager = new ScrapManager(eventBus);
  const queryManager = new QueryManager(eventBus);
  const storage = new StorageController(eventBus);

  test('complete processing flow', async () => {
    const result = await scrapManager.processURL('https://example.com');
    const queryId = await queryManager.submitQuery('Test query', { id: 'ai1', name: 'Test AI' });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const storedFile = storage.retrieveFile(queryId);
    expect(storedFile).toBeDefined();
  });
});
