import { Review } from '@/types/review';

// API URL
const API_URL = 'http://api.phoneaccessories.local/api';

// Mock database of reviews for fallback
const mockReviews: Review[] = [
  {
    id: '101',
    productId: '1',
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    rating: 5,
    content: 'This case fits perfectly on my phone and offers great protection without adding bulk. The material feels premium and I love the design.',
    date: '2023-11-15T10:30:00Z'
  },
  {
    id: '102',
    productId: '1',
    user: {
      id: 'user2',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    rating: 4,
    content: 'Good quality case that protects my phone well. Buttons are responsive and the case has a nice grip to it. Only giving 4 stars because the color is slightly different than pictured.',
    date: '2023-10-25T14:45:00Z'
  },
  {
    id: '103',
    productId: '2',
    user: {
      id: 'user3',
      name: 'Jessica Williams',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    rating: 5,
    content: 'This wireless charger is amazing! It charges my phone quickly and the design looks sleek on my nightstand. Highly recommend!',
    date: '2023-11-05T09:20:00Z'
  },
  {
    id: '104',
    productId: '3',
    user: {
      id: 'user4',
      name: 'David Thompson',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    rating: 5,
    content: 'These earbuds have incredible sound quality and the noise cancellation works beautifully. Battery life is as advertised and they\'re comfortable for long periods.',
    date: '2023-10-18T16:10:00Z'
  },
  {
    id: '105',
    productId: '3',
    user: {
      id: 'user5',
      name: 'Amanda Garcia',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    rating: 4,
    content: 'Great sound and comfortable fit. The noise cancellation is good but not perfect. I like the touch controls and battery life is excellent.',
    date: '2023-11-02T11:35:00Z'
  }
];

// Function to get reviews for a specific product
export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const url = `${API_URL}/products/${productId}/reviews`;
    console.log('Fetching reviews from API:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API returned reviews:', data);
    return data.reviews || [];
  } catch (error) {
    console.error('Error fetching reviews from API:', error);
    console.log('Falling back to mock reviews');
    
    // Fallback to mock data if API fails
    return mockReviews.filter(review => review.productId === productId);
  }
}