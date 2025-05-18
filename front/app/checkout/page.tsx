'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createOrder, ShippingAddress, PaymentMethod } from '@/lib/api/orders';
import { clearCartOnServer } from '@/lib/api/cart';
import { getUserProfile } from '@/lib/api/user';

// Countries list for dropdown
const countries = [
  { value: 'france', label: 'France' },
  { value: 'usa', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'germany', label: 'Germany' },
  { value: 'italy', label: 'Italy' },
  { value: 'spain', label: 'Spain' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'japan', label: 'Japan' },
  { value: 'china', label: 'China' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    street: '',
    city: '',
    zipCode: '',
    country: 'france',
    phone: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [notes, setNotes] = useState('');
  
  // Load user profile data
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to complete checkout",
        variant: "destructive",
      });
      router.push('/login?redirect=checkout');
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      });
      router.push('/products');
      return;
    }
    
    // Fetch user profile to pre-fill shipping info
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const profile = await getUserProfile();
          if (profile.address) {
            setShippingAddress({
              name: profile.name || '',
              street: profile.address.street || '',
              city: profile.address.city || '',
              zipCode: profile.address.zipCode || '',
              country: profile.address.country || 'france',
              phone: profile.phone || '',
            });
          } else {
            // Just set the name if we have it
            setShippingAddress({
              ...shippingAddress,
              name: profile.name || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, items.length, router, toast, user]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to complete your purchase",
        variant: "destructive",
      });
      router.push('/login?redirect=checkout');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!shippingAddress.name.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!shippingAddress.street.trim()) {
        throw new Error('Please enter your street address');
      }
      if (!shippingAddress.city.trim()) {
        throw new Error('Please enter your city');
      }
      if (!shippingAddress.zipCode.trim()) {
        throw new Error('Please enter your zip/postal code');
      }
      if (!shippingAddress.country.trim()) {
        throw new Error('Please select your country');
      }
      
      // Create order
      const orderData = {
        shippingAddress,
        paymentMethod,
        notes: notes.trim().length > 0 ? notes : undefined,
      };
      
      const order = await createOrder(orderData);
      
      // Clear cart after successful order
      await clearCartOnServer(user?.id || '');
      clearCart();
        toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been received.`,
      });
      
      // Redirect to success page
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If not authenticated or cart is empty, show nothing (useEffect will redirect)
  if (!isAuthenticated || items.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                  Enter your shipping details for delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input 
                      id="street" 
                      name="street" 
                      placeholder="123 Main St" 
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        placeholder="Paris" 
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        placeholder="75001" 
                        value={shippingAddress.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={shippingAddress.country} 
                      onValueChange={(value) => setShippingAddress({...shippingAddress, country: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="+33 1 23 45 67 89" 
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Select your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="credit_card" 
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1">Credit Card</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1">PayPal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex-1">Bank Transfer</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>
                  Add any special instructions (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Special delivery instructions, gift notes, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center mt-8">
              <Link href="/cart">
                <Button variant="outline">Back to Cart</Button>
              </Link>
              
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your order details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
