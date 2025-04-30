import { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogClose, 
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Phone, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ImageIcon } from "lucide-react";
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
  
  // Image error handling
  const [imageError, setImageError] = useState(false);
  const [rotationImageError, setRotationImageError] = useState(false);
  
  // Zoom related states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'rotate' | 'zoom'>('rotate');
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Reset states when product changes
  useEffect(() => {
    setRotationAngle(0);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
    setViewMode('rotate');
    setImageError(false);
    setRotationImageError(false);
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

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoomLevel);
    if (newZoomLevel === 1) {
      setPosition({ x: 0, y: 0 });
      setIsZoomed(false);
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const handleZoomClick = () => {
    if (!isDragging) {
      if (isZoomed) {
        handleReset();
      } else {
        handleZoomIn();
      }
    }
  };

  const handleZoomMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      e.stopPropagation();
    }
  };

  const handleZoomMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate bounds to prevent dragging outside of the zoomed image area
      const container = imageContainerRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const imageWidth = containerWidth * zoomLevel;
        const imageHeight = containerHeight * zoomLevel;
        
        const maxX = (imageWidth - containerWidth) / 2;
        const maxY = (imageHeight - containerHeight) / 2;
        
        setPosition({
          x: Math.max(Math.min(newX, maxX), -maxX),
          y: Math.max(Math.min(newY, maxY), -maxY)
        });
      }
      e.stopPropagation();
    }
  };

  const handleZoomMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    e.stopPropagation();
  };

  const handleZoomTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
      e.stopPropagation();
    }
  };

  const handleZoomTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      
      // Calculate bounds to prevent dragging outside of the zoomed image area
      const container = imageContainerRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const imageWidth = containerWidth * zoomLevel;
        const imageHeight = containerHeight * zoomLevel;
        
        const maxX = (imageWidth - containerWidth) / 2;
        const maxY = (imageHeight - containerHeight) / 2;
        
        setPosition({
          x: Math.max(Math.min(newX, maxX), -maxX),
          y: Math.max(Math.min(newY, maxY), -maxY)
        });
      }
      e.stopPropagation();
    }
  };

  const handleZoomTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    e.stopPropagation();
  };

  const toggleViewMode = () => {
    // Reset both modes when switching
    setRotationAngle(0);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
    // Reset image error states when toggling view
    if (viewMode === 'rotate') {
      setImageError(false);
    } else {
      setRotationImageError(false);
    }
    setViewMode(viewMode === 'rotate' ? 'zoom' : 'rotate');
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
            <div className="flex flex-col space-y-2">
              <div className="flex justify-start space-x-2 mb-2">
                <Button 
                  variant={viewMode === 'rotate' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode('rotate')}
                >
                  360° View
                </Button>
                <Button 
                  variant={viewMode === 'zoom' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode('zoom')}
                >
                  Zoom View
                </Button>
              </div>
              
              {viewMode === 'rotate' ? (
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
                  {!rotationImageError ? (
                    <img 
                      src={rotationImages[currentImageIndex]} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain"
                      style={{ transform: `rotate(${rotationAngle % 360}deg)` }}
                      onError={() => setRotationImageError(true)}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 max-w-xs text-center">{product.name}</p>
                    </div>
                  )}
                  
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
              ) : (
                <div 
                  ref={imageContainerRef}
                  className={`relative h-[400px] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}
                  onClick={handleZoomClick}
                  onMouseDown={handleZoomMouseDown}
                  onMouseMove={handleZoomMouseMove}
                  onMouseUp={handleZoomMouseUp}
                  onMouseLeave={handleZoomMouseUp}
                  onTouchStart={handleZoomTouchStart}
                  onTouchMove={handleZoomTouchMove}
                  onTouchEnd={handleZoomTouchEnd}
                >
                  {!imageError && product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                        transformOrigin: 'center'
                      }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 max-w-xs text-center">{product.name}</p>
                    </div>
                  )}
                  
                  {isZoomed && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 px-2 py-1 rounded text-sm">
                      {Math.round(zoomLevel * 100)}% - Drag to move
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white"
                      onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                      disabled={zoomLevel >= 4}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white"
                      onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                      disabled={zoomLevel <= 1}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    {isZoomed && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white"
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
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