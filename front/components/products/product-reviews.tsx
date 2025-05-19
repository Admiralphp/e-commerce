import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getReviewsByProductId } from '@/lib/api/reviews';

interface ProductReviewsProps {
  productId: string;
}

export default async function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = await getReviewsByProductId(productId);

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">There are no reviews yet for this product.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id}>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.user.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex text-yellow-500 mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              </div>
              <Separator className="mt-6" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}