import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, LayoutDashboard, Image, Tag, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Statistics from "@/components/admin/statistics";
import ProductForm from "@/components/admin/product-form";
import OfferForm from "@/components/admin/offer-form";
import MediaUpload from "@/components/admin/media-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md md:min-h-screen p-4">
          <div className="flex items-center mb-8 mt-2">
            <LayoutDashboard className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          
          <nav className="space-y-2">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Button>
            
            <Button 
              variant={activeTab === "products" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Products
            </Button>
            
            <Button 
              variant={activeTab === "offers" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("offers")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Offers
            </Button>
            
            <Button 
              variant={activeTab === "media" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("media")}
            >
              <Image className="mr-2 h-4 w-4" />
              Media
            </Button>
            
            <Button 
              variant={activeTab === "messages" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <p className="text-sm text-muted-foreground">Welcome, {user.username}!</p>
              </div>
              <Statistics />
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Manage Products</h2>
                <Button onClick={() => {}}>Add New Product</Button>
              </div>
              <ProductForm product={null} />
            </TabsContent>
            
            <TabsContent value="offers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Manage Offers</h2>
                <Button onClick={() => {}}>Add New Offer</Button>
              </div>
              <OfferForm offer={null} />
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Media Library</h2>
              </div>
              <MediaUpload />
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Contact Messages</h2>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <p>Contact messages will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}