// Global SEO Configuration
export const siteInfo = {
  siteName: "National Furniture & Interiors",
  siteUrl: "https://nationalfurniture.in", // Replace with actual domain when deployed
  siteDescription: "Premium furniture & interior solutions for homes, offices, hotels and restaurants in Bangalore.",
  logoUrl: "/logo.png",
  email: "info@nationalfurniture.in",
  phone: "+919663628302",
  address: {
    streetAddress: "No. 1212, 17th Cross Rd, 6th Sector",
    addressLocality: "HSR Layout",
    addressRegion: "Bangalore",
    postalCode: "560102",
    addressCountry: "IN"
  },
  latitude: 12.9151,
  longitude: 77.6343,
  openingHours: [
    "Monday-Saturday 10:00-19:00",
    "Sunday 10:00-15:00"
  ],
  socialLinks: {
    facebook: "https://facebook.com/nationalfurnitureinterior",
    instagram: "https://instagram.com/nationalfurnitureinterior",
    youtube: "https://youtube.com/@sibgathsibgath1065",
    justdial: "https://www.justdial.com/Bangalore/National-Furniture-Interior-Near-Sector-6-Park-HSR-Layout-Sector-6/080PXX80-XX80-161027100145-K9M7_BZDET"
  }
};

// Base keywords that apply to all pages
export const baseKeywords = [
  "furniture shop bangalore",
  "furniture store HSR layout",
  "national furniture bangalore",
  "premium furniture store",
  "custom furniture bangalore",
  "home furniture HSR layout",
  "office furniture bangalore",
  "quality furniture bangalore",
  "furniture interior solutions",
  "national interiors HSR"
];

// Page-specific keyword sets
export const pageKeywords = {
  home: [
    "best furniture store bangalore", 
    "luxury furniture HSR layout", 
    "furniture showroom bangalore", 
    "interior solutions bangalore",
    "designer furniture store",
    "modern furniture bangalore",
    "affordable luxury furniture",
    "furniture collection bangalore",
    "home interior design solutions"
  ],
  products: [
    "buy furniture HSR layout",
    "furniture categories bangalore",
    "office furniture solutions",
    "home furniture collections",
    "bedroom furniture sets",
    "living room furniture",
    "dining room furniture",
    "sofa sets bangalore",
    "chairs and tables HSR",
    "furniture catalog bangalore"
  ],
  about: [
    "furniture store history",
    "15 years furniture experience",
    "trusted furniture provider",
    "premium furniture craftsmanship",
    "furniture quality standards",
    "handcrafted furniture bangalore",
    "furniture design expertise",
    "sustainable furniture HSR",
    "furniture showroom team"
  ],
  contact: [
    "furniture store contact",
    "HSR layout furniture enquiry",
    "furniture showroom location",
    "furniture custom orders",
    "furniture store directions",
    "furniture consultation bangalore",
    "contact furniture experts",
    "furniture store working hours",
    "furniture price quotes"
  ],
  // Product categories
  categories: {
    bedroom: [
      "bedroom furniture bangalore",
      "beds and mattresses HSR",
      "wardrobes and almirahs",
      "bedroom sets bangalore",
      "designer beds HSR layout",
      "bedroom storage furniture",
      "bedroom chairs bangalore",
      "dressing tables HSR layout",
      "custom bedroom furniture"
    ],
    living: [
      "living room furniture bangalore",
      "sofa sets HSR layout",
      "coffee tables and tv units",
      "living room seating",
      "recliners and loungers",
      "center tables HSR layout",
      "living room storage",
      "modern sofa designs",
      "modular living room furniture"
    ],
    dining: [
      "dining room furniture bangalore",
      "dining tables HSR layout",
      "dining chairs and benches",
      "dining sets bangalore",
      "kitchen furniture HSR",
      "buffet and hutches",
      "dining storage furniture",
      "extendable dining tables",
      "custom dining solutions"
    ],
    office: [
      "office furniture bangalore",
      "office desks and tables",
      "office chairs HSR layout",
      "office storage solutions",
      "executive office furniture",
      "workstations HSR layout",
      "conference room furniture",
      "ergonomic office chairs",
      "modular office furniture"
    ],
    hotel: [
      "hotel furniture bangalore",
      "hospitality furniture solutions",
      "hotel room furniture",
      "hotel lobby furniture",
      "hotel reception furniture",
      "banquet hall furniture",
      "hotel seating furniture",
      "hospitality furniture manufacturer",
      "custom hotel furniture design"
    ],
    restaurant: [
      "restaurant furniture bangalore",
      "cafe furniture HSR layout",
      "restaurant tables and chairs",
      "bar furniture HSR layout",
      "outdoor restaurant furniture",
      "restaurant seating solutions",
      "food court furniture",
      "custom restaurant furniture",
      "commercial dining furniture"
    ],
    decor: [
      "home decor items bangalore",
      "interior decoration HSR",
      "wall decor and art",
      "decorative lighting",
      "mirrors and clocks",
      "vases and planters",
      "cushions and throws",
      "decorative accessories",
      "home styling solutions"
    ]
  }
};

// Helper function to combine base keywords with page-specific ones
export function getKeywordsForPage(page: string, category?: string): string[] {
  let keywords = [...baseKeywords];
  
  if (page === 'products' && category) {
    // Add category-specific keywords for product pages
    const categoryKey = category.toLowerCase() as keyof typeof pageKeywords.categories;
    if (pageKeywords.categories[categoryKey]) {
      keywords = [...keywords, ...pageKeywords.categories[categoryKey]];
    }
  }
  
  // Add page-specific keywords
  const pageKey = page as keyof typeof pageKeywords;
  if (typeof pageKeywords[pageKey] === 'object' && !Array.isArray(pageKeywords[pageKey])) {
    keywords = [...keywords, ...pageKeywords[page]];
  }
  
  return keywords;
}