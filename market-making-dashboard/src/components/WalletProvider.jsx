import React from 'react';
import {
  AptosWalletAdapterProvider,
  Network,
} from '@aptos-labs/wallet-adapter-react';

const WalletProvider = ({ children }) => {
  const manifestURL = '<YOUR_DAPP_MANIFEST_URL>'; // Replace with your DApp manifest URL

  return (
    <AptosWalletAdapterProvider
      optInWallets={["Mizu Wallet"]}
      dappConfig={{
        aptosConnectDappId: "", // Add your DApp ID if applicable
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
