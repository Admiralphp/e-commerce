'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById, Order } from '@/lib/api/orders';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      
      <div className="border rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4">Order Details</h2>
        {loading ? (
          <p className="text-center py-2">Loading order details...</p>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <span>Order Number:</span>
              <span className="font-medium">{order ? `#${order.id}` : `#ORD-${Math.floor(100000 + Math.random() * 900000)}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Date:</span>
              <span className="font-medium">{order ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">{order ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}</span>
            </div>
            {order && (
              <div className="mt-4 pt-4 border-t">
                <p className="font-medium mb-2">Items:</p>
                <ul className="text-sm text-left">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between mb-1">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-right font-medium mt-2">
                  Total: ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="space-y-4">
        <Link href="/products">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}