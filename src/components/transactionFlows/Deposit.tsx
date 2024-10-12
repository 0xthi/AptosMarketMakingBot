import { isSendableNetwork, aptosClient } from "@/utils";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";
import { useState } from "react"; // Add this import
import axios from 'axios'; // Add axios for API calls

const MARKET_ID = 47; // Set marketId as 47

export function Deposit() { // Change function name to Deposit
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const [amount, setAmount] = useState(0); // Change state to hold amount

  const onSignAndSubmitTransaction = async () => {
    if (!account || !amount) return; // Check for amount
    const totalAmount = amount * 100000000; // Multiply amount by 100000000

    // Fetch deposit payload from API
    const response = await axios.get(`https://perps-tradeapi.kanalabs.io/deposit/?marketId=${MARKET_ID}&amount=${totalAmount}`);
    const depositPayload = response.data.data; // Extract deposit payload

    const transaction: InputTransactionData = {
      data: {
        function: depositPayload.function, // Use function from API response
        typeArguments: depositPayload.typeArguments, // Use typeArguments from API response
        functionArguments: depositPayload.functionArguments, // Use functionArguments from API response
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Deposit </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <input 
          type="number" // Change input type to number for amount
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))} // Update state with amount
          className="border p-2"
        />
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable || !amount}>
          Sign and submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
