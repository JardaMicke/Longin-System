import { UIComponent, UIComponentConfig } from '../UIComponent';
    import { EventBus } from '../../../../core/event-bus';

    describe('UIComponent', () => {
      let component: UIComponent;
      let eventBus: EventBus;

      beforeEach(() => {
        eventBus = new EventBus();
        component = new UIComponent(eventBus);
      });

      const testConfig: UIComponentConfig = {
        id: 'test-button',
        type: 'button',
        label: 'Test Button',
      };

      it('should create a component', () => {
        component.createComponent(testConfig);
        expect(component.getComponent('test-button')).toEqual(testConfig);
      });

      it('should throw error when creating component with existing ID', () => {
          component.createComponent(testConfig);
          expect(() => component.createComponent(testConfig)).toThrow("Component with ID test-button already exists.");
      });

      it('should update a component', () => {
        component.createComponent(testConfig);
        const updates = { label: 'Updated Button' };
        component.updateComponent('test-button', updates);
        expect(component.getComponent('test-button')?.label).toBe('Updated Button');
      });

      it('should remove a component', () => {
        component.createComponent(testConfig);
        component.removeComponent('test-button');
        expect(component.getComponent('test-button')).toBeUndefined();
      });

      it('should not update a non-existent component', () => {
          const updates = { label: 'Updated Button' };
          component.updateComponent('non-existent', updates);
          expect(component.getComponent('non-existent')).toBeUndefined();
      });

      it('should not remove a non-existent component', () => {
          component.removeComponent('non-existent');
          expect(component.getComponent('non-existent')).toBeUndefined(); // Should still be undefined
      });
    });
