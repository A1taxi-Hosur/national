import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300">
      <div className="relative">
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
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-neutral-dark/70 text-sm mb-2">{product.category}</p>
        
        {product.discountedPrice ? (
          <div className="flex items-center mb-3">
            <p className="text-primary font-bold">₹{product.discountedPrice}</p>
            <p className="text-neutral-dark/50 line-through text-sm ml-2">₹{product.price}</p>
          </div>
        ) : (
          <p className="text-primary font-bold mb-3">₹{product.price}</p>
        )}
        
        <div className="flex justify-between items-center">
          <Link href={`/product/${product.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
