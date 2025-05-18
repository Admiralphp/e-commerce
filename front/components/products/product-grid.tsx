import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/api/products';
import { useSearchParams } from 'next/navigation';

interface ProductGridProps {
  searchParams?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const category = searchParams?.category || '';
  const search = searchParams?.search || '';
  const sort = searchParams?.sort || 'newest';
  const page = Number(searchParams?.page || '1');
  
  const products = await getProducts({ 
    category, 
    search, 
    sort, 
    page,
    limit: 12
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
        <Link href="/products">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="flex items-center justify-between">
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <div className="flex text-yellow-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < product.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="secondary" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}