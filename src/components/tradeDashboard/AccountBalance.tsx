import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';

interface AccountBalanceProps {
  marketId: number;
  baseDecimals: number;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({ marketId, baseDecimals }) => {
  const { account } = useWallet();
  const [tradingBalance, setTradingBalance] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [aptBalance, setAptBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) return;

      try {
        const tradingResponse = await fetch(`https://perps-tradeapi.kanalabs.io/getTradingAccountBalance?marketId=${marketId}&address=${account.address}`);
        const tradingData = await tradingResponse.json();
        if (tradingData.status) {
          setTradingBalance(tradingData.data);
        } else {
          setError(tradingData.message);
        }

        const walletResponse = await fetch(`https://perps-tradeapi.kanalabs.io/getWalletAccountBalance?marketId=${marketId}&address=${account.address}`);
        const walletData = await walletResponse.json();
        if (walletData.status) {
          setWalletBalance(walletData.data);
        } else {
          setError(walletData.message);
        }

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

    fetchBalances();
  }, [account, marketId]);

  if (!account) {
    return <Typography variant="body1">Please connect your wallet to see account balances.</Typography>;
  }

  const formatBalance = (balance: number | null) => {
    if (balance === null) return 'Loading...';
    const dividedValue = balance / Math.pow(10, baseDecimals);
    return Math.round(dividedValue * 100) / 100; // Round to 2 decimal places
  };

  return (
    <Collapsible>
      <CollapsibleTrigger>
        <Typography variant="h6">Account Balances</Typography>
      </CollapsibleTrigger>
      <CollapsibleContent>
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
      </CollapsibleContent>
    </Collapsible>
  );
}

export default AccountBalance;