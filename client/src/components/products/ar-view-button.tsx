import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Box } from "lucide-react";
import { FurnitureSpinner } from "@/components/ui/furniture-spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ARViewButtonProps {
  productName: string;
  productImageUrl: string;
}

export default function ARViewButton({ productName, productImageUrl }: ARViewButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [arSupported, setArSupported] = useState(true); // Optimistically assume support

  // Model URL would typically be a USDZ or GLB file hosted on your server
  // For this implementation, we'll just link to the product image as a fallback
  const modelUrl = productImageUrl;

  const handleARButtonClick = () => {
    setIsDialogOpen(true);
    setIsLoading(true);
    
    // Simulate checking AR support and loading the model
    setTimeout(() => {
      // Check if the device supports AR
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isAndroid = /Android/.test(navigator.userAgent);
      setArSupported(isIOS || isAndroid);
      setIsLoading(false);
    }, 1500);
  };

  const handleViewInAR = () => {
    // On iOS, we would use a USDZ file
    // On Android, we would use Scene Viewer with a GLB file
    // For this implementation, we'll just create a simple experience
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      // iOS AR Quick Look (would normally use a USDZ model)
      window.location.href = `https://app.vectary.com/p/413rYLDNiE725LIrPxC8cT?utm_source=showroom&utm_medium=webvr&utm_campaign=promo`;
    } else {
      // Android Scene Viewer (would normally use a GLB model)
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
    }
    
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 mt-3" 
        onClick={handleARButtonClick}
      >
        <Eye className="h-4 w-4" />
        <span>View in AR</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AR View for {productName}</DialogTitle>
            <DialogDescription>
              Experience this furniture in your space using augmented reality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {isLoading ? (
              <div className="text-center py-6">
                <FurnitureSpinner size="md" className="mx-auto mb-4" />
                <p>Preparing AR experience...</p>
              </div>
            ) : !arSupported ? (
              <div className="text-center py-6">
                <Box className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">AR not supported</p>
                <p className="text-muted-foreground">Your device does not support AR viewing. Try viewing on a mobile iOS or Android device.</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <Eye className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium mb-4">Ready for AR</p>
                <Button onClick={handleViewInAR} size="lg">
                  View in your space
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  This will open your device's AR viewer application.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}