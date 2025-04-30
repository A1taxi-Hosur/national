import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface CategoryItem {
  name: string;
  description: string;
  image: string;
}

export default function CategorySection() {
  const categories: CategoryItem[] = [
    {
      name: "Living Room",
      description: "Comfortable sofas, elegant coffee tables, and stylish accents",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Bedroom",
      description: "Beautiful beds, wardrobes, and nightstands for peaceful sleep",
      image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Dining",
      description: "Stunning dining tables and chairs for memorable meals",
      image: "https://images.unsplash.com/photo-1651768363297-6ff7e81ca57d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-3">Explore Our Collections</h2>
          <p className="text-neutral-dark/70 max-w-2xl mx-auto">
            Discover furniture that combines timeless design with modern craftsmanship
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md group cursor-pointer">
              <Link href={`/products/${category.name}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={`${category.name} Furniture`} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition duration-300"></div>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="font-heading text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-neutral-dark/70 mb-3">{category.description}</p>
                  <div className="inline-flex items-center text-primary font-medium hover:underline">
                    View Collection
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
