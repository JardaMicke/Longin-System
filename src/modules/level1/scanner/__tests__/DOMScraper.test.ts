import { DOMScraper, ScrapingConfig } from '../DOMScraper';
    import { EventBus } from '../../../../core/event-bus';

    describe('DOMScraper', () => {
      let scraper: DOMScraper;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        scraper = new DOMScraper(eventBus);
      });

      it('should add scraping config', () => {
        const config: ScrapingConfig = { selector: 'div' };
        scraper.addScrapingConfig('test', config);
        expect(scraper['configs'].get('test')).toEqual(config);
      });

      it('should throw error for empty selector', () => {
          const config: ScrapingConfig = { selector: '' };
          expect(() => scraper.addScrapingConfig('test', config)).toThrow("Selector cannot be empty.");
      });

      it('should scrape content based on config', async () => {
        const config: ScrapingConfig = { selector: 'div', attribute: 'id' };
        scraper.addScrapingConfig('test', config);
        const html = '<div id="test1"></div><div id="test2"></div>';
        const results = await scraper.scrapeContent(html);
        expect(results.get('test')).toEqual(['test1', 'test2']);
      });

      it('should handle scraping errors gracefully', async () => {
        const config: ScrapingConfig = { selector: 'div', attribute: 'id' };
        scraper.addScrapingConfig('test', config);
        const html = '<invalid-html>'; // Invalid HTML
        const results = await scraper.scrapeContent(html); // Won't throw, but logs error
        expect(results.get('test')).toBeUndefined();
      });

      it('should handle empty HTML content', async () => {
          const html = '';
          await expect(scraper.scrapeContent(html)).rejects.toThrow("HTML content cannot be empty.");
      });

      it('should transform scraped content if transform function is provided', async () => {
        const config: ScrapingConfig = {
          selector: 'div',
          transform: (value: string) => value.toUpperCase(),
        };
        scraper.addScrapingConfig('test', config);
        const html = '<div>hello</div><div>world</div>';
        const results = await scraper.scrapeContent(html);
        expect(results.get('test')).toEqual(['HELLO', 'WORLD']);
      });
    });
