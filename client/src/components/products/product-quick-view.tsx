import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogClose, 
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@shared/schema";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [startX, setStartX] = useState(0);
  
  // Reset rotation when product changes
  useEffect(() => {
    setRotationAngle(0);
  }, [product]);

  if (!product) return null;

  // Mock images for rotation - in a real application, you would have actual images for the 360 rotation
  const rotationImages = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  ];

  const currentImageIndex = Math.abs(Math.floor(rotationAngle / 90) % rotationImages.length);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(true);
    setStartX(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRotating) {
      const deltaX = e.clientX - startX;
      setRotationAngle(prevAngle => prevAngle + deltaX / 4);
      setStartX(e.clientX);
    }
  };
  
  const handleMouseUp = () => {
    setIsRotating(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsRotating(true);
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRotating) {
      const deltaX = e.touches[0].clientX - startX;
      setRotationAngle(prevAngle => prevAngle + deltaX / 4);
      setStartX(e.touches[0].clientX);
    }
  };
  
  const handleTouchEnd = () => {
    setIsRotating(false);
  };

  const rotateLeft = () => {
    setRotationAngle(prevAngle => prevAngle - 90);
  };

  const rotateRight = () => {
    setRotationAngle(prevAngle => prevAngle + 90);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-heading font-bold">{product.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              className="product-rotation-view relative h-[400px] bg-gray-50 rounded-lg flex items-center justify-center cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={rotationImages[currentImageIndex]} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain"
                style={{ transform: `rotate(${rotationAngle % 360}deg)` }}
              />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button variant="secondary" size="sm" onClick={rotateLeft}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Rotate Left
                </Button>
                <Button variant="secondary" size="sm" onClick={rotateRight}>
                  Rotate Right
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-sm">
                Drag to rotate 360°
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-neutral-dark/80 mt-1">{product.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Details</h3>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-neutral-dark/80">
                    <li>Category: {product.category}</li>
                    <li>Material: Premium Quality</li>
                    <li>Dimensions: Custom sizes available</li>
                    <li>Color options: Multiple available</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Features</h3>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-neutral-dark/80">
                    <li>Handcrafted by skilled artisans</li>
                    <li>Sustainable materials</li>
                    <li>Durable construction</li>
                    <li>Modern design with timeless appeal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 bg-gray-50">
          <Button className="w-full sm:w-auto flex items-center gap-2" onClick={() => window.open("https://wa.me/919663628302?text=I'm interested in " + product.name, "_blank")}>
            <Phone className="h-4 w-4" />
            Contact for Pricing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}