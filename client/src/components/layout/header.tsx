import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, X, ChevronDown, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import logoImage from "../../assets/national-furniture-logo.png";
import logoIcon from "../../assets/national-furniture-icon.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Check if current path matches the link
  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };

  // Handle scroll event to add shadow to header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close dropdown when location changes
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`bg-white sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="mr-4">
              <img 
                src={logoIcon}
                alt="National Furniture Icon" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <div>
              <img 
                src={logoImage}
                alt="National Furniture & Interiors" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`nav-link ${isActive('/') && !isActive('/products') && !isActive('/about') && !isActive('/contact') ? 'active' : ''} text-neutral-dark hover:text-primary transition`}>
              Home
            </Link>
            
            <div className="relative" ref={dropdownRef}>
              <div 
                className={`nav-link ${isActive('/products') ? 'active' : ''} text-neutral-dark hover:text-primary transition flex items-center cursor-pointer`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Products
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link href="/products" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      All Products
                    </Link>
                    <Link href="/products/Living Room" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Living Room
                    </Link>
                    <Link href="/products/Bedroom" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Bedroom
                    </Link>
                    <Link href="/products/Dining" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Dining
                    </Link>
                    <Link href="/products/Office" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Office
                    </Link>
                    <Link href="/products/Decor" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Decor
                    </Link>
                    <Link href="/products/Hotel Furniture" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Hotel Furniture
                    </Link>
                    <Link href="/products/Restaurant Furniture" className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white" role="menuitem">
                      Restaurant Furniture
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''} text-neutral-dark hover:text-primary transition`}>
              About
            </Link>
            <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''} text-neutral-dark hover:text-primary transition`}>
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center">
            <button className="mr-3 p-2 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5 text-neutral-dark" />
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden ml-2 p-2 rounded-full hover:bg-gray-100" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-neutral-dark" />
              ) : (
                <Menu className="h-6 w-6 text-neutral-dark" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-3">
              <Link href="/" className="px-2 py-2 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                Home
              </Link>
              
              <div ref={mobileDropdownRef} className="relative">
                <div 
                  className={`px-2 py-2 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md flex justify-between items-center ${isActive('/products') ? 'text-primary' : ''}`}
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                >
                  <span>Products</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isMobileDropdownOpen && (
                  <div className="ml-4 mt-1 border-l-2 border-primary/20 pl-2 space-y-1">
                    <Link href="/products" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      All Products
                    </Link>
                    <Link href="/products/Living Room" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Living Room
                    </Link>
                    <Link href="/products/Bedroom" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Bedroom
                    </Link>
                    <Link href="/products/Dining" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Dining
                    </Link>
                    <Link href="/products/Office" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Office
                    </Link>
                    <Link href="/products/Decor" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Decor
                    </Link>
                    <Link href="/products/Hotel Furniture" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Hotel Furniture
                    </Link>
                    <Link href="/products/Restaurant Furniture" className="block px-2 py-1 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                      Restaurant Furniture
                    </Link>
                  </div>
                )}
              </div>
              
              <Link href="/about" className="px-2 py-2 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                About
              </Link>
              <Link href="/contact" className="px-2 py-2 text-neutral-dark hover:text-primary hover:bg-gray-50 rounded-md">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
