import React from 'react';
import { Button, Box } from '@mui/material';

const MarketMakingToggle = ({ isMarketMaking, setIsMarketMaking }) => {
  const handleToggle = () => {
    setIsMarketMaking(!isMarketMaking);
    // Call backend API to start/stop the bot
    console.log(`Market making bot is now ${!isMarketMaking ? 'on' : 'off'}`);
  };

  return (
    <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
      <Button
        variant={isMarketMaking ? 'contained' : 'outlined'}
        color={isMarketMaking ? 'error' : 'primary'}
        onClick={handleToggle}
      >
        {isMarketMaking ? 'Stop Market Making' : 'Start Market Making'}
      </Button>
    </Box>
  );
};

export default MarketMakingToggle;
