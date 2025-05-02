import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@shared/schema";
import ProductZoomImage from "@/components/products/product-zoom-image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  
  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          navigate("/products");
        }
        throw new Error('Failed to fetch product');
      }
      return res.json();
    }
  });
  
  // Fetch related products
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', { related: id }],
    queryFn: async () => {
      if (!product) return [];
      
      const res = await fetch(`/api/products?category=${product.category}&limit=3&exclude=${id}`);
      if (!res.ok) throw new Error('Failed to fetch related products');
      return res.json();
    },
    enabled: !!product,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button asChild>
              <a href="/products">View all products</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-8" 
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product image with zoom functionality */}
            <div>
              <ProductZoomImage 
                imageUrl={product.imageUrl} 
                altText={product.name} 
              />
              <p className="text-center text-sm text-neutral-dark/70 mt-2">
                Click to zoom, drag to move when zoomed
              </p>
            </div>
            
            {/* Product info */}
            <div>
              <h1 className="text-3xl font-bold font-heading text-primary mb-2">{product.name}</h1>
              <p className="text-neutral-dark/70 mb-4">{product.category}</p>
              
              <div className="mb-6">
                <a 
                  href={`https://wa.me/919663628302?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20from%20National%20Furniture.%20Please%20provide%20more%20information.`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                    <Send className="h-4 w-4" />
                    <span>Contact for Pricing</span>
                  </Button>
                </a>
              </div>
              
              <Tabs defaultValue="details" className="mt-8">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="care">Care</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="mb-4 text-neutral-dark/80">{product.description}</p>
                  
                  <h3 className="text-lg font-medium mb-2">Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-dark/80">
                    <li>Premium quality materials</li>
                    <li>Handcrafted by skilled artisans</li>
                    <li>Contemporary design with timeless appeal</li>
                    <li>Comfortable and durable construction</li>
                  </ul>
                </TabsContent>
                <TabsContent value="specifications" className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Materials</h3>
                  <p className="mb-4 text-neutral-dark/80">
                    Crafted with high-quality materials including premium wood, fabric, and metal components.
                  </p>
                  
                  <h3 className="text-lg font-medium mb-2">Dimensions</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-neutral-dark/80">
                      <p className="font-medium">Custom sizes available</p>
                      <p>Contact us for specific dimensions</p>
                    </div>
                    <div className="text-neutral-dark/80">
                      <p className="font-medium">Weight</p>
                      <p>Varies by configuration</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Colors</h3>
                  <p className="text-neutral-dark/80">
                    Available in various colors and finishes. Contact for customization options.
                  </p>
                </TabsContent>
                <TabsContent value="care" className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Cleaning & Maintenance</h3>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-dark/80">
                    <li>Dust regularly with a clean, soft cloth</li>
                    <li>For wood surfaces, use a mild wood cleaner and avoid harsh chemicals</li>
                    <li>For upholstery, vacuum regularly and clean spills immediately</li>
                    <li>Keep away from direct sunlight to prevent fading</li>
                    <li>Use coasters for drinks and placemats for hot items</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}