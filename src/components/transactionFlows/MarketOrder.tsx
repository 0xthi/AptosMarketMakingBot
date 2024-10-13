import { isSendableNetwork, aptosClient } from "@/utils";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";
import { useState } from "react"; // Add this import
import axios from 'axios'; // Add axios for API calls

export function MarketOrder({ marketId, fetchBalances }: { marketId: number; fetchBalances: () => void }) { // Accept marketId as a prop
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  // State variables for inputs
  const [tradeSide, setTradeSide] = useState(true); // true for long side
  const [direction, setDirection] = useState(false); // false for open position
  const [size, setSize] = useState(1); // Size
  const [leverage, setLeverage] = useState(20); // Leverage

  const onSignAndSubmitTransaction = async () => {
    if (!account) return; // Check for account

    // Construct the API URL
    const apiUrl = `https://perps-tradeapi.kanalabs.io/marketOrder/?marketId=${marketId}&tradeSide=${tradeSide}&direction=${direction}&size=${size}&leverage=${leverage}`;

    // Fetch market order payload from API
    const response = await axios.get(apiUrl);
    const marketOrderPayload = response.data.data; // Extract market order payload

    const transaction: InputTransactionData = {
      data: {
        function: marketOrderPayload.function, // Use function from API response
        typeArguments: marketOrderPayload.typeArguments, // Use typeArguments from API response
        functionArguments: marketOrderPayload.functionArguments, // Use functionArguments from API response
      },
    };
    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient(network).waitForTransaction({
        transactionHash: response.hash,
      });
      toast({
        title: "Success",
        description: <TransactionHash hash={response.hash} network={network} />,
      });
      fetchBalances(); // Refresh balances after successful transaction
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Order</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <label>Size:</label>
        <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        
        <label>Leverage:</label>
        <input type="number" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} />
        
        <label>
          Trade Side:
          <select value={tradeSide.toString()} onChange={(e) => setTradeSide(e.target.value === 'true')}>
            <option value="true">Long</option>
            <option value="false">Short</option>
          </select>
        </label>
        <label>
          Direction:
          <select value={direction.toString()} onChange={(e) => setDirection(e.target.value === 'true')}>
            <option value="false">Open Position</option>
            <option value="true">Close Position</option>
          </select>
        </label>
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable}>
          Sign and submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
