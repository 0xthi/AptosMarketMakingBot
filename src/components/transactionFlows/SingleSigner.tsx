import { isSendableNetwork, aptosClient } from "@/utils";
import { parseTypeTag, AccountAddress, U64 } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { TransactionHash } from "../TransactionHash";
import { useState } from "react"; // Add this import

const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

export function SingleSigner() {
  const { toast } = useToast();
  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const [recipientAddress, setRecipientAddress] = useState(""); // Add state for recipient address

  const onSignAndSubmitTransaction = async () => {
    if (!account || !recipientAddress) return; // Check for recipient address
    const transaction: InputTransactionData = {
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [APTOS_COIN],
        functionArguments: [recipientAddress, 100000000], // Use recipient address
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
        <CardTitle>Single Signer Flow</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <input 
          type="text" 
          placeholder="Recipient Address" 
          value={recipientAddress} 
          onChange={(e) => setRecipientAddress(e.target.value)} // Add input for recipient address
          className="border p-2"
        />
        <Button onClick={onSignAndSubmitTransaction} disabled={!sendable || !recipientAddress}>
          Sign and submit transaction
        </Button>
      </CardContent>
    </Card>
  );
}
