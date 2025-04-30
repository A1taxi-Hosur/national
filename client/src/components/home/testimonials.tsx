import { Star } from "lucide-react";

interface Testimonial {
  content: string;
  name: string;
  location: string;
  rating: number;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      content: "We've been customers of National Furniture for over 20 years now. Their craftsmanship is exceptional, and the pieces we bought two decades ago still look beautiful in our home. Truly furniture that lasts generations.",
      name: "Priya & Rahul Sharma",
      location: "Indiranagar, Bangalore",
      rating: 5
    },
    {
      content: "When we were setting up our new apartment, we wanted furniture that was both stylish and durable. National Furniture's collection perfectly matched our requirements. The team was incredibly helpful in guiding our choices.",
      name: "Arjun Menon",
      location: "HSR Layout, Bangalore",
      rating: 5
    },
    {
      content: "As an interior designer, I always recommend National Furniture to my clients. Their pieces combine quality craftsmanship with timeless design. The customization options they provide allow for truly unique living spaces.",
      name: "Sunita Reddy",
      location: "Interior Designer, Bangalore",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-3">What Our Customers Say</h2>
          <p className="text-neutral-dark/70 max-w-2xl mx-auto">Read testimonials from our satisfied customers</p>
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
              <div className="flex items-center">
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-dark/60">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
