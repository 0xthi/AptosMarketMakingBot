import React, { useState } from 'react';
import WalletProvider from './components/WalletProvider';
import TradeHistory from './components/TradeHistory';
import MarketMakingToggle from './components/MarketMakingToggle';
import OpenTrades from './components/OpenTrades';
import OrderBook from './components/OrderBook';
import ViewPositions from './components/ViewPositions';
import PlaceOrder from './components/PlaceOrder';
import AccountBalance from './components/AccountBalance';
import HealthCheck from './components/HealthCheck';
import MizuWalletConnection from './components/MizuWalletConnection';
import { Container, Typography, Box } from '@mui/material';
import TransactionHandler from './components/TransactionHandler'; // Import the new component

function App() {
  return (
    <WalletProvider>
      <Container sx={{ maxWidth: '100vw', height: '100vh', padding: '20px', position: 'relative' }}>
        <HealthCheck />
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px' }}>
          Market-Making Dashboard
        </Typography>

        <MarketMakingToggle />

        <Box sx={{ marginTop: '40px' }}>
          <Typography variant="h6">Live Open Trades</Typography>
          <OpenTrades />
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <Typography variant="h6">Trade History</Typography>
          <TradeHistory />
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <OrderBook />
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <ViewPositions marketId={36} />
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <PlaceOrder marketId={36} />
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <AccountBalance /> {/* No need to pass address anymore */}
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <MizuWalletConnection /> {/* No need to pass setAddress */}
        </Box>

        <Box sx={{ marginTop: '40px' }}>
          <TransactionHandler /> {/* Add the TransactionHandler component */}
        </Box>
      </Container>
    </WalletProvider>
  );
}

export default App;
