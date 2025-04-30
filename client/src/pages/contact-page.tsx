import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";
import { getPlaceData, getDirectionsUrl } from "@/lib/google-maps";
import { 
  MapPin, 
  FacebookIcon, 
  Instagram, 
  Twitter,
  ExternalLink 
} from "lucide-react";

export default function ContactPage() {
  const placeData = getPlaceData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-white">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-heading text-primary mb-4">Contact Us</h1>
              <p className="text-neutral-dark/80 max-w-2xl mx-auto">
                Experience our furniture collection in person at our showroom in HSR Layout, Bangalore.
                Our team of experts is ready to help you find the perfect pieces for your home.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold font-heading text-primary mb-6">Get In Touch</h2>
                <ContactForm />
                
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
              
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-primary mb-4">Visit Our Store</h2>
                <ContactInfo />
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold font-heading text-primary mb-6">Location Map</h3>
              <div className="aspect-w-16 aspect-h-9 bg-neutral-light rounded-lg overflow-hidden shadow-md h-96 relative">
                <div className="flex flex-col items-center justify-center h-full bg-neutral-light border border-gray-300 rounded-lg">
                  <MapPin className="h-16 w-16 text-primary mb-4" />
                  <p className="text-neutral-dark font-medium text-center">{placeData.name}</p>
                  <p className="text-sm text-neutral-dark/70 text-center max-w-md mx-auto">{placeData.formatted_address}</p>
                  <a 
                    href={getDirectionsUrl(placeData.formatted_address)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-primary hover:text-primary/80"
                  >
                    <span className="mr-1">Get directions on Google Maps</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
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
