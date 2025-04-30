import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, Offer } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Loader2, Plus, Edit, Trash2, PackageOpen, Tag, Clock, Image as ImageIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [productsSearch, setProductsSearch] = useState("");
  const [offersSearch, setOffersSearch] = useState("");
  const { toast } = useToast();
  
  // Fetch products
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery<Product[], Error>({
    queryKey: ["/api/products"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Fetch offers
  const {
    data: offers = [],
    isLoading: isLoadingOffers,
    error: offersError,
  } = useQuery<Offer[], Error>({
    queryKey: ["/api/offers"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Define AdminStats type
  interface AdminStats {
    productCount: number;
    categoryCount: number;
    offerCount: number;
    messageCount: number;
    mediaCount: number;
  }

  // Fetch statistics
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Redirect to="/admin/login" />;
  }

  // Handle product deletion
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await apiRequest("DELETE", `/api/products/${id}`);
      
      // Check if the response was successful
      if (response.status === 204 || response.ok) {
        // Only invalidate the queries if the server successfully deleted the product
        queryClient.invalidateQueries({queryKey: ["/api/products"]});
        queryClient.invalidateQueries({queryKey: ["/api/admin/stats"]});
        
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        });
        
        // Force refresh products
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("Failed to delete product. Server returned: " + response.status);
      }
    } catch (error: any) {
      console.error("Delete product error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  // Handle offer deletion
  const handleDeleteOffer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    
    try {
      const response = await apiRequest("DELETE", `/api/offers/${id}`);
      
      // Check if the response was successful
      if (response.status === 204 || response.ok) {
        // Only invalidate the queries if the server successfully deleted the offer
        queryClient.invalidateQueries({queryKey: ["/api/offers"]});
        queryClient.invalidateQueries({queryKey: ["/api/admin/stats"]});
        
        toast({
          title: "Offer deleted",
          description: "The offer has been successfully deleted.",
        });
        
        // Force refresh products
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("Failed to delete offer. Server returned: " + response.status);
      }
    } catch (error: any) {
      console.error("Delete offer error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer.",
        variant: "destructive",
      });
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productsSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(productsSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productsSearch.toLowerCase())
  );

  // Filter offers based on search
  const filteredOffers = offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(offersSearch.toLowerCase()) ||
      offer.description.toLowerCase().includes(offersSearch.toLowerCase())
  );

  // Get recent products and offers
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const recentOffers = [...offers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Content</h1>

        {/* Stats Overview */}
        {isLoadingStats ? (
          <div className="flex justify-center mb-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <PackageOpen className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <h3 className="text-2xl font-bold">{stats.productCount}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Tag className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Offers</p>
                    <h3 className="text-2xl font-bold">{stats.offerCount}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <ImageIcon className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Media Files</p>
                    <h3 className="text-2xl font-bold">{stats.mediaCount}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
        
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>
        
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              {/* Recently Added Products */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recently Added Products
                  </h2>
                  <Link to="/admin/products/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </Link>
                </div>
                
                {isLoadingProducts ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : productsError ? (
                  <Card>
                    <CardContent className="p-6 text-center text-red-500">
                      {productsError.message || "Failed to load products."}
                    </CardContent>
                  </Card>
                ) : recentProducts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No products found. Add your first product to get started.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="h-40 bg-gray-100 relative">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant={product.status === "active" ? "default" : "secondary"}
                            >
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                          <p className="text-sm mb-2">
                            {product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : "Price not set"}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3 truncate">
                            {product.description}
                          </p>
                        </CardContent>
                        <CardFooter className="px-4 py-3 border-t flex justify-between bg-gray-50">
                          <span className="text-xs text-muted-foreground">
                            {product.createdAt ? format(new Date(product.createdAt), 'MMM d, yyyy') : 'Recently added'}
                          </span>
                          <div className="flex space-x-2">
                            <Link to={`/admin/products/edit/${product.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {/* All Products Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">All Products</h2>
                  <Input
                    placeholder="Search products..."
                    value={productsSearch}
                    onChange={(e) => setProductsSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {isLoadingProducts ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : productsError ? (
                      <div className="p-6 text-center text-red-500">
                        {productsError.message || "Failed to load products."}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                No products found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                  {product.price 
                                    ? `₹${Number(product.price).toLocaleString('en-IN')}` 
                                    : "—"}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={product.status === "active" ? "default" : "secondary"}
                                  >
                                    {product.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {product.createdAt 
                                    ? format(new Date(product.createdAt), 'MMM d, yyyy') 
                                    : '—'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Link to={`/admin/products/edit/${product.id}`}>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500 hover:text-red-500"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Offers Tab */}
          <TabsContent value="offers">
            <div className="space-y-6">
              {/* Recent Offers */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recently Added Offers
                  </h2>
                  <Link to="/admin/offers/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Offer
                    </Button>
                  </Link>
                </div>
                
                {isLoadingOffers ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : offersError ? (
                  <Card>
                    <CardContent className="p-6 text-center text-red-500">
                      {offersError.message || "Failed to load offers."}
                    </CardContent>
                  </Card>
                ) : recentOffers.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No offers found. Add your first offer to get started.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentOffers.map((offer) => (
                      <Card key={offer.id} className="overflow-hidden">
                        <div className="h-40 bg-gray-100 relative">
                          {offer.imageUrl ? (
                            <img 
                              src={offer.imageUrl} 
                              alt={offer.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant={offer.isActive ? "default" : "secondary"}
                            >
                              {offer.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {offer.isHomeHeader && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="outline" className="bg-white/80">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-1 truncate">{offer.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 truncate">
                            {offer.description}
                          </p>
                          {offer.expiryDate && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires: {format(new Date(offer.expiryDate), 'MMM d, yyyy')}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="px-4 py-3 border-t flex justify-between bg-gray-50">
                          <span className="text-xs text-muted-foreground">
                            {offer.createdAt ? format(new Date(offer.createdAt), 'MMM d, yyyy') : 'Recently added'}
                          </span>
                          <div className="flex space-x-2">
                            <Link to={`/admin/offers/edit/${offer.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {/* All Offers Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">All Offers</h2>
                  <Input
                    placeholder="Search offers..."
                    value={offersSearch}
                    onChange={(e) => setOffersSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {isLoadingOffers ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : offersError ? (
                      <div className="p-6 text-center text-red-500">
                        {offersError.message || "Failed to load offers."}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOffers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                No offers found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOffers.map((offer) => (
                              <TableRow key={offer.id}>
                                <TableCell>{offer.id}</TableCell>
                                <TableCell className="font-medium">{offer.title}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={offer.isActive ? "default" : "secondary"}
                                  >
                                    {offer.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {offer.isHomeHeader ? (
                                    <Badge variant="outline">Featured</Badge>
                                  ) : (
                                    "—"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {offer.expiryDate 
                                    ? format(new Date(offer.expiryDate), 'MMM d, yyyy') 
                                    : '—'}
                                </TableCell>
                                <TableCell>
                                  {offer.createdAt 
                                    ? format(new Date(offer.createdAt), 'MMM d, yyyy') 
                                    : '—'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Link to={`/admin/offers/edit/${offer.id}`}>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500 hover:text-red-500"
                                      onClick={() => handleDeleteOffer(offer.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}