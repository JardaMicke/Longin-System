import { EventBus } from '../../../core/event-bus';
import { logger } from '../../../core/logger';
import * as cheerio from 'cheerio';

export interface ScrapingConfig {
  selector: string;
  attribute?: string;
  transform?: (value: string) => any;
}

export class DOMScraper {
  private eventBus: EventBus;
  private configs: Map<string, ScrapingConfig>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.configs = new Map();
    logger.info('DOMScraper module initialized');
  }

  addScrapingConfig(id: string, config: ScrapingConfig): void {
    this.configs.set(id, config);
    logger.debug({ configId: id, config }, 'Scraping config added');
  }

  async scrapeContent(html: string): Promise<Map<string, any>> {
    const $ = cheerio.load(html);
    const results = new Map<string, any>();

    this.configs.forEach((config, id) => {
      try {
        const elements = $(config.selector);
        const values = elements.map((_, el) => {
          const value = config.attribute ? $(el).attr(config.attribute) : $(el).text();
          return config.transform ? config.transform(value) : value;
        }).get();

        results.set(id, values);
        this.eventBus.publish('scraper:content:extracted', { id, values });
        logger.debug({ configId: id, count: values.length }, 'Content scraped');
      } catch (error) {
        logger.error({ configId: id, error }, 'Scraping error');
        this.eventBus.publish('scraper:error', { id, error });
      }
    });

    return results;
  }
}
