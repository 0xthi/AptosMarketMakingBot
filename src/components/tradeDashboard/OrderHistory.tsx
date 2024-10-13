import React, { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../ui/table'; // Importing Table components
import { Typography } from '@mui/material';
import { Badge } from '../ui/badge'; // Importing Badge component
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface OrderHistoryProps {
  marketId: number;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ marketId }) => {
  const { account } = useWallet();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderHistory = async () => {
    if (!account) return;

    try {
      const response = await fetch(`https://perps-tradeapi.kanalabs.io/orderHistory/?address=${account.address}&type=all&marketId=${marketId}`);
      const data = await response.json();
      if (data.status) {
        setOrderHistory(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Error fetching order history');
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [account, marketId]);

  // Function to truncate order ID
  const truncateOrderId = (orderId: string) => {
    return `${orderId.slice(0, 2)}...${orderId.slice(-3)}`;
  };

  return (
    <Card style={{ marginTop: '16px' }}>
      <CardHeader>
        <Typography variant="h6">Order History</Typography>
      </CardHeader>
      <CardContent>
        {error && <Typography color="error">{error}</Typography>}
        {orderHistory.length > 0 ? (
          <Table className="mt-4" style={{ width: '100%' }}>
            <TableHead>
              <TableRow style={{ display: 'flex' }}>
                <TableCell style={{ flex: '1', textAlign: 'left' }}>Order ID</TableCell>
                <TableCell style={{ flex: '1', textAlign: 'center' }}>Direction</TableCell>
                <TableCell style={{ flex: '1', textAlign: 'center' }}>Leverage</TableCell>
                <TableCell style={{ flex: '1', textAlign: 'right' }}>Total Filled Size (USDC)</TableCell>
                <TableCell style={{ flex: '1', textAlign: 'right' }}>Average Execution Price (USDC)</TableCell>
                <TableCell style={{ flex: '1', textAlign: 'center' }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistory.map((order) => (
                <TableRow key={order.order_id} style={{ display: 'flex' }}>
                  <TableCell style={{ flex: '1', textAlign: 'left' }}>{truncateOrderId(order.order_id)}</TableCell>
                  <TableCell style={{ flex: '1', textAlign: 'center', color: order.direction === 'buy' ? 'green' : 'red' }}>
                    {order.direction === 'buy' ? 'Buy' : 'Sell'}
                  </TableCell>
                  <TableCell style={{ flex: '1', textAlign: 'center' }}>{order.leverage}</TableCell>
                  <TableCell style={{ flex: '1', textAlign: 'right' }}>{order.total_filled}</TableCell>
                  <TableCell style={{ flex: '1', textAlign: 'right' }}>{(order.average_execution_price / 1000).toFixed(3)}</TableCell>
                  <TableCell style={{ flex: '1', textAlign: 'center' }}>{order.type === 'limit' ? 'Limit' : 'Market'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1">No orders found.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
