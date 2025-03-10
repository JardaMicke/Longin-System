import { EventBus } from '../../../core/event-bus';
    import { HTMLScanner } from './HTMLScanner';
    import { DOMScraper } from './DOMScraper';
    import { logger } from '../../../core/logger';

    export interface ScanProgress {
      progress: number;
      status: string;
    }

    export class WebPageScanner {
      private htmlScanner: HTMLScanner;
      private domScraper: DOMScraper;
      private eventBus: EventBus;
      private isScanning: boolean;

      constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.htmlScanner = new HTMLScanner(eventBus);
        this.domScraper = new DOMScraper(eventBus);
        this.isScanning = false;
        logger.info('WebPageScanner module initialized');
      }

      async scan(url: string): Promise<void> {
        if (this.isScanning) {
          logger.warn({ url }, 'Scanner is already running');
          return;
        }

        this.isScanning = true;
        this.eventBus.publish('scan:start', { url });

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const html = await response.text();

          const scanResults = await Promise.all([
            this.htmlScanner.scanHTML(html),
            this.domScraper.scrapeContent(html)
          ]);

          this.eventBus.publish('scan:complete', {
            url,
            htmlStructure: scanResults[0],
            domContent: scanResults[1]
          });
          logger.info({ url }, 'Scan completed successfully');

        } catch (error) {
          this.eventBus.publish('scan:error', { url, error: error.message });
          logger.error({ url, error }, 'Scan failed');
          throw error; // Re-throw for higher-level handling
        } finally {
          this.isScanning = false;
          this.eventBus.publish('scan:stop', { url });
        }
      }

      getProgress(): ScanProgress {
        // TODO: Implement progress tracking based on scan results
        return {
          progress: this.isScanning ? 50 : 100, // Placeholder
          status: this.isScanning ? 'Scanning...' : 'Ready'
        };
      }
    }
