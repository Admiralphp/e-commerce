import { Product } from '@/types/product';

// API URL
const API_URL = 'http://api.phoneaccessories.local/api';

// Mock database of products (fallback if API is unavailable)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ultra Slim Phone Case',
    description: 'Sleek, lightweight protection for your phone. This ultra-slim case offers protection without adding bulk, preserving your phone\'s elegant design while safeguarding against scratches and minor impacts.',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'cases',
    brand: 'belkin',
    rating: 4.5,
    reviewCount: 128,
    features: [
      'Ultra-slim design',
      'Shock-absorbing corners',
      'Precision cutouts for all ports',
      'Wireless charging compatible'
    ],
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Fast Wireless Charger Pad',
    description: 'Charge your compatible devices quickly with this wireless charging pad. Supporting up to 15W fast charging, it keeps your devices powered up without the hassle of cables.',
    price: 29.99,
    image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'chargers',
    brand: 'anker',
    rating: 4.7,
    reviewCount: 95,
    features: [
      '15W fast charging',
      'Compatible with Qi-enabled devices',
      'LED charging indicator',
      'Compact design'
    ],
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Premium Wireless Earbuds',
    description: 'Immerse yourself in rich, high-quality sound with these wireless earbuds. Featuring active noise cancellation and long battery life, they\'re perfect for music lovers on the go.',
    price: 89.99,
    image: 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'headphones',
    brand: 'sony',
    rating: 4.8,
    reviewCount: 213,
    features: [
      'Active noise cancellation',
      '8-hour battery life',
      'Touch controls',
      'Water resistant (IPX4)'
    ],
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Tempered Glass Screen Protector',
    description: 'Protect your phone\'s screen with this high-quality tempered glass protector. Offering 9H hardness for maximum protection against scratches and drops.',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'accessories',
    brand: 'belkin',
    rating: 4.5,
    reviewCount: 178,
    features: [
      '9H hardness',
      'Oleophobic coating',
      'Ultra-clear transparency',
      'Easy bubble-free installation'
    ],
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Rugged Armor Phone Case',
    description: 'Heavy-duty protection for your phone with this rugged armor case. Multi-layer design absorbs impacts and protects against drops, scratches, and daily wear.',
    price: 34.99,
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'cases',
    brand: 'belkin',
    rating: 4.6,
    reviewCount: 142,
    features: [
      'Military-grade drop protection',
      'Raised edges for screen protection',
      'Tactile button covers',
      'Non-slip grip'
    ],
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'USB-C Fast Charging Cable',
    description: 'High-speed charging and data transfer with this durable USB-C cable. Nylon braided construction prevents tangles and increases durability.',
    price: 19.99,
    image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'chargers',
    brand: 'anker',
    rating: 4.4,
    reviewCount: 87,
    features: [
      '100W Power Delivery',
      'Nylon braided construction',
      '10Gbps data transfer',
      '6ft length'
    ],
    inStock: true,
    featured: false
  },
  {
    id: '7',
    name: 'Over-Ear Noise Cancelling Headphones',
    description: 'Premium sound quality with advanced noise cancellation technology. These comfortable over-ear headphones provide an immersive audio experience for music, movies, and calls.',
    price: 159.99,
    image: 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'headphones',
    brand: 'sony',
    rating: 4.9,
    reviewCount: 256,
    features: [
      'Active noise cancellation',
      '30-hour battery life',
      'Plush memory foam ear cups',
      'Foldable design'
    ],
    inStock: true,
    featured: false
  },
  {
    id: '8',
    name: 'Phone Grip and Stand',
    description: 'Secure grip and convenient stand for your phone. Makes one-handed use easier and provides a stable stand for watching videos and video calls.',
    price: 9.99,
    image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'accessories',
    brand: 'apple',
    rating: 4.3,
    reviewCount: 112,
    features: [
      'Secure grip for one-handed use',
      'Adjustable stand',
      'Washable adhesive',
      'Multiple colors available'
    ],
    inStock: true,
    featured: false
  },
];

interface GetProductsParams {
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
  exclude?: string;
}

// Function to get filtered products
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  try {
    // First try to get products from the API
    const queryParams = new URLSearchParams();
    
    if (params.category) {
      queryParams.append('category', params.category);
    }
    
    if (params.brand) {
      queryParams.append('brand', params.brand);
    }
    
    if (params.featured !== undefined) {
      queryParams.append('featured', params.featured.toString());
    }
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.minPrice !== undefined) {
      queryParams.append('minPrice', params.minPrice.toString());
    }
    
    if (params.maxPrice !== undefined) {
      queryParams.append('maxPrice', params.maxPrice.toString());
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    
    const url = `${API_URL}/products/?${queryParams.toString()}`;
    console.log('Fetching products from API:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API returned data:', data);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching products from API:', error);
    console.log('Falling back to mock data');
    
    // Fallback to mock data filtering if API fails
    let filteredProducts = [...mockProducts];
    
    // Apply filters
    if (params.category) {
      const categories = params.category.split(',');
      filteredProducts = filteredProducts.filter(product => 
        categories.includes(product.category)
      );
    }
    
    if (params.brand) {
      const brands = params.brand.split(',');
      filteredProducts = filteredProducts.filter(product => 
        brands.includes(product.brand)
      );
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => {
        if (params.minPrice !== undefined && product.price < params.minPrice) {
          return false;
        }
        if (params.maxPrice !== undefined && product.price > params.maxPrice) {
          return false;
        }
        return true;
      });
    }
    
    if (params.featured !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.featured === params.featured
      );
    }
    
    if (params.exclude) {
      filteredProducts = filteredProducts.filter(product => 
        product.id !== params.exclude
      );
    }
    
    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          // Already sorted by newest in the mock data
          break;
      }
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return filteredProducts.slice(startIndex, endIndex);
  }
}

// Function to get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // First try to get the product from the API
    const url = `${API_URL}/products/${id}`;
    console.log('Fetching product from API:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API returned product data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching product from API:', error);
    console.log('Falling back to mock data');
    
    // Fallback to mock data if API fails
    const product = mockProducts.find(product => product.id === id);
    return product || null;
  }
}