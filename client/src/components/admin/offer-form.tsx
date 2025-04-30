import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Offer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, Image as ImageIcon, CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface OfferFormProps {
  offer: Offer | null;
  onSuccess?: () => void;
}

// Define offer form schema
const offerFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().min(1, "Image is required"),
  expiryDate: z.date().optional(),
  isActive: z.boolean().default(true),
  isHomeHeader: z.boolean().default(false),
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function OfferForm({ offer, onSuccess }: OfferFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(offer?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  
  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    
    setIsUploading(true);
    
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      form.setValue('imageUrl', data.url);
      setImagePreview(data.url);
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Initialize form with offer data if editing
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: offer ? {
      title: offer.title,
      description: offer.description,
      imageUrl: offer.imageUrl || "",
      expiryDate: offer.expiryDate ? new Date(offer.expiryDate) : undefined,
      isActive: offer.isActive,
      isHomeHeader: offer.isHomeHeader || false,
    } : {
      title: "",
      description: "",
      imageUrl: "",
      expiryDate: undefined,
      isActive: true,
      isHomeHeader: false,
    },
  });

  // Create or update offer mutation
  const mutation = useMutation({
    mutationFn: async (values: OfferFormValues) => {
      if (offer) {
        // Update existing offer
        const res = await apiRequest("PUT", `/api/offers/${offer.id}`, values);
        return res.json();
      } else {
        // Create new offer
        const res = await apiRequest("POST", "/api/offers", values);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
      toast({
        title: offer ? "Offer updated" : "Offer created",
        description: offer ? "The offer has been updated successfully" : "The offer has been created successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${offer ? "update" : "create"} offer: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: OfferFormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Offer title" 
                  {...field} 
                  disabled={mutation.isPending} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Offer description" 
                  rows={3} 
                  {...field} 
                  disabled={mutation.isPending} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Image</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <FormControl>
                    <Input 
                      {...field}
                      className="hidden"
                    />
                  </FormControl>
                  
                  <div className="border rounded-md p-2">
                    <Label htmlFor="offer-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : imagePreview ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={imagePreview} 
                            alt="Offer preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                      <Input 
                        id="offer-image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={mutation.isPending || isUploading}
                      />
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Input
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Or paste image URL here"
                    disabled={mutation.isPending || isUploading}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      disabled={mutation.isPending}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Make this offer visible to customers
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={mutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isHomeHeader"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Feature in Home Header</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Display this offer in the homepage hero section
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={mutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {offer ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              offer ? 'Update Offer' : 'Create Offer'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
