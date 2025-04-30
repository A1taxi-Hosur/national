import { Building } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Story Since 1972</h2>
            <p className="text-neutral-dark/80 mb-4">
              National Furniture began as a small family-owned workshop in Bangalore over five decades ago. 
              What started as a passion for crafting quality wooden furniture has evolved into one of the most 
              trusted furniture retailers in the region.
            </p>
            <p className="text-neutral-dark/80 mb-4">
              For over 50 years, we have stayed true to our founding principles: exceptional craftsmanship, 
              sustainable materials, and designs that stand the test of time. Our furniture pieces aren't just 
              functional items – they're heirlooms that tell stories across generations.
            </p>
            <p className="text-neutral-dark/80 mb-6">
              Today, from our showroom in HSR Layout, Bangalore, we continue to combine traditional 
              woodworking techniques with modern design sensibilities, creating furniture that brings 
              both comfort and elegance to Indian homes.
            </p>
            <div className="flex flex-wrap justify-between items-center space-y-6 md:space-y-0">
              <div>
                <p className="text-4xl font-bold text-primary">50+</p>
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
  );
}
