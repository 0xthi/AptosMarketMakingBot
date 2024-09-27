import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Box, Button, Typography } from '@mui/material';

function MizuWalletConnection({ onConnect }) {
  const { account, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect('Mizu Wallet');
      if (account) {
        onConnect(account.address); // Pass the connected address to the parent
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onConnect(null); // Clear the address on disconnect
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Mizu Wallet Connection</Typography>
      {account ? (
        <>
          <Typography>Connected Account: {account.address}</Typography>
          <Button variant="contained" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={handleConnect}>
          Connect Mizu Wallet
        </Button>
      )}
    </Box>
  );
}

export default MizuWalletConnection;