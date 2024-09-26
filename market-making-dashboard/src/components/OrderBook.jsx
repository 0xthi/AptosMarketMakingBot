import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function OrderBook() {
  const [orderBook, setOrderBook] = useState([]);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch('https://perps-tradeapi.kanalabs.io/orderBook');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrderBook(data);
      } catch (error) {
        console.error('Error fetching order book:', error);
      }
    };

    fetchOrderBook();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Order Book</Typography>
      {orderBook.length > 0 ? (
        orderBook.map((order, index) => (
          <Typography key={index}>
            {order.details}
          </Typography>
        ))
      ) : (
        <Typography>No orders available</Typography>
      )}
    </Box>
  );
}

export default OrderBook;
