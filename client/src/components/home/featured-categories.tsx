import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Category images mapping
  const categoryImages = {
    "living-room": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800",
    "bedroom": "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&q=80&w=800",
    "dining": "https://images.unsplash.com/photo-1617098650990-217c7cf9e66b?auto=format&fit=crop&q=80&w=800",
    "office": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    "decor": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">Explore Our Collections</h2>
          <p className="text-neutral-dark/70 max-w-2xl mx-auto">
            Discover furniture that combines timeless design with modern craftsmanship
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md">
                <Skeleton className="h-64 w-full" />
                <div className="p-5 bg-white">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))
          ) : (
            // Render up to 3 categories
            categories?.slice(0, 3).map((category) => (
              <div key={category.id} className="rounded-lg overflow-hidden shadow-md group cursor-pointer">
                <Link href={`/products/${category.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={categoryImages[category.slug as keyof typeof categoryImages] || categoryImages["living-room"]} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition duration-300"></div>
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="font-heading text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-neutral-dark/70 mb-3">{category.description}</p>
                    <span className="inline-flex items-center text-primary font-medium hover:underline">
                      View Collection
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
