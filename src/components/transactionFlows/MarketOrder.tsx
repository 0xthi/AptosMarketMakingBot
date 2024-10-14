import { isSendableNetwork, aptosClient } from "@/utils";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";
import { useState } from "react";
import axios from 'axios';
import { Slider } from "../ui/slider"; // Import the Slider component

export function MarketOrder({ marketId, fetchBalances }: { marketId: number; fetchBalances: () => void }) {
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const [tradeSide, setTradeSide] = useState(true);
  const [direction, setDirection] = useState(false);
  const [size, setSize] = useState(1);
  const [leverage, setLeverage] = useState(20);
  const [usdcDeposit, setUsdcDeposit] = useState(0);
  const [amount, setAmount] = useState(0);

  // Update amount based on USDC deposit and leverage
  const updateAmount = (usdc: number, lev: number) => {
    const newAmount = usdc * lev;
    setAmount(newAmount);
  };

  // Handle USDC deposit change
  const handleUsdcChange = (value: number) => {
    setUsdcDeposit(value);
    updateAmount(value, leverage);
  };

  // Handle amount change
  const handleAmountChange = (value: number) => {
    setAmount(value);
    setUsdcDeposit(value / leverage);
    setSize(value); // Set size to the new amount
  };

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;

    const apiUrl = `https://perps-tradeapi.kanalabs.io/marketOrder/?marketId=${marketId}&tradeSide=${tradeSide}&direction=${direction}&size=${size}&leverage=${leverage}&amount=${amount}`; // Use amount instead of usdcDeposit

    try {
      const response = await axios.get(apiUrl);
      if (!response.data.status) {
        throw new Error(response.data.message);
      }

      const marketOrderPayload = response.data.data;

      const transaction: InputTransactionData = {
        data: {
          function: marketOrderPayload.function,
          typeArguments: marketOrderPayload.typeArguments,
          functionArguments: marketOrderPayload.functionArguments,
        },
      };

      const txResponse = await signAndSubmitTransaction(transaction);
      await aptosClient(network).waitForTransaction({
        transactionHash: txResponse.hash,
      });

      toast({
        title: "Success",
        description: <TransactionHash hash={txResponse.hash} network={network} />,
      });

      fetchBalances();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Order</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <label>USDC Deposit:</label>
        <input
          type="number"
          value={usdcDeposit}
          onChange={(e) => handleUsdcChange(Number(e.target.value))}
          className="w-24" // Adjust the width to make the input smaller
        />

        <label>Leverage: {leverage}x</label> {/* Display the leverage value */}
        <Slider
          min={1}
          max={20}
          value={[leverage]} // Pass leverage as an array
          onValueChange={(value) => {
            const newLeverage = value[0]; // Extract the first value from the array
            setLeverage(newLeverage);
            updateAmount(usdcDeposit, newLeverage);
          }}
          className="w-40" // Adjust the width to make the slider smaller
        />

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
          className="w-24" // Adjust the width to make the input smaller
        />

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
