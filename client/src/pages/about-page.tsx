import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold font-heading text-primary mb-6">Our Story</h2>
                <p className="text-neutral-dark/80 mb-4">
                  National Furniture began as a small family-owned workshop in Bangalore two decades ago. 
                  What started as a passion for crafting quality wooden furniture has evolved into one of the 
                  most trusted furniture retailers in the region.
                </p>
                <p className="text-neutral-dark/80 mb-4">
                  For over 20 years, we have stayed true to our founding principles: exceptional craftsmanship, 
                  sustainable materials, and designs that stand the test of time. Our furniture pieces aren't 
                  just functional items – they're heirlooms that tell stories across generations.
                </p>
                <p className="text-neutral-dark/80 mb-6">
                  Today, from our showroom in HSR Layout, Bangalore, we continue to combine traditional 
                  woodworking techniques with modern design sensibilities, creating furniture that brings 
                  both comfort and elegance to Indian homes.
                </p>
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-4xl font-bold text-primary">20+</p>
                    <p className="text-neutral-dark/70">Years of Excellence</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary">10K+</p>
                    <p className="text-neutral-dark/70">Happy Customers</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary">500+</p>
                    <p className="text-neutral-dark/70">Furniture Designs</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=700" 
                    alt="Our showroom in the early days" 
                    className="rounded-lg shadow-md h-48 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=700" 
                    alt="Our modern showroom" 
                    className="rounded-lg shadow-md h-64 w-full object-cover"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=700" 
                    alt="Craftsman at work" 
                    className="rounded-lg shadow-md h-64 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=700" 
                    alt="Our furniture pieces" 
                    className="rounded-lg shadow-md h-48 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading text-primary mb-3">Our Commitment</h2>
              <p className="text-neutral-dark/70 max-w-2xl mx-auto">
                We believe that beautiful furniture should be accessible to everyone
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Quality Craftsmanship</h3>
                <p className="text-neutral-dark/70">
                  We use only the finest materials and employ skilled artisans to create furniture that lasts generations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Sustainable Practices</h3>
                <p className="text-neutral-dark/70">
                  We're committed to environmentally responsible sourcing and manufacturing processes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Customer Service</h3>
                <p className="text-neutral-dark/70">
                  We pride ourselves on personalized service and ensuring complete customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading text-primary mb-3">Our Clients</h2>
              <p className="text-neutral-dark/70 max-w-2xl mx-auto">
                Trusted by prestigious institutions and businesses across India
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              <div className="flex justify-center items-center p-6 h-28 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                <div className="text-center font-bold text-lg text-neutral-dark">GITAM <span className="text-primary">UNIVERSITY</span></div>
              </div>
              
              <div className="flex justify-center items-center p-6 h-28 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                <div className="text-center font-bold text-lg text-neutral-dark">OLIVE <span className="text-primary">CAFE</span></div>
              </div>
              
              <div className="flex justify-center items-center p-6 h-28 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                <div className="text-center font-bold text-lg text-neutral-dark">CLEAR<span className="text-primary">TAX</span></div>
              </div>
              
              <div className="flex justify-center items-center p-6 h-28 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                <div className="text-center font-bold text-lg text-neutral-dark">AMR <span className="text-primary">TECHPARK</span></div>
              </div>
              
              <div className="flex justify-center items-center p-6 h-28 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                <div className="text-center font-bold text-lg text-neutral-dark">SAMOSA <span className="text-primary">PARTY</span></div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-neutral-dark/70">
                We've had the privilege of furnishing offices, educational institutions, restaurants, and commercial spaces across India.
                Our corporate clients trust us for quality, reliability, and exceptional service.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
