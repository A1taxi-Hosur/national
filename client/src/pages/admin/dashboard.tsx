import { useQuery } from "@tanstack/react-query";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Package, 
  Tag, 
  Image, 
  MessageSquare,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, Offer, Contact } from "@shared/schema";
import { Link } from "wouter";

export default function AdminDashboard() {
  // Fetch the latest products, offers, and contacts
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
  });

  const { data: offers, isLoading: isLoadingOffers } = useQuery<Offer[]>({
    queryKey: ['/api/offers'],
    queryFn: async () => {
      const res = await fetch('/api/offers');
      if (!res.ok) throw new Error('Failed to fetch offers');
      return res.json();
    }
  });

  const { data: contacts, isLoading: isLoadingContacts } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    queryFn: async () => {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    }
  });

  // Get counts
  const productCount = products?.length || 0;
  const offerCount = offers?.length || 0;
  const activeOfferCount = offers?.filter(offer => offer.isActive).length || 0;
  const contactCount = contacts?.length || 0;

  // Get recent items
  const recentProducts = products?.slice(0, 5).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) || [];

  const activeOffers = offers?.filter(offer => offer.isActive).slice(0, 2) || [];

  const isLoading = isLoadingProducts || isLoadingOffers || isLoadingContacts;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-dark">Dashboard</h2>
          <div className="text-sm text-neutral-dark/70">Welcome to National Furniture Admin</div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-dark/70">Total Products</p>
                      <p className="text-2xl font-bold text-neutral-dark">{productCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-success/10 p-3 rounded-full mr-4">
                      <Tag className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-dark/70">Active Offers</p>
                      <p className="text-2xl font-bold text-neutral-dark">{activeOfferCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-accent/10 p-3 rounded-full mr-4">
                      <Tag className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-dark/70">Total Offers</p>
                      <p className="text-2xl font-bold text-neutral-dark">{offerCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-destructive/10 p-3 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-dark/70">Contact Messages</p>
                      <p className="text-2xl font-bold text-neutral-dark">{contactCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Products */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>Recently added products to your store</CardDescription>
                </div>
                <Button asChild variant="default">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">No products found</TableCell>
                      </TableRow>
                    ) : (
                      recentProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>#{product.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-200 rounded-md overflow-hidden mr-3">
                                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="font-medium">{product.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.discountedPrice ? (
                              <div>
                                <span className="font-medium">₹{product.discountedPrice}</span>
                                <span className="text-neutral-dark/50 line-through text-sm ml-2">₹{product.price}</span>
                              </div>
                            ) : (
                              <span className="font-medium">₹{product.price}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.status === 'active' ? 'default' : 'outline'}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Current Offers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Offers</CardTitle>
                  <CardDescription>Active promotions in your store</CardDescription>
                </div>
                <Button asChild variant="default">
                  <Link href="/admin/offers">Manage Offers</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOffers.length === 0 ? (
                    <div className="md:col-span-2 p-6 text-center border border-dashed rounded-lg">
                      <p className="text-neutral-dark/70">No active offers</p>
                      <Button variant="outline" className="mt-2" asChild>
                        <Link href="/admin/offers">Create an Offer</Link>
                      </Button>
                    </div>
                  ) : (
                    activeOffers.map((offer) => (
                      <Card key={offer.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{offer.title}</h4>
                              <p className="text-sm text-neutral-dark/70 mt-1">{offer.description}</p>
                              {offer.expiryDate && (
                                <p className="text-xs text-neutral-dark/50 mt-2">
                                  Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
