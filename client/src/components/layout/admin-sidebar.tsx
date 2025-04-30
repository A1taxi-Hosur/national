import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, LayoutDashboard, Tag, Image, MessageSquare, LogOut, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "../../assets/logo-new.png";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-6 hidden md:block">
      <div className="flex items-center mb-8">
        <img
          src={logoImage}
          alt="National Furniture Logo"
          className="h-10 w-10 object-contain mr-3"
        />
        <div>
          <h1 className="text-lg font-bold text-primary">NATIONAL FURNITURE</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      
      <div className="mt-2 mb-4">
        <p className="text-sm text-muted-foreground">Welcome, {user?.username}!</p>
      </div>
      
      <nav className="space-y-4">
        <div className="pb-2">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">MAIN</h3>
          <Link href="/admin/dashboard">
            <Button 
              variant={isActive("/admin/dashboard") ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="pb-2">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">CONTENT</h3>
          <div className="space-y-1">
            <Link href="/admin/dashboard">
              <Button 
                variant={isActive("/admin/dashboard") ? "default" : "secondary"} 
                className="w-full justify-start bg-secondary/50 hover:bg-secondary/70 font-medium"
              >
                <PackageOpen className="mr-2 h-4 w-4 text-primary" />
                Manage Products & Offers
              </Button>
            </Link>
            
            <Link href="/admin/products">
              <Button 
                variant={isActive("/admin/products") ? "default" : "ghost"} 
                className="w-full justify-start pl-9"
              >
                <Tag className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            
            <Link href="/admin/offers">
              <Button 
                variant={isActive("/admin/offers") ? "default" : "ghost"} 
                className="w-full justify-start pl-9"
              >
                <Tag className="mr-2 h-4 w-4" />
                Offers
              </Button>
            </Link>
            
            <Link href="/admin/media">
              <Button 
                variant={isActive("/admin/media") ? "default" : "ghost"} 
                className="w-full justify-start"
              >
                <Image className="mr-2 h-4 w-4" />
                Media
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="pb-2">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">COMMUNICATION</h3>
          <Link href="/admin/messages">
            <Button 
              variant={isActive("/admin/messages") ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </Link>
        </div>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
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
    </div>
  );
}