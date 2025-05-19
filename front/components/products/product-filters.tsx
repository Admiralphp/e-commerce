'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const categories = [
  { id: 'cases', name: 'Phone Cases' },
  { id: 'chargers', name: 'Chargers' },
  { id: 'headphones', name: 'Headphones' },
  { id: 'accessories', name: 'Accessories' },
];

const brands = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'anker', name: 'Anker' },
  { id: 'belkin', name: 'Belkin' },
  { id: 'sony', name: 'Sony' },
  { id: 'jbl', name: 'JBL' },
];

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',') || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand')?.split(',') || []
  );

  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([name, value]) => {
      if (value === null) {
        newSearchParams.delete(name);
      } else {
        newSearchParams.set(name, value);
      }
    });
    
    return newSearchParams.toString();
  };

  const handleSort = (value: string) => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          sort: value,
        })}`
      );
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          search: search || null,
        })}`
      );
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    
    setSelectedCategories(updated);
    
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          category: updated.length > 0 ? updated.join(',') : null,
        })}`
      );
    });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const updated = checked
      ? [...selectedBrands, brand]
      : selectedBrands.filter((b) => b !== brand);
    
    setSelectedBrands(updated);
    
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          brand: updated.length > 0 ? updated.join(',') : null,
        })}`
      );
    });
  };

  const handlePriceChange = () => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
        })}`
      );
    });
  };

  const handleReset = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            name="search"
            placeholder="Search products..."
            defaultValue={searchParams.get('search') || ''}
          />
          <Button type="submit" disabled={isPending}>
            Search
          </Button>
        </form>
      </div>
      
      <div>
        <Label htmlFor="sort">Sort By</Label>
        <Select
          defaultValue={searchParams.get('sort') || 'newest'}
          onValueChange={handleSort}
        >
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={['categories', 'brands', 'price']}>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) => 
                        handleBrandChange(brand.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[
                    Number(searchParams.get('minPrice') || 0),
                    Number(searchParams.get('maxPrice') || 200)
                  ]}
                  max={200}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePriceChange}
                  disabled={isPending}
                >
                  Apply
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <Button 
        variant="secondary" 
        onClick={handleReset}
        disabled={isPending}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
}