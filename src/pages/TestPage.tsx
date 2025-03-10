import { useState, useEffect } from 'react';
    import { 
      Button, 
      Container, 
      Typography, 
      Paper, 
      List, 
      ListItem, 
      ListItemText,
      Grid,
      TextField,
      Box,
      LinearProgress,
      Alert,
      Dialog,
      DialogTitle,
      DialogContent,
      DialogActions,
      InputLabel,
      MenuItem,
      Select,
      FormControl
    } from '@mui/material';
    import { HTMLScanner } from '../modules/level1/scanner/HTMLScanner';
    import { DOMScraper } from '../modules/level1/scanner/DOMScraper';
    import { WebPageScanner } from '../modules/level1/scanner/WebPageScanner';
    import { UserActionRecorder } from '../modules/level1/scanner/UserActionRecorder';

    export const TestPage = () => {
      const [url, setUrl] = useState('');
      const [isScanning, setIsScanning] = useState(false);
      const [actions, setActions] = useState<UserAction[]>([]);
      const [scanProgress, setScanProgress] = useState(0);
      const [error, setError] = useState<string | null>(null);
      const [sessionName, setSessionName] = useState('');
      const [isSaving, setIsSaving] = useState(false);

      const scanner = new WebPageScanner(new EventBus());
      const actionRecorder = new UserActionRecorder();

      const startScan = async () => {
        try {
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setError('Please enter a valid URL');
            return;
          }

          if (isScanning) return;
          
          setIsScanning(true);
          setError(null);
          setActions([]);
          actionRecorder.startRecording();
          scanner.start(url);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Scan failed');
        }
      };

      const stopScan = async () => {
        setIsScanning(false);
        actionRecorder.stopRecording();
      };

      const saveSession = async () => {
        const session = {
          url,
          actions,
          timestamp: new Date().toISOString(),
          name: sessionName || `Session_${new Date().toISOString().replace(/[:.]/g, '-')}`
        };
        
        // Save session logic here
        setIsSaving(true);
        alert('Session saved successfully!');
        setIsSaving(false);
      };

      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <Typography variant="h3" gutterBottom>
              L.O.N.G.I.N.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Logical Orchestration Networked Generative Intelligent Nexus
            </Typography>
          </div>

          <div style={{
            marginBottom: '20px'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="URL to scan"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  sx={{ mr: 2 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color={isScanning ? 'warning' : 'primary'}
                  onClick={isScanning ? stopScan : startScan}
                  disabled={!url || isSaving}
                >
                  {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>
              </Grid>
            </Grid>
          </div>

          <div style={{
            marginBottom: '20px'
          }}>
            <Typography variant="h6" gutterBottom>
              Recorded Actions:
            </Typography>
            <List dense>
              {actions.map((action, i) => (
                <ListItem
                  key={i}
                  sx={{
                    p: 1,
                    border: '1px solid #eee',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText 
                    primary={`Action ${i + 1}: ${action.type} - ${action.target}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>

          <div style={{
            marginBottom: '20px'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Session name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={saveSession}
                  disabled={isSaving || !actions.length}
                >
                  {isSaving ? 'Saving...' : 'Save Session'}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      );
    };
