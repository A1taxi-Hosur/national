import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

// Form schema for media upload
const mediaUploadSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  filename: z.string().min(3, "Filename must be at least 3 characters"),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().optional(),
});

type MediaUploadFormValues = z.infer<typeof mediaUploadSchema>;

interface MediaUploadProps {
  onSuccess?: () => void;
}

export default function MediaUpload({ onSuccess }: MediaUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const form = useForm<MediaUploadFormValues>({
    resolver: zodResolver(mediaUploadSchema),
    defaultValues: {
      url: "",
      filename: "",
      originalName: "",
      mimeType: "",
      size: 0,
    },
  });

  // Handle image URL change to show preview
  const handleUrlChange = (url: string) => {
    form.setValue("url", url);
    setImagePreview(url);
  };

  // Handle media upload
  const mutation = useMutation({
    mutationFn: async (data: MediaUploadFormValues) => {
      const mediaData = {
        filename: data.filename,
        originalName: data.originalName || data.filename,
        mimeType: data.mimeType || "image/jpeg",
        size: data.size || 0,
        url: data.url,
      };
      const res = await apiRequest("POST", "/api/admin/media", mediaData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Media uploaded",
        description: "The media file has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      form.reset();
      setImagePreview(undefined);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MediaUploadFormValues) => {
    mutation.mutate(data);
  };

  // Extract filename from URL for convenience
  const extractFilename = (url: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split("/").pop() || "";
      // Remove query parameters if any
      return filename.split("?")[0];
    } catch (e) {
      return "";
    }
  };

  // Update filename when URL changes if filename is empty
  const handleUrlBlur = () => {
    const url = form.getValues("url");
    if (url && !form.getValues("filename")) {
      const extractedFilename = extractFilename(url);
      if (extractedFilename) {
        form.setValue("filename", extractedFilename);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      onBlur={handleUrlBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filename</FormLabel>
                  <FormControl>
                    <Input placeholder="filename.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="originalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Original filename" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mimeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MIME Type (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="image/jpeg" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Size (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Size in bytes" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Media Preview:</p>
                <div className="border rounded-md overflow-hidden h-48 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Media preview"
                    className="w-full h-full object-contain"
                    onError={() => setImagePreview(undefined)}
                  />
                </div>
              </div>
            )}

            {!imagePreview && (
              <div className="border rounded-md overflow-hidden h-48 bg-gray-50 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto mb-2" />
                  <p>Preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setImagePreview(undefined);
              if (onSuccess) onSuccess();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Media
          </Button>
        </div>
      </form>
    </Form>
  );
}
