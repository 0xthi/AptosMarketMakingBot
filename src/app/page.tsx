"use client";

import { useAutoConnect } from "@/components/AutoConnectProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletSelector as ShadcnWalletSelector } from "@/components/WalletSelector";
import { SingleSigner } from "@/components/transactionFlows/SingleSigner";
import { Deposit } from "@/components/transactionFlows/Deposit";
import { Withdraw } from "@/components/transactionFlows/Withdraw";
import { MarketOrder } from "@/components/transactionFlows/MarketOrder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import HealthCheck from "@/components/transactionFlows/APIHealth"; 
import AccountBalance from "@/components/tradeDashboard/AccountBalance";
import { Switch } from "@/components/ui/switch";
import { isMainnet } from "@/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OrderHistory from "@/components/tradeDashboard/OrderHistory"; // Import the OrderHistory component
import OpenTrades from "@/components/tradeDashboard/OpenTrades"; // Import the OpenTrades component
import TradingChart from "@/components/tradeDashboard/TradingChart"; // Import the TradingChart component

export default function Home() {
  const { connected, network } = useWallet();
  const [marketId, setMarketId] = useState<number | null>(null);
  const [baseDecimals, setBaseDecimals] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketInfo = async () => {
      try {
        const response = await fetch("https://perps-tradeapi.kanalabs.io/getPerpetualAssetsInfo/allMarkets");
        const data = await response.json();
        if (data.status) {
          const market = data.data.find((m: any) => m.base_name === "APT/USDC");
          if (market) {
            setMarketId(Number(market.market_id));
            setBaseDecimals(market.base_decimals);
          }
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching market info:', error);
        setError('Error fetching market info');
      }
    };

    fetchMarketInfo();
  }, []);

  // Function to fetch balances, to be passed to Deposit and MarketOrder
  const fetchBalances = async () => {
    // Implement the logic to fetch balances here
    // This function should be defined to refresh balances after transactions
  };

  return (
    <main className="flex flex-col w-full max-w-[1000px] p-4 md:p-6 pb-12 gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center pb-2">
        <WalletSelection />
        <HealthCheck />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-2">
        <div className="flex flex-col gap-2">
          {connected && marketId !== null && baseDecimals !== null && (
            <AccountBalance marketId={marketId} baseDecimals={baseDecimals} />
          )}
          {error && <Typography color="error">{error}</Typography>}
        </div>
        <div className="flex flex-col items-end">
          <ThemeToggle />
        </div>
      </div>
      {connected && marketId !== null && (
        <>
          <Deposit marketId={marketId} fetchBalances={fetchBalances} />
          <Withdraw marketId={marketId} fetchBalances={fetchBalances} />
          <MarketOrder marketId={marketId} fetchBalances={fetchBalances} />
          <OrderHistory marketId={marketId} />
          <OpenTrades marketId={marketId} />
          <TradingChart />
        </>
      )}
      {connected && isMainnet(connected, network?.name) && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            The transactions flows below will not work on the Mainnet network.
          </AlertDescription>
        </Alert>
      )}
    </main>
  );
}

function WalletSelection() {
  const { autoConnect, setAutoConnect } = useAutoConnect(); 
  return (
    <div className="flex flex-col md:flex-row gap-4 pt-4 pb-4 justify-between items-center">
      <ShadcnWalletSelector />
      <label className="flex items-center gap-4 cursor-pointer">
        <Switch
          id="auto-connect-switch"
          checked={autoConnect}
          onCheckedChange={setAutoConnect}
        />
        <Label htmlFor="auto-connect-switch">
          Auto reconnect on page load
        </Label>
      </label>
    </div> 
  );
}
