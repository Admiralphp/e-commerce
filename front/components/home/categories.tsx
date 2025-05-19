import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'cases',
    name: 'Phone Cases',
    description: 'Stylish protection for your device',
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'chargers',
    name: 'Chargers',
    description: 'Fast charging solutions',
    image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'headphones',
    name: 'Headphones',
    description: 'Premium audio experience',
    image: 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Essential add-ons for your phone',
    image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function Categories() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Browse our wide selection of phone accessories to find exactly what you need
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/products?category=${category.id}`}
            className="group"
          >
            <div className="overflow-hidden rounded-lg bg-muted aspect-square relative">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="text-sm opacity-90 mb-2">{category.description}</p>
                <div className="flex items-center text-sm font-medium">
                  <span>Shop now</span>
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}