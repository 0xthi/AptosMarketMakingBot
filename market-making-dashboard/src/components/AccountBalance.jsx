import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function AccountBalance({ address, marketId }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    fetch(`https://perps-tradeapi.kanalabs.io/getTradingAccountBalance?address=${address}&marketId=${marketId}`)
      .then(response => response.json())
      .then(data => setBalance(data))
      .catch(error => console.error('Error fetching account balance:', error));
  }, [address, marketId]);

  return (
    <Box>
      <Typography variant="h6">Account Balance</Typography>
      {balance ? (
        <Typography>{balance.amount}</Typography>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}

export default AccountBalance;
