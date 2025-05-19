import Banner from '@/components/home/banner';
import FeaturedProducts from '@/components/home/featured-products';
import Categories from '@/components/home/categories';
import Testimonials from '@/components/home/testimonials';
import Newsletter from '@/components/home/newsletter';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-8">
      <Banner />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </div>
  );
}