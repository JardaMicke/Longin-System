import { useState } from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import { ErrorService } from '../services/errorService';

export const TestPage = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 10));
  };

  const triggerSuccess = async () => {
    try {
      addLog('Success action triggered');
      await fetch('/api/test-success');
    } catch (e) {
      ErrorService.logFrontendError(e as Error, 'test-success');
    }
  };

  const triggerError = async () => {
    try {
      addLog('Error action triggered');
      await fetch('/api/test-error');
    } catch (e) {
      ErrorService.logFrontendError(e as Error, 'test-error');
    }
  };

  const triggerClientError = () => {
    try {
      // @ts-ignore
      undefinedFunction();
    } catch (e) {
      ErrorService.logFrontendError(e as Error, 'client-error');
      addLog('Client error triggered');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Test Panel
        </Typography>

        <div style={{ gap: 16, display: 'flex', marginBottom: 24 }}>
          <Button 
            variant="contained" 
            color="success"
            onClick={triggerSuccess}
          >
            Test Success Flow
          </Button>
          
          <Button 
            variant="contained" 
            color="error"
            onClick={triggerError}
          >
            Test Error Flow
          </Button>
          
          <Button 
            variant="outlined"
            onClick={triggerClientError}
          >
            Trigger Client Error
          </Button>
        </div>

        <Typography variant="h6" gutterBottom>
          Recent Logs:
        </Typography>
        
        <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List dense>
            {logs.map((log, i) => (
              <ListItem key={i}>
                <ListItemText 
                  primary={log} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Paper>
    </Container>
  );
};
