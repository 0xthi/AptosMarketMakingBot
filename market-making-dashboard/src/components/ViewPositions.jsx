import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const ViewPositions = ({ address, marketId }) => {
  const [positions, setPositions] = useState({ longPosition: {}, shortPosition: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViewPositions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://perps-tradeapi.kanalabs.io/viewPositions?address=${address}&marketId=${marketId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch positions');
        }
        const data = await response.json();
        setPositions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (address && marketId) {
      fetchViewPositions();
    }
  }, [address, marketId]);

  if (loading) {
    return <Typography>Loading positions...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">View Positions</Typography>
      <Typography variant="subtitle1">Long Position</Typography>
      {positions.longPosition.position ? (
        <Box>
          <Typography>Entry Price: {positions.longPosition.entry_price}</Typography>
          <Typography>Size: {positions.longPosition.open_size}</Typography>
          <Typography>Take Profit Price: {positions.longPosition.take_profit_price}</Typography>
          <Typography>Stop Loss Price: {positions.longPosition.stop_loss_price}</Typography>
        </Box>
      ) : (
        <Typography>No long position available</Typography>
      )}
      
      <Typography variant="subtitle1">Short Position</Typography>
      {positions.shortPosition.position ? (
        <Box>
          <Typography>Entry Price: {positions.shortPosition.entry_price}</Typography>
          <Typography>Size: {positions.shortPosition.open_size}</Typography>
          <Typography>Take Profit Price: {positions.shortPosition.take_profit_price}</Typography>
          <Typography>Stop Loss Price: {positions.shortPosition.stop_loss_price}</Typography>
        </Box>
      ) : (
        <Typography>No short position available</Typography>
      )}
    </Box>
  );
};

export default ViewPositions;