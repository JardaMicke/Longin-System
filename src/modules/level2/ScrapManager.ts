import { EventBus } from '../../core/event-bus';
import { logger } from '../../core/logger';
import { DOMScraper } from '../level1/scanner/DOMScraper';
import { HTMLScanner } from '../level1/scanner/HTMLScanner';
import { HTTPResponseParser } from '../level1/scanner/HTTPResponseParser';

export interface ScrapResult {
  url: string;
  timestamp: number;
  domContent: Map<string, any>;
  htmlStructure: Map<string, any>;
  responseData: any;
}

export class ScrapManager {
  private eventBus: EventBus;
  private domScraper: DOMScraper;
  private htmlScanner: HTMLScanner;
  private httpParser: HTTPResponseParser;
  private results: Map<string, ScrapResult>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.domScraper = new DOMScraper(eventBus);
    this.htmlScanner = new HTMLScanner(eventBus);
    this.httpParser = new HTTPResponseParser(eventBus);
    this.results = new Map();

    this.initializeEventListeners();
    logger.info('ScrapManager initialized');
  }

  private initializeEventListeners(): void {
    this.eventBus.subscribe('scraper:content:extracted', (data) => {
      this.handleScrapedContent(data);
    });

    this.eventBus.subscribe('scanner:elements:found', (data) => {
      this.handleScannedElements(data);
    });

    this.eventBus.subscribe('parser:response:parsed', (data) => {
      this.handleParsedResponse(data);
    });
  }

  async processURL(url: string): Promise<ScrapResult> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const [domContent, htmlStructure] = await Promise.all([
        this.domScraper.scrapeContent(html),
        this.htmlScanner.scanHTML(html)
      ]);

      const responseData = await this.httpParser.parseResponse(response);

      const result: ScrapResult = {
        url,
        timestamp: Date.now(),
        domContent,
        htmlStructure,
        responseData
      };

      this.results.set(url, result);
      this.eventBus.publish('scrap:complete', result);
      logger.info({ url }, 'URL processing complete');

      return result;
    } catch (error) {
      logger.error({ url, error }, 'URL processing failed');
      this.eventBus.publish('scrap:error', { url, error });
      throw error;
    }
  }

  private handleScrapedContent(data: any): void {
    logger.debug({ data }, 'Scraped content received');
    this.eventBus.publish('manager:content:processed', data);
  }

  private handleScannedElements(data: any): void {
    logger.debug({ data }, 'Scanned elements received');
    this.eventBus.publish('manager:elements:processed', data);
  }

  private handleParsedResponse(data: any): void {
    logger.debug({ data }, 'Parsed response received');
    this.eventBus.publish('manager:response:processed', data);
  }

  getResult(url: string): ScrapResult | undefined {
    return this.results.get(url);
  }

  getAllResults(): ScrapResult[] {
    return Array.from(this.results.values());
  }

  clearResults(): void {
    this.results.clear();
    logger.info('All results cleared');
  }
}
