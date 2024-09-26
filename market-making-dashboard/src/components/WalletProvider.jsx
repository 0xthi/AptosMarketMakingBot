import React from 'react';
import {AptosWalletAdapterProvider} from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

const WalletProvider = ({ children }) => {
  const manifestURL = 'https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json';

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
