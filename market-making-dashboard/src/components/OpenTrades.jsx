import React from 'react';
import { Box, Typography } from '@mui/material';

function OpenTrades({ openTrades }) {
  const tradesList = Array.isArray(openTrades) ? openTrades : [];

  return (
    <Box>
      {tradesList.length > 0 ? (
        tradesList.map((trade, index) => (
          <Typography key={index}>
            {trade.details}
          </Typography>
        ))
      ) : (
        <Typography>No open trades available</Typography>
      )}
    </Box>
  );
}

export default OpenTrades;
