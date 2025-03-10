import { StorageController, StoredFile } from '../StorageController';
    import { EventBus } from '../../../core/event-bus';

    describe('StorageController', () => {
      let storageController: StorageController;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        storageController = new StorageController(eventBus);
      });

      const testFile: StoredFile = {
        id: 'test-file',
        type: 'text',
        content: 'test content',
        timestamp: Date.now(),
      };

      it('should store a file', () => {
        storageController.storeFile(testFile);
        expect(storageController.retrieveFile('test-file')).toEqual(testFile);
      });

      it('should retrieve a file', () => {
        storageController.storeFile(testFile);
        const retrievedFile = storageController.retrieveFile('test-file');
        expect(retrievedFile).toEqual(testFile);
      });

      it('should return undefined if file not found', () => {
        const retrievedFile = storageController.retrieveFile('non-existent-file');
        expect(retrievedFile).toBeUndefined();
      });

      it('should not store a file with the same id', () => {
        storageController.storeFile(testFile);
        expect(() => storageController.storeFile(testFile)).toThrowError('File test-file already exists');
      });

      it('should publish events on store and error', () => {
        const storeSpy = jest.spyOn(eventBus, 'publish');
        storageController.storeFile(testFile);
        expect(storeSpy).toHaveBeenCalledWith('storage:file:stored', testFile);

        const errorSpy = jest.spyOn(eventBus, 'publish');
        storageController.storeFile(testFile);
        expect(errorSpy).toHaveBeenCalledWith('storage:error', { fileId: 'test-file', error: 'File test-file already exists' });
      });
    });
