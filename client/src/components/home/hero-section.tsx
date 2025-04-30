import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Offer } from "@shared/schema";

interface HeroSectionProps {
  offer?: Offer;
}

export default function HeroSection({ offer }: HeroSectionProps) {
  return (
    <section className="relative bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary mb-4">
              Timeless Furniture for Modern Living
            </h1>
            <p className="text-lg md:text-xl mb-6 text-neutral-dark/80">
              Creating beautiful homes for generations. Visit our showroom in HSR Layout, Bangalore.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="sm:flex-1 md:flex-initial">
                <Link href="/products">
                  Explore Collection
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="sm:flex-1 md:flex-initial">
                <Link href="/contact">
                  Visit Showroom
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=1000" 
              alt="Grand Sofa Display" 
              className="w-full h-96 object-cover"
            />
            {offer && (
              <div className="absolute bottom-0 left-0 right-0 bg-accent/80 text-white p-4 text-center">
                <p className="font-bold">{offer.title}</p>
                <p className="text-sm">{offer.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
