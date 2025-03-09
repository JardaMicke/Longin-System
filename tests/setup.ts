// Global test setup
import { logger } from '../src/core/logger';

beforeAll(() => {
  logger.silent = true;
});

afterAll(() => {
  logger.silent = false;
});
