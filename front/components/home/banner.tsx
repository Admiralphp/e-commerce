import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Banner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Premium Phone Accessories for Every Device
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Enhance and protect your smartphone with our high-quality cases, chargers, headphones, and more. Free shipping on orders over $50.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg">Shop Now</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-50 object-cover rounded-lg shadow-xl transform -rotate-2 scale-105">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4">
                    <img
                      src="https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Collection of phone accessories"
                      className="rounded-lg shadow-sm"
                      width={600}
                      height={450}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}