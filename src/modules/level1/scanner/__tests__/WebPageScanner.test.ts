import { WebPageScanner, ScanProgress } from '../WebPageScanner';
    import { EventBus } from '../../../../core/event-bus';
    import fetchMock from 'jest-fetch-mock';

    describe('WebPageScanner', () => {
      let scanner: WebPageScanner;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        scanner = new WebPageScanner(eventBus);
        fetchMock.resetMocks();
      });

      it('should scan a webpage successfully', async () => {
        fetchMock.mockResponseOnce('<html><body>Test</body></html>');
        await scanner.scan('https://example.com');
        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual('https://example.com');
      });

      it('should handle scan errors', async () => {
        fetchMock.mockReject(new Error('Network error'));
        await expect(scanner.scan('https://example.com')).rejects.toThrow('Network error');
      });

      it('should not start a new scan if one is already in progress', async () => {
        fetchMock.mockResponseOnce('<html><body>Test</body></html>');
        scanner.scan('https://example.com'); // Start the first scan
        await scanner.scan('https://example.com'); // Attempt to start a second scan
        expect(fetchMock.mock.calls.length).toEqual(1); // Only one fetch call should have been made
      });

      it('should publish scan:start and scan:stop events', async () => {
        fetchMock.mockResponseOnce('<html><body>Test</body></html>');
        const startSpy = jest.spyOn(eventBus, 'publish').mockImplementation(() => {});
        const stopSpy = jest.spyOn(eventBus, 'publish').mockImplementation(() => {});

        await scanner.scan('https://example.com');

        expect(startSpy).toHaveBeenCalledWith('scan:start', { url: 'https://example.com' });
        expect(stopSpy).toHaveBeenCalledWith('scan:stop', { url: 'https://example.com' });
      });

      it('should handle HTTP errors', async () => {
        fetchMock.mockResponseOnce('', { status: 404 });
        await expect(scanner.scan('https://example.com')).rejects.toThrow('HTTP error! status: 404');
      });

      it('should return correct progress when scanning', () => {
          fetchMock.mockResponseOnce('<html><body>Test</body></html>');
          scanner.scan('https://example.com');
          const progress: ScanProgress = scanner.getProgress();
          expect(progress.status).toBe('Scanning...');
      });

      it('should return correct progress when not scanning', () => {
          const progress: ScanProgress = scanner.getProgress();
          expect(progress.status).toBe('Ready');
      });
    });
