import { EventBus } from '../../../core/event-bus';
    import { logger } from '../../../core/logger';
    import { parse, HTMLElement } from 'node-html-parser';

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
        if (!config.targetElement) {
          const error = new Error("Target element cannot be empty.");
          logger.error({ error, configId: id }, 'Invalid scan config');
          this.eventBus.publish('scanner:error', { id, error });
          throw error;
        }
        this.scanConfigs.set(id, config);
        logger.debug({ configId: id, config }, 'Scan config added');
      }

      async scanHTML(html: string): Promise<Map<string, any>> {
        if (!html) {
          const error = new Error("HTML content cannot be empty.");
          logger.error({ error }, 'Invalid HTML content');
          this.eventBus.publish('scanner:error', { error });
          throw error;
        }
        try {
          const root = parse(html);
          const results = new Map<string, any>();

          for (const [id, config] of this.scanConfigs) {
            try {
              const elements = root.querySelectorAll(config.targetElement);
              const scannedData = elements.map(element => this.processElement(element, config));

              results.set(id, scannedData);
              this.eventBus.publish('scanner:elements:found', { id, elements: scannedData });
              logger.debug({ configId: id, count: scannedData.length }, 'Elements scanned');
            } catch (error) {
              logger.error({ configId: id, error }, 'Scanning error');
              this.eventBus.publish('scanner:error', { id, error });
              // Don't re-throw, allow other configs to be processed
            }
          }

          return results;
        } catch (error) {
          logger.error({ error }, 'HTML parsing error');
          this.eventBus.publish('scanner:error', { error });
          throw error; // Re-throw for top-level handling
        }
      }

      private processElement(element: HTMLElement, config: ScannerConfig): any {
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
          data.children = element.childNodes.map(child => {
            if (child.nodeType === 1) {
              return this.processElement(child as HTMLElement, config); // Recursively process child elements
            }
            return {
              tagName: child.nodeType,
              content: child.textContent,
            };
          });
        }

        return data;
      }
    }
