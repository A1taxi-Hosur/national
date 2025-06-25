import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Media } from "@shared/schema";
import { Loader2, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEOMeta from "@/components/shared/seo-meta";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: media = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(media.map(item => item.category).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOMeta 
        title="Gallery - National Furniture & Interiors"
        description="Explore our extensive collection of furniture designs and completed projects. See the quality and craftsmanship that defines National Furniture with 15+ years of excellence."
        keywords="furniture gallery, interior design, furniture showroom, living room furniture, dining furniture, bedroom furniture, office furniture, HSR Layout Bangalore"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our Gallery
              </h1>
              <p className="text-xl mb-6 max-w-2xl mx-auto">
                Discover our extensive collection of premium furniture and completed projects showcasing 15+ years of excellence
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {media.length} Images
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:w-48">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No images found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.description || item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-furniture.jpg";
                      }}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1 truncate">
                      {item.description || item.filename}
                    </h3>
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl w-full p-0">
            {selectedImage && (
              <>
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedImage.description || selectedImage.filename}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="p-6">
                  <div className="relative">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.description || selectedImage.filename}
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {selectedImage.category && (
                        <Badge variant="secondary">
                          {selectedImage.category}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedImage.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}