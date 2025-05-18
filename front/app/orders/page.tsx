'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getUserOrders, Order } from '@/lib/api/orders';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to view your orders",
        variant: "destructive",
      });
      router.push('/login?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Failed to Load Orders",
          description: "We couldn't load your order history. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, toast, router]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h2 className="text-xl font-medium mb-4">You haven't placed any orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Order placed: {format(new Date(order.createdAt), 'PPP')}
                  </div>
                  <div className="font-medium">Order #{order.id}</div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-3">Items</h3>
                <ul className="divide-y">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="py-3 flex justify-between">
                      <div className="flex items-center">
                        {item.image && (
                          <div className="w-12 h-12 mr-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping to:</p>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-sm">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order Total:</p>
                    <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <div className="mt-4 flex justify-end">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="mt-4 flex justify-end">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="mt-4 flex justify-end">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
