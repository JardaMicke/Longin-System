import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { logger } from '../core/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error({
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack
    }, 'Component Error');
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4}>
          <Alert severity="error" variant="outlined">
            <h2>Something went wrong</h2>
            <pre>{this.state.error?.toString()}</pre>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
