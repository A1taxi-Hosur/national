import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Media } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Image as ImageIcon, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MediaSelectorProps {
  onSelect: (url: string) => void;
  selectedUrl?: string;
  buttonText?: string;
}

export default function MediaSelector({ onSelect, selectedUrl, buttonText = "Select Media" }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch media
  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    queryFn: async () => {
      const res = await fetch('/api/media');
      if (!res.ok) throw new Error('Failed to fetch media');
      return res.json();
    }
  });

  // Filter media based on search
  const filteredMedia = media?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSelect = (url: string) => {
    onSelect(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <ImageIcon className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            Choose an image from your uploaded media files.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Media Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No media files found</p>
              <p className="text-sm">Upload some images first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:border-primary group ${
                    selectedUrl === item.url ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => handleSelect(item.url)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {item.type.startsWith('image/') ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {selectedUrl === item.url && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary">
                      Select
                    </Button>
                  </div>
                  
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate" title={item.name}>
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}