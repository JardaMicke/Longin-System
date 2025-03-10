import { HTMLScanner, ScannerConfig } from '../HTMLScanner';
    import { EventBus } from '../../../../core/event-bus';

    describe('HTMLScanner', () => {
      let scanner: HTMLScanner;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        scanner = new HTMLScanner(eventBus);
      });

      it('should add scan config', () => {
        const config: ScannerConfig = { targetElement: 'div' };
        scanner.addScanConfig('test', config);
        expect(scanner['scanConfigs'].get('test')).toEqual(config);
      });

      it('should throw error for empty target element', () => {
          const config: ScannerConfig = { targetElement: '' };
          expect(() => scanner.addScanConfig('test', config)).toThrow("Target element cannot be empty.");
      });

      it('should scan HTML based on config', async () => {
        const config: ScannerConfig = { targetElement: 'div', attributes: ['id'] };
        scanner.addScanConfig('test', config);
        const html = '<div id="test1"></div><div id="test2"></div>';
        const results = await scanner.scanHTML(html);
        expect(results.get('test')).toEqual([
          { tagName: 'DIV', innerHTML: '', attributes: { id: 'test1' } },
          { tagName: 'DIV', innerHTML: '', attributes: { id: 'test2' } },
        ]);
      });

      it('should handle scanning errors gracefully', async () => {
        const config: ScannerConfig = { targetElement: 'div' };
        scanner.addScanConfig('test', config);
        const html = '<invalid-html>'; // Invalid HTML
        await expect(scanner.scanHTML(html)).rejects.toThrow();
      });

      it('should handle empty HTML content', async () => {
          const html = '';
          await expect(scanner.scanHTML(html)).rejects.toThrow("HTML content cannot be empty.");
      });

      it('should recursively scan child elements if recursive is true', async () => {
        const config: ScannerConfig = { targetElement: 'div', recursive: true };
        scanner.addScanConfig('test', config);
        const html = '<div><p>Hello</p></div>';
        const results = await scanner.scanHTML(html);
        expect(results.get('test')).toEqual([
          {
            tagName: 'DIV',
            innerHTML: '<p>Hello</p>',
            children: [
              { tagName: 'P', innerHTML: 'Hello', children: [{ tagName: 3, content: 'Hello' }] },
            ],
          },
        ]);
      });

      it('should scan specified attributes', async () => {
        const config: ScannerConfig = { targetElement: 'a', attributes: ['href', 'title'] };
        scanner.addScanConfig('test', config);
        const html = '<a href="https://example.com" title="Example">Link</a>';
        const results = await scanner.scanHTML(html);
        expect(results.get('test')).toEqual([
          {
            tagName: 'A',
            innerHTML: 'Link',
            attributes: { href: 'https://example.com', title: 'Example' },
          },
        ]);
      });
    });
