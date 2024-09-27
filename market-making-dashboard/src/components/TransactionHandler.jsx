import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Box, Button, TextField, Typography } from '@mui/material';

const TransactionHandler = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [marketId, setMarketId] = useState(36); // Default market ID
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleDeposit = async () => {
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      const depositResponse = await fetch(`https://perps-tradeapi.kanalabs.io/deposit?marketId=${marketId}&amount=${amount}`);
      const depositData = await depositResponse.json();

      console.log('Deposit Data:', depositData); // Log the deposit data

      if (!depositData.status) {
        setError(depositData.message);
        return;
      }

      // Prepare the transaction payload
      const transaction = {
        function: depositData.data.function,
        typeArguments: depositData.data.typeArguments,
        functionArguments: depositData.data.functionArguments,
      };

      console.log('Transaction Payload:', transaction); // Log the transaction payload

      const result = await signAndSubmitTransaction(transaction);
      setResponse(result);
      setError(null);
    } catch (err) {
      console.error('Error during deposit transaction:', err);
      setError('Transaction failed. Please try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!account) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      const withdrawResponse = await fetch(`https://perps-tradeapi.kanalabs.io/withdraw?marketId=${marketId}&amount=${amount}`);
      const withdrawData = await withdrawResponse.json();

      console.log('Withdraw Data:', withdrawData); // Log the withdraw data

      if (!withdrawData.status) {
        setError(withdrawData.message);
        return;
      }

      // Prepare the transaction payload
      const transaction = {
        function: withdrawData.data.function,
        typeArguments: withdrawData.data.typeArguments,
        functionArguments: withdrawData.data.functionArguments,
      };

      console.log('Transaction Payload:', transaction); // Log the transaction payload

      const result = await signAndSubmitTransaction(transaction);
      setResponse(result);
      setError(null);
    } catch (err) {
      console.error('Error during withdraw transaction:', err);
      setError('Transaction failed. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Deposit/Withdraw</Typography>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Market ID"
        type="number"
        value={marketId}
        onChange={(e) => setMarketId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleDeposit} sx={{ marginRight: 2 }}>
        Deposit
      </Button>
      <Button variant="contained" onClick={handleWithdraw}>
        Withdraw
      </Button>
      {response && (
        <Typography variant="body1" color="success.main">
          Transaction successful: {JSON.stringify(response)}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error.main">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TransactionHandler;
