import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const PlaceOrder = ({ marketId }) => {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('limit'); // 'limit' or 'market'
  const [message, setMessage] = useState('');

  const handlePlaceOrder = async () => {
    const url = orderType === 'limit'
      ? `https://perps-tradeapi.kanalabs.io/limitOrder?marketId=${marketId}&amount=${amount}&price=${price}`
      : `https://perps-tradeapi.kanalabs.io/marketOrder?marketId=${marketId}&amount=${amount}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      const data = await response.json();
      setMessage(`Order placed successfully: ${JSON.stringify(data)}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Place Order</Typography>
      <TextField
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
      />
      {orderType === 'limit' && (
        <TextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
      )}
      <Button variant="contained" onClick={handlePlaceOrder}>
        Place {orderType.charAt(0).toUpperCase() + orderType.slice(1)} Order
      </Button>
      <Button variant="text" onClick={() => setOrderType(orderType === 'limit' ? 'market' : 'limit')}>
        Switch to {orderType === 'limit' ? 'Market' : 'Limit'} Order
      </Button>
      {message && <Typography>{message}</Typography>}
    </Box>
  );
};

export default PlaceOrder;
