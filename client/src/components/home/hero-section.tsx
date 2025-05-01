import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Offer } from "@shared/schema";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./carousel.css";

interface HeroSectionProps {
  offer?: Offer;
}

// Array of furniture showcase images for the carousel
const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=95&w=1800",
    alt: "Contemporary Dining Area"
  },
  {
    src: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=95&w=1800",
    alt: "Luxury Bedroom Furniture"
  },
  {
    src: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=95&w=1800",
    alt: "Designer Living Space"
  },
  {
    src: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=95&w=1800",
    alt: "Minimalist Home Office"
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=95&w=1800",
    alt: "Elegant Bedroom Design"
  },
  {
    src: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=95&w=1800",
    alt: "Luxury Dining Collection"
  }
];

export default function HeroSection({ offer }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    
    // Auto-scroll every 5 seconds
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative bg-secondary py-12 md:py-16">
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

          <div className="relative rounded-lg overflow-hidden shadow-xl embla">
            {/* Carousel container */}
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                {carouselImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`embla__slide ${
                      index === selectedIndex ? 'embla__slide--current' : ''
                    }`}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="embla__slide__img"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="embla__controls">
              <div className="embla__buttons">
                <button 
                  className="embla__button embla__button--prev"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  className="embla__button embla__button--next"
                  onClick={scrollNext}
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <div className="embla__dots">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    className={`embla__dot ${
                      index === selectedIndex ? 'embla__dot--selected' : ''
                    }`}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Offer banner */}
            {offer && (
              <div className="absolute bottom-0 left-0 right-0 bg-accent/85 text-white p-4 text-center z-20">
                <p className="font-bold text-lg">{offer.title}</p>
                <p>{offer.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
