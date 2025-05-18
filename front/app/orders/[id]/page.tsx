'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, cancelOrder } from '@/lib/api/orders';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { XCircle, TruckIcon, PackageCheck } from 'lucide-react';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to view order details",
        variant: "destructive",
      });
      router.push('/login?redirect=orders');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderById(id as string);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: "Failed to Load Order",
          description: "We couldn't load the order details. Please try again later.",
          variant: "destructive",
        });
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, isAuthenticated, router, toast]);

  const handleCancelOrder = async () => {
    try {
      setCancellingOrder(true);
      await cancelOrder(id as string);
        toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled",
      });
      
      // Refresh order data
      const orderData = await getOrderById(id as string);
      setOrder(orderData);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Failed to Cancel Order",
        description: "We couldn't cancel your order. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setCancellingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-4">The order you're looking for does not exist or you don't have permission to view it.</p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  // Status badge colors
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };

  // Status icon
  const StatusIcon = () => {
    switch (order.status) {
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'shipped':
        return <TruckIcon className="h-8 w-8 text-purple-500" />;
      case 'delivered':
        return <PackageCheck className="h-8 w-8 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="mr-4">
            ← Back to Orders
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      </div>

      <div className="bg-muted/40 p-4 rounded-lg mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order Placed</p>
          <p className="font-medium">{format(new Date(order.createdAt), 'PPP')}</p>
        </div>
        
        <div className="flex items-center">
          <StatusIcon />
          <span
            className={`ml-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${
              statusColors[order.status as keyof typeof statusColors]
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden shadow-sm mb-6">
            <h2 className="bg-slate-50 dark:bg-slate-800 p-4 font-medium border-b">Order Items</h2>
            <div className="p-4">
              <ul className="divide-y">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="py-4 flex justify-between">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="w-16 h-16 mr-4">
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
                      <p className="text-sm text-muted-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-sm">
            <h2 className="bg-slate-50 dark:bg-slate-800 p-4 font-medium border-b">Shipping Address</h2>
            <div className="p-4">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg overflow-hidden shadow-sm mb-6">
            <h2 className="bg-slate-50 dark:bg-slate-800 p-4 font-medium border-b">Order Summary</h2>
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t mt-2">
                  <span>Order Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-sm mb-6">
            <h2 className="bg-slate-50 dark:bg-slate-800 p-4 font-medium border-b">Payment</h2>
            <div className="p-4">
              <p>
                <span className="font-medium">Method: </span>
                <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={cancellingOrder}>
                  {cancellingOrder ? "Processing..." : "Cancel Order"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelOrder}>
                    Yes, Cancel Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Link href="/products">
            <Button variant="outline" className="w-full mt-4">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
