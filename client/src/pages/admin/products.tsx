import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Plus, Edit, Trash2, Clock, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminSidebar from "@/components/layout/admin-sidebar";
import ProductForm from "@/components/admin/product-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function AdminProducts() {
  const { user, isLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["/api/products"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Redirect to="/admin/login" />;
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddingNew(false);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/products/${id}`);
      queryClient.invalidateQueries({queryKey: ["/api/products"]});
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setSelectedProduct(null);
    setIsAddingNew(false);
    queryClient.invalidateQueries({queryKey: ["/api/products"]});
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => {
              setSelectedProduct(null);
              setIsAddingNew(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>

        {selectedProduct || isAddingNew ? (
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                className="mb-4" 
                onClick={() => {
                  setSelectedProduct(null);
                  setIsAddingNew(false);
                }}
              >
                ← Back to Products
              </Button>
              <ProductForm 
                product={selectedProduct} 
                onSuccess={handleFormSuccess}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Recently Added Products Section */}
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Recently Added Products</CardTitle>
                      <CardDescription>Manage your latest product listings</CardDescription>
                    </div>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-500">
                      {error.message || "Failed to load products."}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No products found. Add your first product to get started.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 6)
                        .map((product) => (
                          <div key={product.id} className="border rounded-lg overflow-hidden flex flex-col">
                            <div className="h-36 bg-gray-100 relative">
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
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    product.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {product.status || "inactive"}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium truncate">{product.name}</h3>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  ID: {product.id}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                              <p className="text-sm mb-3">
                                {product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : "Price not set"}
                              </p>
                              <div className="mt-auto pt-2 border-t flex justify-between">
                                <span className="text-xs text-gray-500">
                                  {product.createdAt ? format(new Date(product.createdAt), 'MMM d, yyyy') : 'Date not available'}
                                </span>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                    className="h-8 px-2"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="h-8 px-2 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* All Products Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Products</h2>
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <Card>
                <CardContent className="p-0">
                  {isLoadingProducts ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center text-red-500">
                      {error.message || "Failed to load products."}
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
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              No products found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.id}</TableCell>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : "—"}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    product.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {product.status || "inactive"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
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
          </>
        )}
      </div>
    </div>
  );
}