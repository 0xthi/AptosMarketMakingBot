import { isSendableNetwork, aptosClient } from "@/utils";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";
import { useState } from "react";
import axios from 'axios';

export function Withdraw({ marketId, fetchBalances }: { marketId: number; fetchBalances: () => void }) {
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const [amount, setAmount] = useState(0);

  const onSignAndSubmitTransaction = async () => {
    if (!account || !amount) return;
    const totalAmount = amount * 1000000;

    // Fetch withdraw payload from API
    const response = await axios.get(`https://perps-tradeapi.kanalabs.io/withdraw/?marketId=${marketId}&amount=${totalAmount}`);
    const withdrawPayload = response.data.data;

    const transaction: InputTransactionData = {
      data: {
        function: withdrawPayload.function,
        typeArguments: withdrawPayload.typeArguments,
        functionArguments: withdrawPayload.functionArguments,
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
      fetchBalances();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Withdraw </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <input 
          type="number"
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2"
        />
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable || !amount}>
          Sign and submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}

