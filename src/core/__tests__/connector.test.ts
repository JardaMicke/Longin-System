import { Connector } from '../connector';
import { mockEventBus } from '../../tests/testUtils';
import { logger } from '../logger';

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

  test('should log a warning when data transfer fails', () => {
      const warnSpy = jest.spyOn(logger, 'warn');
      connector.addValidator((data) => typeof data === 'number');
      connector.transferData('invalid');
      expect(warnSpy).toHaveBeenCalledWith({ source: 'test-source', target: 'test-target', data: 'invalid' }, 'Data transfer failed');
  });
});
