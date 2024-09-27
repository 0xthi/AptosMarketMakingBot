import React from 'react';
import {AptosWalletAdapterProvider} from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

const WalletProvider = ({ children }) => {
  const manifestURL = 'https://aptos-market-making-bot.vercel.app/mizuwallet-connect-manifest.json';

  return (
    <AptosWalletAdapterProvider
      optInWallets={["Mizu Wallet"]}
      dappConfig={{
        aptosConnectDappId: "440423fe-0ee3-4446-9297-26530dc57eea", // Add your DApp ID if applicable
        network: Network.TESTNET,
        mizuwallet: {
          manifestURL: manifestURL,
        },
      }}
      onError={(error) => {
        console.error('Wallet connection error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default WalletProvider;
