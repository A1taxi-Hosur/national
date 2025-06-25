import { useState } from "react";
import { Heart, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import ProductQuickView from "./product-quick-view";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className="product-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300">
        <div className="relative group">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-56 object-cover"
          />
          {product.isNew && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-accent text-white">NEW</Badge>
            </div>
          )}
          {product.discountedPrice && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-success text-white">SALE</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-center">
            <Button 
              variant="secondary" 
              className="flex items-center gap-1"
              onClick={() => setIsQuickViewOpen(true)}
            >
              <Eye className="h-4 w-4" />
              <span>Quick View</span>
            </Button>
            <a 
              href={`https://wa.me/919663628302?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20from%20National%20Furniture.%20Please%20provide%20more%20information.`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                <span>Send Enquiry</span>
              </Button>
            </a>
          </div>
        </div>
        <div className="p-4">
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-heading font-bold text-lg mb-1">{product.name}</h3>
            <p className="text-neutral-dark/70 text-sm mb-2">{product.category}</p>
            
            <div className="h-5 mb-3">
              {/* Price information removed as requested */}
            </div>
          </Link>
          
          <div className="flex justify-between items-center">
            <a 
              href={`https://wa.me/919663628302?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20from%20National%20Furniture.%20Please%20provide%20more%20information.`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="sm" className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                <span>Send Enquiry</span>
              </Button>
            </a>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <ProductQuickView
        product={product}
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
