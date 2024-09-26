import React from 'react';
import { Box, Typography } from '@mui/material';

function TradeHistory({ trades }) {
  const tradeList = Array.isArray(trades) ? trades : [];

  return (
    <Box>
      {tradeList.length > 0 ? (
        tradeList.map((trade, index) => (
          <Typography key={index}>
            {trade.details}
          </Typography>
        ))
      ) : (
        <Typography>No trades available</Typography>
      )}
    </Box>
  );
}

export default TradeHistory;
