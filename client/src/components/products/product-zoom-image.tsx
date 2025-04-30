import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductZoomImageProps {
  imageUrl: string;
  altText: string;
}

export default function ProductZoomImage({ imageUrl, altText }: ProductZoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  }, [imageUrl]);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging) {
      if (isZoomed) {
        handleReset();
      } else {
        handleZoomIn();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full group">
      <div
        ref={imageContainerRef}
        className={`relative w-full h-80 overflow-hidden cursor-zoom-in ${isZoomed ? 'cursor-move' : ''}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            transformOrigin: 'center'
          }}
        />
        
        {isZoomed && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 px-2 py-1 rounded text-sm">
            {Math.round(zoomLevel * 100)}% - Drag to move
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 4}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 1}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        {isZoomed && (
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/80 shadow-sm hover:bg-white"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}