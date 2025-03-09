import { logger } from '../core/logger';
import axios from 'axios';

export const ErrorService = {
  logFrontendError: async (error: Error, context: string = '') => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    logger.error(errorData, 'Frontend Error');
    
    try {
      await axios.post('/log', {
        ...errorData,
        type: 'FRONTEND_ERROR'
      });
    } catch (e) {
      logger.error('Failed to send error log to backend');
    }
  },

  handleAPIError: (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const errorInfo = {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
        response: error.response?.data
      };
      logger.error(errorInfo, 'API Error');
      return errorInfo;
    }
    
    const fallbackError = error instanceof Error ? error : new Error('Unknown error');
    logger.error(fallbackError, 'Unexpected Error');
    return { message: 'An unexpected error occurred' };
  }
};
