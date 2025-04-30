import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-heading mb-4">NATIONAL FURNITURE</h3>
            <p className="text-white/80 mb-4">Creating beautiful homes since 1972. Visit our showroom in HSR Layout, Bangalore.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-white/80 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-white/80 hover:text-white transition">Products</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-white/80 hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-white/80 hover:text-white transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Product Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/Living Room">
                  <a className="text-white/80 hover:text-white transition">Living Room</a>
                </Link>
              </li>
              <li>
                <Link href="/products/Bedroom">
                  <a className="text-white/80 hover:text-white transition">Bedroom</a>
                </Link>
              </li>
              <li>
                <Link href="/products/Dining">
                  <a className="text-white/80 hover:text-white transition">Dining</a>
                </Link>
              </li>
              <li>
                <Link href="/products/Office">
                  <a className="text-white/80 hover:text-white transition">Office</a>
                </Link>
              </li>
              <li>
                <Link href="/products/Decor">
                  <a className="text-white/80 hover:text-white transition">Decor</a>
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
                  <p>National Furniture,</p>
                  <p>#123, 5th Main Road, HSR Layout, Sector 3, Bangalore, Karnataka 560102</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>+91 80 2663 4455</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>info@nationalfurniture.in</p>
              </div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} National Furniture. All rights reserved. Established 1972.</p>
          <div className="flex space-x-4 text-sm text-white/70">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
