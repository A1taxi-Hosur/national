import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import { 
  PhoneIcon, 
  Clock, 
  MapPin, 
  Mail, 
  FacebookIcon, 
  Instagram, 
  Twitter
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-white">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold font-heading text-primary mb-6">Visit Our Showroom</h2>
                <p className="text-neutral-dark/80 mb-8">
                  Experience our furniture collection in person at our showroom in HSR Layout, Bangalore. 
                  Our team of experts is ready to help you find the perfect pieces for your home.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Address</h3>
                      <p className="text-neutral-dark/70">National Furniture, #123, 5th Main Road</p>
                      <p className="text-neutral-dark/70">HSR Layout, Sector 3</p>
                      <p className="text-neutral-dark/70">Bangalore, Karnataka 560102</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Opening Hours</h3>
                      <p className="text-neutral-dark/70">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p className="text-neutral-dark/70">Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary p-3 rounded-full mr-4">
                      <PhoneIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Contact</h3>
                      <p className="text-neutral-dark/70">Phone: +91 80 2663 4455</p>
                      <p className="text-neutral-dark/70">Email: info@nationalfurniture.in</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold font-heading text-primary mb-4">Find Us On</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-secondary p-3 rounded-full text-primary hover:bg-primary hover:text-white transition">
                      <FacebookIcon className="h-6 w-6" />
                    </a>
                    <a href="#" className="bg-secondary p-3 rounded-full text-primary hover:bg-primary hover:text-white transition">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" className="bg-secondary p-3 rounded-full text-primary hover:bg-primary hover:text-white transition">
                      <Twitter className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <ContactForm />
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold font-heading text-primary mb-6">Location Map</h3>
              <div className="aspect-w-16 aspect-h-9 bg-neutral-light rounded-lg overflow-hidden shadow-md h-96 relative">
                <div className="flex items-center justify-center h-full bg-neutral-light border border-gray-300 rounded-lg">
                  <div className="text-center p-4">
                    <MapPin className="h-16 w-16 mx-auto text-primary mb-4" />
                    <p className="text-neutral-dark font-medium">National Furniture, HSR Layout, Bangalore</p>
                    <p className="text-sm text-neutral-dark/70">Interactive map - Location: HSR Layout, Bangalore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
