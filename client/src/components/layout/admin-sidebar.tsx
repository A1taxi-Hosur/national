import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Package, 
  Tag, 
  Image, 
  Settings, 
  LogOut,
  Loader2
} from "lucide-react";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Check if current path matches the link
  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-accent text-white h-screen flex-shrink-0 sticky top-0 overflow-y-auto">
      <div className="p-4 border-b border-accent-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
          </svg>
          <div>
            <h3 className="font-bold text-xl">Admin Panel</h3>
            <p className="text-xs opacity-70">National Furniture</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-4">
        <Link href="/admin/dashboard">
          <a className={`flex items-center px-4 py-3 ${isActive('/admin/dashboard') || isActive('/admin') ? 'bg-accent-700' : 'hover:bg-accent-700'} transition`}>
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </a>
        </Link>
        <Link href="/admin/products">
          <a className={`flex items-center px-4 py-3 ${isActive('/admin/products') ? 'bg-accent-700' : 'hover:bg-accent-700'} transition`}>
            <Package className="h-5 w-5 mr-3" />
            Products
          </a>
        </Link>
        <Link href="/admin/offers">
          <a className={`flex items-center px-4 py-3 ${isActive('/admin/offers') ? 'bg-accent-700' : 'hover:bg-accent-700'} transition`}>
            <Tag className="h-5 w-5 mr-3" />
            Offers
          </a>
        </Link>
        <Link href="/admin/media">
          <a className={`flex items-center px-4 py-3 ${isActive('/admin/media') ? 'bg-accent-700' : 'hover:bg-accent-700'} transition`}>
            <Image className="h-5 w-5 mr-3" />
            Media
          </a>
        </Link>
        <Link href="/admin/settings">
          <a className={`flex items-center px-4 py-3 ${isActive('/admin/settings') ? 'bg-accent-700' : 'hover:bg-accent-700'} transition`}>
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </a>
        </Link>
      </nav>
      
      <div className="absolute bottom-0 w-64 border-t border-accent-700 p-4">
        <Button 
          variant="outline" 
          className="flex w-full items-center justify-center bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </>
          )}
        </Button>
        {user && (
          <p className="text-white/60 text-xs mt-2 text-center">
            Logged in as {user.username}
          </p>
        )}
      </div>
    </div>
  );
}
