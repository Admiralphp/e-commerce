import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getProducts } from '@/lib/api/products';

export default async function FeaturedProducts() {
  const products = await getProducts({ featured: true, limit: 4 });

  return (
    <section className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Our most popular accessories, hand-picked for you</p>
        </div>
        <Link href="/products" className="mt-4 md:mt-0">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="secondary" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}