import { useState, useEffect } from 'react';
import { EventBus } from '../core/event-bus';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'name', headerName: 'Module', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'lastUpdate', headerName: 'Last Update', width: 200 },
];

export const ModuleStatusDashboard = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [eventBus] = useState(new EventBus());

  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      setModules(prev => [...prev.filter(m => m.id !== data.id), data]);
    };

    eventBus.subscribe('module:status', handleStatusUpdate);
    return () => eventBus.unsubscribe('module:status', handleStatusUpdate);
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Module Status Monitor
      </Typography>
      <DataGrid
        rows={modules}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
      />
    </Box>
  );
};
