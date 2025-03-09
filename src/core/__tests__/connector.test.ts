import { Connector } from '../connector';
import { mockEventBus } from '../../tests/testUtils';

describe('Connector', () => {
  let connector: Connector;

  beforeEach(() => {
    connector = new Connector('test-source', 'test-target');
  });

  test('should validate and transfer data', () => {
    connector.addValidator((data) => typeof data === 'number');
    expect(connector.transferData(42)).toBe(true);
    expect(connector.transferData('invalid')).toBe(false);
  });

  test('should handle validator errors', () => {
    connector.addValidator(() => { throw new Error('Test error'); });
    expect(connector.transferData(42)).toBe(false);
  });
});
