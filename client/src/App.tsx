import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import ContactPage from "@/pages/contact-page";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOffers from "@/pages/admin/offers";
import AdminMedia from "@/pages/admin/media";
import BlockedPage from "@/pages/blocked-page";

function Router() {
  return (
    <Switch>
      {/* Show blocked page for all regular routes */}
      <Route path="/" component={BlockedPage} />
      <Route path="/about" component={BlockedPage} />
      <Route path="/products" component={BlockedPage} />
      <Route path="/products/:category" component={BlockedPage} />
      <Route path="/product/:id" component={BlockedPage} />
      <Route path="/contact" component={BlockedPage} />
      
      {/* Admin Routes - Still accessible */}
      <Route path="/admin/login" component={AdminLogin} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/products/edit/:id" component={AdminProducts} />
      <ProtectedRoute path="/admin/products/new" component={AdminProducts} />
      <ProtectedRoute path="/admin/offers" component={AdminOffers} />
      <ProtectedRoute path="/admin/offers/edit/:id" component={AdminOffers} />
      <ProtectedRoute path="/admin/offers/new" component={AdminOffers} />
      <ProtectedRoute path="/admin/media" component={AdminMedia} />
      
      {/* Fallback to blocked page */}
      <Route component={BlockedPage} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
