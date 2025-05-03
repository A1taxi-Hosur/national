import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/products/product-grid";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import SEOMeta from "@/components/shared/seo-meta";
import { getKeywordsForPage } from "@/lib/seo-config";

export default function ProductsPage() {
  const params = useParams();
  const [_, navigate] = useLocation();
  const categoryParam = params?.category;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  
  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryParam]);
  
  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useQuery<string[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });
  
  // Fetch products
  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products', categoryParam],
    queryFn: async () => {
      const url = categoryParam 
        ? `/api/products?category=${encodeURIComponent(categoryParam)}`
        : '/api/products';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
  });
  
  // Filter and sort products
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    // Safe defaults in case properties are null or undefined
    const priceA = a.discountedPrice !== null ? a.discountedPrice : (a.price || 0);
    const priceB = b.discountedPrice !== null ? b.discountedPrice : (b.price || 0);
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    switch (sortOption) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "newest":
        return dateB - dateA;
      case "featured":
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });
  
  // Get SEO keywords for this product category
  const productKeywords = getKeywordsForPage('products', categoryParam);
  
  // Generate SEO title and description based on category
  const seoTitle = categoryParam 
    ? `${categoryParam} Furniture Collection | National Furniture`
    : 'Browse All Furniture Collections | National Furniture';
    
  const seoDescription = categoryParam
    ? `Explore our premium ${categoryParam.toLowerCase()} furniture collection. High-quality craftsmanship, custom sizes available. Visit our showroom in HSR Layout, Bangalore.`
    : 'Explore our complete furniture collection including bedroom, living room, dining, office, hotel and restaurant furniture. Premium quality at National Furniture & Interiors, Bangalore.';

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Metadata */}
      <SEOMeta 
        title={seoTitle}
        description={seoDescription}
        keywords={productKeywords}
      />
      
      <Header />
      
      <main className="flex-grow bg-neutral-light py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading text-primary mb-2">
              {categoryParam ? `${categoryParam} Collection` : 'All Products'}
            </h1>
            <p className="text-neutral-dark/70">
              Explore our collection of high-quality furniture
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar filters */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h2 className="font-medium text-lg mb-3">Categories</h2>
                {loadingCategories ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div 
                      className={`px-2 py-1 rounded cursor-pointer hover:bg-primary/10 ${!categoryParam ? 'bg-primary/10 font-medium' : ''}`}
                      onClick={() => navigate('/products')}
                    >
                      All Products
                    </div>
                    {categories?.map((category) => (
                      <div 
                        key={category}
                        className={`px-2 py-1 rounded cursor-pointer hover:bg-primary/10 ${categoryParam === category ? 'bg-primary/10 font-medium' : ''}`}
                        onClick={() => navigate(`/products/${category}`)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Products grid */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select 
                      defaultValue={sortOption} 
                      onValueChange={setSortOption}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                      <Skeleton className="h-56 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-5 w-1/4" />
                        <div className="flex justify-between pt-2">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {sortedProducts.length === 0 ? (
                    <div className="text-center p-12">
                      <div className="text-3xl font-bold text-primary mb-2">No products found</div>
                      <p className="text-neutral-dark/70">
                        Try adjusting your search or filter to find what you're looking for.
                      </p>
                    </div>
                  ) : (
                    <ProductGrid products={sortedProducts} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
