import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import CategorySection from "@/components/home/category-section";
import FeaturedProducts from "@/components/home/featured-products";
import Testimonials from "@/components/home/testimonials";
import { useQuery } from "@tanstack/react-query";
import { Offer, Product } from "@shared/schema";
import { FurnitureLoading } from "@/components/ui/furniture-spinner";
import SEOMeta from "@/components/shared/seo-meta";
import { LocalBusinessStructuredData } from "@/components/shared/structured-data";
import { getKeywordsForPage, siteInfo } from "@/lib/seo-config";

export default function HomePage() {
  // Scroll to top when visiting home page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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

  // SEO keywords for home page
  const homeKeywords = getKeywordsForPage('home');

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Metadata */}
      <SEOMeta 
        title="Premium Furniture Store in HSR Layout" 
        description="National Furniture & Interiors - Premium furniture showroom offering a wide range of home, office, hotel, and restaurant furniture in HSR Layout, Bangalore."
        keywords={homeKeywords}
      />
      
      {/* Structured data for local business */}
      <LocalBusinessStructuredData
        name={siteInfo.siteName}
        description={siteInfo.siteDescription}
        address={siteInfo.address}
        phone={siteInfo.phone}
        email={siteInfo.email}
        url={siteInfo.siteUrl}
        latitude={siteInfo.latitude}
        longitude={siteInfo.longitude}
        openingHours={siteInfo.openingHours}
        images={[`${siteInfo.siteUrl}${siteInfo.logoUrl}`]}
        sameAs={Object.values(siteInfo.socialLinks)}
        priceRange="₹₹-₹₹₹₹"
      />

      <Header />
      
      <main className="flex-grow">
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <FurnitureLoading text="Loading furniture collections..." />
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
