import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, Image as ImageIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProductFormProps {
  product: Product | null;
  onSuccess?: () => void;
}

// Define product form schema
const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().min(1, "Image is required"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be a positive number").optional(),
  discountedPrice: z.coerce.number().positive("Discounted price must be a positive number").optional(),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch categories
  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });

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

  // Initialize form with product data if editing
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      price: product.price ?? undefined,
      discountedPrice: product.discountedPrice || undefined,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      status: product.status || "active",
    } : {
      name: "",
      description: "",
      imageUrl: "",
      category: "",
      price: undefined,
      discountedPrice: undefined,
      isNew: false,
      isFeatured: false,
      status: "active",
    },
  });

  // Create or update product mutation
  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (product) {
        // Update existing product
        const res = await apiRequest("PUT", `/api/products/${product.id}`, values);
        return res.json();
      } else {
        // Create new product
        const res = await apiRequest("POST", "/api/products", values);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: product ? "Product updated" : "Product created",
        description: product ? "The product has been updated successfully" : "The product has been created successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: ProductFormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Product name" 
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
                  placeholder="Product description" 
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
              <FormLabel>Product Image</FormLabel>
              <div className="flex flex-col space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <FormControl>
                    <Input 
                      {...field}
                      className="hidden"
                    />
                  </FormControl>
                  
                  <div className="border rounded-md p-2">
                    <Label htmlFor="product-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : imagePreview ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={imagePreview} 
                            alt="Product preview" 
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
                        id="product-image"
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories ? (
                      categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Living Room">Living Room</SelectItem>
                        <SelectItem value="Bedroom">Bedroom</SelectItem>
                        <SelectItem value="Dining">Dining</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Decor">Decor</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discounted Price (₹) (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : undefined;
                      field.onChange(value);
                    }}
                    disabled={mutation.isPending} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    disabled={mutation.isPending} 
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Mark as New</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    disabled={mutation.isPending} 
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Feature on Homepage</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
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
                {product ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
