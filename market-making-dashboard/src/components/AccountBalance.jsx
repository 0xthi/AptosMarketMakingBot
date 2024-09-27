import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

function AccountBalance() {
  const { account } = useWallet(); // Get the connected account
  const marketId = 36; // Market ID is always 36
  const [tradingBalance, setTradingBalance] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [aptBalance, setAptBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) return; // If no account is connected, do not fetch balances

      try {
        // Fetch Trading Account Balance
        const tradingResponse = await fetch(`https://perps-tradeapi.kanalabs.io/getTradingAccountBalance?marketId=${marketId}&address=${account.address}`);
        const tradingData = await tradingResponse.json();
        if (tradingData.status) {
          setTradingBalance(tradingData.data);
        } else {
          setError(tradingData.message);
        }

        // Fetch Wallet Account Balance
        const walletResponse = await fetch(`https://perps-tradeapi.kanalabs.io/getWalletAccountBalance?marketId=${marketId}&address=${account.address}`);
        const walletData = await walletResponse.json();
        if (walletData.status) {
          setWalletBalance(walletData.data);
        } else {
          setError(walletData.message);
        }

        // Fetch Aptos Account Balance
        const aptResponse = await fetch(`https://perps-tradeapi.kanalabs.io/getAccountAptBalance?marketId=${marketId}&address=${account.address}`);
        const aptData = await aptResponse.json();
        if (aptData.status) {
          setAptBalance(aptData.data);
        } else {
          setError(aptData.message);
        }
      } catch (error) {
        console.error('Error fetching account balances:', error);
        setError('Error fetching account balances');
      }
    };

    fetchBalances(); // Call the fetch function
  }, [account]); // Dependency on account

  if (!account) {
    return <Typography variant="body1">Please connect your wallet to see account balances.</Typography>; // Message when wallet is not connected
  }

  // Function to format the balance
  const formatBalance = (balance) => {
    if (balance === null) return 'Loading...';
    const dividedValue = balance / 1e8; // Divide by 8 decimals
    return Math.round(dividedValue * 100) / 100; // Round to 2 decimal places
  };

  return (
    <Box>
      <Typography variant="h6">Account Balances</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="body1">
        Trading Account Balance: {formatBalance(tradingBalance)}
      </Typography>
      <Typography variant="body1">
        Wallet Account Balance: {formatBalance(walletBalance)}
      </Typography>
      <Typography variant="body1">
        Aptos Account Balance: {formatBalance(aptBalance)}
      </Typography>
    </Box>
  );
}

export default AccountBalance;
