import { EventBus } from '../../../core/event-bus';
import { logger } from '../../../core/logger';
import { parse } from 'node-html-parser';

export interface ScannerConfig {
  targetElement: string;
  attributes?: string[];
  recursive?: boolean;
}

export class HTMLScanner {
  private eventBus: EventBus;
  private scanConfigs: Map<string, ScannerConfig>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.scanConfigs = new Map();
    logger.info('HTMLScanner module initialized');
  }

  addScanConfig(id: string, config: ScannerConfig): void {
    this.scanConfigs.set(id, config);
    logger.debug({ configId: id, config }, 'Scan config added');
  }

  async scanHTML(html: string): Promise<Map<string, any>> {
    const root = parse(html);
    const results = new Map<string, any>();

    this.scanConfigs.forEach((config, id) => {
      try {
        const elements = root.querySelectorAll(config.targetElement);
        const scannedData = elements.map(element => {
          const data: any = {
            tagName: element.tagName,
            innerHTML: element.innerHTML,
          };

          if (config.attributes) {
            data.attributes = {};
            config.attributes.forEach(attr => {
              data.attributes[attr] = element.getAttribute(attr);
            });
          }

          if (config.recursive) {
            data.children = element.childNodes.map(child => ({
              tagName: child.nodeType === 1 ? (child as any).tagName : child.nodeType,
              content: child.textContent,
            }));
          }

          return data;
        });

        results.set(id, scannedData);
        this.eventBus.publish('scanner:elements:found', { id, elements: scannedData });
        logger.debug({ configId: id, count: scannedData.length }, 'Elements scanned');
      } catch (error) {
        logger.error({ configId: id, error }, 'Scanning error');
        this.eventBus.publish('scanner:error', { id, error });
      }
    });

    return results;
  }
}
