"use client";

import { useAutoConnect } from "@/components/AutoConnectProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletSelector as ShadcnWalletSelector } from "@/components/WalletSelector";
import { SingleSigner } from "@/components/transactionFlows/SingleSigner";
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

  return (
    <main className="flex flex-col w-full max-w-[1000px] p-4 md:p-6 pb-12 gap-6">
      <div className="flex justify-between items-center pb-4">
        <ThemeToggle />
        <HealthCheck />
      </div>
      <WalletSelection />
      {connected && (
        <SingleSigner />
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
      {connected && marketId !== null && baseDecimals !== null && (
        <AccountBalance marketId={marketId} baseDecimals={baseDecimals} />
      )}
      {error && <Typography color="error">{error}</Typography>}
    </main>
  );
}

function WalletSelection() {
  const { autoConnect, setAutoConnect } = useAutoConnect(); 
  return (
    <div className="flex flex-col md:flex-row gap-6 pt-6 pb-12 justify-between items-center">
      <div className="flex flex-col gap-4 items-center w-full md:w-auto">
        <div className="text-sm text-muted-foreground">shadcn/ui</div>
        <ShadcnWalletSelector />
      </div>
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
