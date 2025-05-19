import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <ProductFilters />
        </div>
        
        <div className="w-full md:w-3/4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}