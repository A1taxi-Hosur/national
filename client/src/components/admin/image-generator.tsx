import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Image, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/generate-images");
      return response.json();
    },
    onSuccess: () => {
      setIsGenerating(true);
      toast({
        title: "Image Generation Started",
        description: "AI is generating category-appropriate images for all products. This may take several minutes.",
      });
      
      // Stop the loading indicator after 30 seconds (generation continues in background)
      setTimeout(() => {
        setIsGenerating(false);
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
        toast({
          title: "Generation In Progress",
          description: "Images are being generated in the background. Refresh the products page to see new images as they're completed.",
        });
      }, 30000);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateImages = () => {
    generateImagesMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Image Generator
        </CardTitle>
        <CardDescription>
          Generate category-appropriate furniture images for all products using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Image className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">Generate Product Images</h3>
              <p className="text-sm text-muted-foreground">
                Create professional furniture images matching each product's category
              </p>
            </div>
          </div>
          <Badge variant="secondary">AI Powered</Badge>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Category-specific furniture designs (Living Room, Dining, Bedroom, Office)</li>
            <li>• Professional product photography style</li>
            <li>• High-quality 1024x1024 resolution</li>
            <li>• Automatic file management and optimization</li>
          </ul>
        </div>

        <Button 
          onClick={handleGenerateImages}
          disabled={generateImagesMutation.isPending || isGenerating}
          className="w-full"
        >
          {generateImagesMutation.isPending || isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate All Product Images
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Generation in progress:</strong> AI is creating custom images for each product category. 
              This process runs in the background and may take 5-10 minutes to complete all products.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}