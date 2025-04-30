import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlaceData } from "@/lib/google-maps";

interface Testimonial {
  content: string;
  name: string;
  location?: string;
  rating: number;
  date: string;
  url?: string;
}

export default function Testimonials() {
  // Get actual Google reviews data from the provided place link
  const placeData = getPlaceData();
  
  // Convert Google reviews to our testimonial format
  const testimonials: Testimonial[] = placeData.reviews.map(review => ({
    content: review.text,
    name: review.author_name,
    rating: review.rating,
    date: review.relative_time_description,
    url: review.author_url
  }));

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-3">What Our Customers Say</h2>
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center mr-3">
              {[...Array(Math.floor(placeData.rating))].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              {placeData.rating % 1 > 0 && (
                <div className="relative">
                  <Star className="h-6 w-6 text-gray-300 fill-current" />
                  <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${(placeData.rating % 1) * 100}%` }}>
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </div>
                </div>
              )}
            </div>
            <span className="font-bold text-lg">{placeData.rating}</span>
            <span className="mx-2 text-neutral-dark">•</span>
            <span className="text-neutral-dark">{placeData.user_ratings_total} reviews on Google</span>
          </div>
          <p className="text-neutral-dark/70 max-w-2xl mx-auto">Authentic reviews from our Google Business profile</p>
          <div className="mt-4">
            <a href={placeData.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-primary/80">
              <span className="mr-1">See all reviews on Google Maps</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-dark/80 mb-4">{testimonial.content}</p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-dark/60">{testimonial.date}</p>
                </div>
                {testimonial.url && (
                  <a href={testimonial.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
