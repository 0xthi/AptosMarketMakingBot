import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function HealthCheck() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('https://perps-tradeapi.kanalabs.io/health/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status === true) {
          setStatus('OK');
        } else {
          setStatus('ERROR');
        }
      } catch (error) {
        console.error('Error fetching health status:', error);
        setStatus('ERROR');
      }
    };

    checkHealth();
  }, []);

  return (
    <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: status === 'OK' ? 'green' : 'red',
          marginRight: 1,
        }}
      />
      <Typography variant="body2">API Status</Typography>
    </Box>
  );
}

export default HealthCheck;