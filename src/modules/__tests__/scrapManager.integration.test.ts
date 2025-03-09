import { ScrapManager } from '../level2/ScrapManager';
import { EventBus } from '../../../core/event-bus';
import { mockEventBus } from '../../../tests/testUtils';

describe('ScrapManager Integration', () => {
  let scrapManager: ScrapManager;
  const testURL = 'https://example.com';

  beforeEach(() => {
    const eventBus = new EventBus();
    scrapManager = new ScrapManager(eventBus);
  });

  test('should process URL and store results', async () => {
    const result = await scrapManager.processURL(testURL);
    expect(result.domContent.size).toBeGreaterThan(0);
    expect(result.htmlStructure.size).toBeGreaterThan(0);
  });
});
