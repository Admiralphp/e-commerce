import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PhoneGear</h3>
            <p className="text-muted-foreground mb-4">
              Your one-stop shop for premium phone accessories. Quality products, fast shipping, excellent service.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/products?category=cases" className="text-muted-foreground hover:text-primary">Phone Cases</Link></li>
              <li><Link href="/products?category=chargers" className="text-muted-foreground hover:text-primary">Chargers</Link></li>
              <li><Link href="/products?category=headphones" className="text-muted-foreground hover:text-primary">Headphones</Link></li>
              <li><Link href="/products?category=accessories" className="text-muted-foreground hover:text-primary">Other Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p>123 Tech Street</p>
              <p>San Francisco, CA 94103</p>
              <p className="mt-2">Email: support@phonegear.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PhoneGear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}