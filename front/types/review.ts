export interface Review {
  id: string;
  productId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  date: string;
}