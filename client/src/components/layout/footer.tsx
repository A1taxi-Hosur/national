import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, ExternalLink, UserCog } from "lucide-react";
import { getPlaceData, getDirectionsUrl, formatPhoneNumber } from "@/lib/google-maps";
import { useAuth } from "@/hooks/use-auth";

export default function Footer() {
  const placeData = getPlaceData();
  const { user } = useAuth();
  
  return (
    <footer className="bg-accent text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-heading mb-4">NATIONAL FURNITURE & INTERIORS</h3>
            <p className="text-white/80 mb-4">Creating beautiful homes. Visit our showroom in HSR Layout, Bangalore.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/nationalfurnitureandinteriors/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.justdial.com/jdmart/Bangalore/National-Furniture-Interiors-Opposite-to-Purva-Fairmount-Hsr-Layout-Sector-2/080PXX80-XX80-161203142958-H2Z7_BZDET/catalogue" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition"
              >
                <img 
                  src="/justdial.webp" 
                  alt="JustDial" 
                  className="h-6 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/80 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Product Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/Living Room" className="text-white/80 hover:text-white transition">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/products/Bedroom" className="text-white/80 hover:text-white transition">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/products/Dining" className="text-white/80 hover:text-white transition">
                  Dining
                </Link>
              </li>
              <li>
                <Link href="/products/Office" className="text-white/80 hover:text-white transition">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/products/Decor" className="text-white/80 hover:text-white transition">
                  Decor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-white/80">
              <div className="flex items-start mb-2">
                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p>{placeData.name}</p>
                  <p>{placeData.formatted_address}</p>
                  <a 
                    href={getDirectionsUrl(placeData.formatted_address)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition inline-flex items-center mt-1"
                  >
                    <span className="mr-1 text-sm">Get directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <a 
                  href={`tel:${placeData.international_phone_number.replace(/\s/g, '')}`}
                  className="text-white/80 hover:text-white transition"
                >
                  {formatPhoneNumber(placeData.formatted_phone_number)}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <a href="mailto:nationalfurniture07@gmail.com" className="text-white/80 hover:text-white transition">
                  nationalfurniture07@gmail.com
                </a>
              </div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col justify-between items-center">
          <div className="text-center mb-3">
            <p className="text-white/70 text-sm mb-1">&copy; {new Date().getFullYear()} National Furniture & Interiors. All rights reserved.</p>
            <p className="text-white/50 text-xs">Website designed by ZARA CREATIONS</p>
          </div>
          <div className="flex space-x-4 text-sm text-white/70 items-center">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Shipping Policy</a>
            <Link 
              href={user ? "/admin/dashboard" : "/admin/login"} 
              className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md ml-2 transition"
            >
              <UserCog className="h-3 w-3 mr-1" />
              <span className="text-xs">{user ? "Admin" : "Admin"}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
