import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProductById, getProducts } from '@/lib/api/products';
import AddToCartButton from '@/components/products/add-to-cart-button';
import ProductReviews from '@/components/products/product-reviews';
import RelatedProducts from '@/components/products/related-products';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold mt-2 text-primary">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-2 mb-4">
            {/* Rating Stars */}
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className={`text-lg ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="mt-auto">
            <AddToCartButton product={product} />
            
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium mb-2">Features:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <ProductReviews productId={params.id} />
      <RelatedProducts currentProductId={params.id} category={product.category} />
    </div>
  );
}