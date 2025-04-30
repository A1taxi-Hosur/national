import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/product-card";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section id="products" className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold font-heading text-primary mb-3">Featured Products</h2>
            <p className="text-neutral-dark/70">Our best-selling furniture pieces for your home</p>
          </div>
          <div className="hidden md:block">
            <Button asChild variant="outline">
              <Link href="/products">View All</Link>
            </Button>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-dark/70">No featured products available</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" className="px-6 py-3">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
