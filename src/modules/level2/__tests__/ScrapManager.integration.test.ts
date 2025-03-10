import { ScrapManager } from '../ScrapManager';
    import { EventBus } from '../../../core/event-bus';
    import fetchMock from 'jest-fetch-mock';

    describe('ScrapManager Integration', () => {
      let scrapManager: ScrapManager;
      const testURL = 'https://example.com';

      beforeEach(() => {
        const eventBus = new EventBus();
        scrapManager = new ScrapManager(eventBus);
        fetchMock.resetMocks();
      });

      it('should process URL and store results', async () => {
        fetchMock.mockResponseOnce('<html><head><title>Test Page</title></head><body><h1>Hello</h1></body></html>');
        const result = await scrapManager.processURL(testURL);
        expect(result.domContent.size).toBeGreaterThan(0);
        expect(result.htmlStructure.size).toBeGreaterThan(0);
        expect(result.responseData).toBeDefined();
      });

      it('should handle HTTP errors', async () => {
        fetchMock.mockResponseOnce('', { status: 404 });
        await expect(scrapManager.processURL(testURL)).rejects.toThrow('HTTP error! status: 404');
      });

      it('should handle fetch errors', async () => {
          fetchMock.mockRejectOnce(new Error('Network Error'));
          await expect(scrapManager.processURL(testURL)).rejects.toThrow('Network Error');
      });

      it('should clear all results', async () => {
          fetchMock.mockResponseOnce('<html><head><title>Test Page</title></head><body><h1>Hello</h1></body></html>');
          await scrapManager.processURL(testURL);
          scrapManager.clearResults();
          expect(scrapManager.getAllResults().length).toBe(0);
      });

      it('should get result by URL', async () => {
          fetchMock.mockResponseOnce('<html><head><title>Test Page</title></head><body><h1>Hello</h1></body></html>');
          await scrapManager.processURL(testURL);
          const result = scrapManager.getResult(testURL);
          expect(result).toBeDefined();
          expect(result?.url).toBe(testURL);
      });

      it('should get all results', async () => {
          fetchMock.mockResponseOnce('<html><head><title>Test Page</title></head><body><h1>Hello</h1></body></html>');
          await scrapManager.processURL(testURL);
          const allResults = scrapManager.getAllResults();
          expect(allResults.length).toBe(1);
          expect(allResults[0].url).toBe(testURL);
      });
    });
