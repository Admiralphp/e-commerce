import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
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
        <div className="flex justify-between mb-2">
          <span>Order Number:</span>
          <span className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Date:</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-medium text-green-600">Processing</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Link href="/products">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}