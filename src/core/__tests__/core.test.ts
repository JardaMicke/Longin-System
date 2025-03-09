import { EventBus } from '../event-bus';
import { Connector } from '../connector';

describe('EventBus', () => {
  it('should handle event subscription and publishing', () => {
    const eventBus = new EventBus();
    let receivedData = null;

    const callback = (data: any) => {
      receivedData = data;
    };

    eventBus.subscribe('test-event', callback);
    const testData = { message: 'test' };
    eventBus.publish('test-event', testData);

    expect(receivedData).toEqual(testData);
  });
});

describe('Connector', () => {
  it('should validate and transfer data correctly', () => {
    const connector = new Connector('source-module', 'target-module');
    
    const validateNumber = (data: any): boolean => {
      return typeof data === 'number' && data > 0;
    };

    connector.addValidator(validateNumber);

    expect(connector.transferData(42)).toBe(true);
    expect(connector.transferData(-1)).toBe(false);
    expect(connector.transferData('not a number')).toBe(false);
  });
});
