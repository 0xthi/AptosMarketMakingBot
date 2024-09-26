import React, { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Box, Button, Typography } from '@mui/material';

function MizuWalletConnection() {
  const { account, connect, disconnect, signAndSubmitTransaction } = useWallet();
  const [transactionHash, setTransactionHash] = useState('');

  const handleConnect = async () => {
    try {
      await connect('Mizu Wallet');
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  const handleTransaction = async () => {
    const transaction = {
      data: {
        function: "0x1::aptos_account::transfer",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [
          "0xec08b1fbd892910bf772c2e4595864efb2169e68dafa32dc2f123383dd246c51", // Replace with recipient address
          1, // Amount to send
        ],
      },
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      setTransactionHash(response.hash);
      console.log('Transaction successful:', response.hash);
    } catch (error) {
      console.error('Transaction error:', error);
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
          <Button variant="contained" onClick={handleTransaction}>
            Send 1 AptosCoin
          </Button>
          {transactionHash && <Typography>Transaction Hash: {transactionHash}</Typography>}
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