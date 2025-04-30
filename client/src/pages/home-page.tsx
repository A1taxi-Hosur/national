import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import CategorySection from "@/components/home/category-section";
import FeaturedProducts from "@/components/home/featured-products";
import Testimonials from "@/components/home/testimonials";
import { useQuery } from "@tanstack/react-query";
import { Offer, Product } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
    queryFn: async () => {
      const res = await fetch('/api/products?featured=true');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
  });

  const { data: offers, isLoading: isLoadingOffers } = useQuery<Offer[]>({
    queryKey: ['/api/offers'],
    queryFn: async () => {
      const res = await fetch('/api/offers');
      if (!res.ok) throw new Error('Failed to fetch offers');
      return res.json();
    }
  });

  const activeOffer = offers?.find(offer => offer.isActive);

  const isLoading = isLoadingProducts || isLoadingOffers;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <HeroSection offer={activeOffer} />
            <CategorySection />
            <FeaturedProducts products={products || []} />
            <Testimonials />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
