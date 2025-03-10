import { UserActionRecorder, UserAction } from '../UserActionRecorder';
    import { EventBus } from '../../../../core/event-bus';

    describe('UserActionRecorder', () => {
      let recorder: UserActionRecorder;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        recorder = new UserActionRecorder(eventBus);
        document.body.innerHTML = `
          <button id="test-button">Click Me</button>
          <input type="text" id="test-input" />
        `;
      });

      afterEach(() => {
        recorder.stopRecording(); // Clean up listeners
      });

      it('should start and stop recording', () => {
        recorder.startRecording();
        expect(recorder['isRecording']).toBe(true);
        recorder.stopRecording();
        expect(recorder['isRecording']).toBe(false);
      });

      it('should record click actions', () => {
        recorder.startRecording();
        const button = document.getElementById('test-button');
        button?.click();
        const actions = recorder.getActions();
        expect(actions.length).toBe(1);
        expect(actions[0].type).toBe('click');
        expect(actions[0].target).toContain('<button id="test-button">');
      });

      it('should record input actions', () => {
        recorder.startRecording();
        const input = document.getElementById('test-input') as HTMLInputElement;
        input.value = 'test value';
        input.dispatchEvent(new Event('input'));
        const actions = recorder.getActions();
        expect(actions.length).toBe(1);
        expect(actions[0].type).toBe('input');
        expect(actions[0].value).toBe('test value');
        expect(actions[0].target).toContain('<input type="text" id="test-input">');
      });

      it('should not record actions when not recording', () => {
        const button = document.getElementById('test-button');
        button?.click();
        expect(recorder.getActions().length).toBe(0);
      });

      it('should clear actions on startRecording', () => {
          recorder.startRecording();
          const button = document.getElementById('test-button');
          button?.click();
          recorder.stopRecording();
          recorder.startRecording(); // Start again, should clear previous actions
          expect(recorder.getActions().length).toBe(0);
      });

      it('should return a copy of actions', () => {
          recorder.startRecording();
          const button = document.getElementById('test-button');
          button?.click();
          const actions = recorder.getActions();
          actions.push({ type: 'click', target: 'fake', timestamp: 0 }); // Modify the returned array
          expect(recorder.getActions().length).toBe(1); // Original array should not be modified
      });

      it('should not start recording if already recording', () => {
          const spy = jest.spyOn(document, 'addEventListener');
          recorder.startRecording();
          recorder.startRecording(); // Call startRecording again
          expect(spy).toHaveBeenCalledTimes(2); // Should only be called twice (click and input)
      });

      it('should not stop recording if not recording', () => {
          const spy = jest.spyOn(document, 'removeEventListener');
          recorder.stopRecording();
          expect(spy).not.toHaveBeenCalled();
      });
    });
