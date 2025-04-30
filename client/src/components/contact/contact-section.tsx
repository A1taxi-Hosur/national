import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Clock,
  Phone,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";

export default function ContactSection() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll respond shortly.",
      });
      form.reset();
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: InsertContactMessage) {
    contactMutation.mutate(data);
  }

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Visit Our Showroom</h2>
            <p className="text-neutral-dark/80 mb-8">
              Experience our furniture collection in person at our showroom in HSR Layout, Bangalore. 
              Our team of experts is ready to help you find the perfect pieces for your home.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-secondary p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Address</h3>
                  <p className="text-neutral-dark/70">National Furniture, #123, 5th Main Road</p>
                  <p className="text-neutral-dark/70">HSR Layout, Sector 3</p>
                  <p className="text-neutral-dark/70">Bangalore, Karnataka 560102</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Opening Hours</h3>
                  <p className="text-neutral-dark/70">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                  <p className="text-neutral-dark/70">Sunday: 11:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Contact</h3>
                  <p className="text-neutral-dark/70">Phone: +91 80 2663 4455</p>
                  <p className="text-neutral-dark/70">Email: <a href="mailto:nationalfurniture07@gmail.com" className="hover:text-primary">nationalfurniture07@gmail.com</a></p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold text-primary mb-4">Find Us On</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-secondary p-3 rounded-full text-primary hover:bg-primary hover:text-white transition">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="bg-secondary p-3 rounded-full text-primary hover:bg-primary hover:text-white transition">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="bg-secondary p-3 rounded-full text-primary hover:bg-primary hover:text-white transition">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-neutral-light p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-4">Your message has been sent successfully.</p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="product">Product Information</SelectItem>
                              <SelectItem value="custom">Custom Furniture</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message"
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="w-full px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-light transition"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-primary mb-6">Location Map</h3>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden shadow-md h-96">
            <div className="flex items-center justify-center h-full bg-neutral-light border border-gray-300 rounded-lg">
              <div className="text-center p-4">
                <MapPin className="h-16 w-16 mx-auto text-primary mb-4" />
                <p className="text-neutral-dark font-medium">National Furniture, HSR Layout, Bangalore</p>
                <p className="text-sm text-neutral-dark/70">Interactive map will be loaded here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
