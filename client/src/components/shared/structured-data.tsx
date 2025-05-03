import { useEffect } from 'react';

// Same structure as LocalBusinessStructuredDataProps
interface FurnitureStoreStructuredDataProps {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email: string;
  url: string;
  latitude: number;
  longitude: number;
  openingHours: string[];
  images: string[];
  sameAs: string[];
  priceRange: string;
}

interface LocalBusinessStructuredDataProps {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email: string;
  url: string;
  latitude: number;
  longitude: number;
  openingHours: string[];
  images: string[];
  sameAs: string[];
  priceRange: string;
}

export function LocalBusinessStructuredData({
  name,
  description,
  address,
  phone,
  email,
  url,
  latitude,
  longitude,
  openingHours,
  images,
  sameAs,
  priceRange
}: LocalBusinessStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FurnitureStore',
      name,
      description,
      address: {
        '@type': 'PostalAddress',
        ...address
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude,
        longitude
      },
      telephone: phone,
      email,
      url,
      openingHours,
      image: images,
      sameAs,
      priceRange
    };

    // Add the structured data to the page
    let script = document.querySelector('#local-business-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'local-business-structured-data';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Clean up when component unmounts
      const scriptTag = document.querySelector('#local-business-structured-data');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [name, description, address, phone, email, url, latitude, longitude, openingHours, images, sameAs, priceRange]);

  return null;
}

interface ProductStructuredDataProps {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  offers?: {
    price?: number;
    priceCurrency?: string;
    availability?: string;
  };
  url: string;
  brand: string;
}

export function ProductStructuredData({
  name,
  description,
  imageUrl,
  category,
  offers,
  url,
  brand
}: ProductStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: imageUrl,
      category,
      offers: offers ? {
        '@type': 'Offer',
        ...offers,
        url
      } : undefined,
      url,
      brand: {
        '@type': 'Brand',
        name: brand
      }
    };

    // Add the structured data to the page
    let script = document.querySelector('#product-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'product-structured-data';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Clean up when component unmounts
      const scriptTag = document.querySelector('#product-structured-data');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [name, description, imageUrl, category, offers, url, brand]);

  return null;
}

export function FurnitureStoreStructuredData({
  name,
  description,
  address,
  phone,
  email,
  url,
  latitude,
  longitude,
  openingHours,
  images,
  sameAs,
  priceRange
}: FurnitureStoreStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FurnitureStore',
      name,
      description,
      address: {
        '@type': 'PostalAddress',
        ...address
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude,
        longitude
      },
      telephone: phone,
      email,
      url,
      openingHours,
      image: images,
      sameAs,
      priceRange
    };

    // Add the structured data to the page
    let script = document.querySelector('#furniture-store-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'furniture-store-structured-data';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Clean up when component unmounts
      const scriptTag = document.querySelector('#furniture-store-structured-data');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [name, description, address, phone, email, url, latitude, longitude, openingHours, images, sameAs, priceRange]);

  return null;
}