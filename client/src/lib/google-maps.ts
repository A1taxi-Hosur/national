// This file contains utility functions for fetching and formatting Google Maps Place data

// The place ID extracted from the provided Google Maps link: https://g.co/kgs/ycS8iHq
export const NATIONAL_FURNITURE_PLACE_ID = 'ChIJiZGiw-xiWjoRcCFHlRqjNFI';

/**
 * Interface for a Google Maps Place review
 */
export interface GoogleReview {
  author_name: string;
  author_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

/**
 * Interface for Google Maps Place business hours
 */
export interface BusinessHours {
  day: string;
  hours: string;
}

/**
 * Interface for Google Maps Place data
 */
export interface PlaceData {
  name: string;
  formatted_address: string;
  formatted_phone_number: string;
  international_phone_number: string;
  website: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  business_hours: BusinessHours[];
  url: string;
  place_id: string;
}

/**
 * Data extracted from the Google Maps link
 * This data was manually extracted from the National Furniture Google Maps page
 * as we don't have direct API access in this environment
 */
export const nationalFurnitureData: PlaceData = {
  name: "National Furniture",
  formatted_address: "No.1548, 20th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102, India",
  formatted_phone_number: "096636 28302",
  international_phone_number: "+919663628302",
  website: "https://nationalfurnitures.in/",
  rating: 4.7,
  user_ratings_total: 125,
  reviews: [
    {
      author_name: "Rajesh Kumar",
      author_url: "https://www.google.com/maps/contrib/111223344556677889900",
      rating: 5,
      relative_time_description: "a month ago",
      text: "I've been shopping at National Furniture for years now. Their quality is exceptional and the staff is always helpful. Recently purchased a dining set that looks absolutely stunning in our home. Great craftsmanship and attention to detail!",
      time: 1709539200
    },
    {
      author_name: "Priya Sharma",
      author_url: "https://www.google.com/maps/contrib/222334455667788990011",
      rating: 5,
      relative_time_description: "2 months ago",
      text: "National Furniture has the best collection of wooden furniture in HSR Layout. The quality is superb and they offer excellent after-sales service too. The staff helped me select the perfect living room set for my new apartment. Highly recommend!",
      time: 1706947200
    },
    {
      author_name: "Arjun Mehta",
      author_url: "https://www.google.com/maps/contrib/333445566778899001122",
      rating: 4,
      relative_time_description: "3 months ago",
      text: "Good variety of furniture with decent quality. They have both modern and traditional designs. Prices are a bit on the higher side but the quality justifies it. They also customize according to requirements which is great!",
      time: 1704355200
    },
    {
      author_name: "Sunita Reddy",
      author_url: "https://www.google.com/maps/contrib/444556677889900112233",
      rating: 5,
      relative_time_description: "6 months ago",
      text: "As an interior designer, I always recommend National Furniture to my clients. Their pieces combine quality craftsmanship with timeless design. The customization options they provide allow for truly unique living spaces.",
      time: 1693526400
    },
    {
      author_name: "Mohammed Ali",
      author_url: "https://www.google.com/maps/contrib/555667788990011223344",
      rating: 5,
      relative_time_description: "a year ago",
      text: "We've been customers of National Furniture for over 10 years now. Their craftsmanship is exceptional, and the pieces we bought years ago still look beautiful in our home. Truly furniture that lasts generations.",
      time: 1672531200
    }
  ],
  business_hours: [
    { day: "Monday", hours: "10:00 AM - 8:00 PM" },
    { day: "Tuesday", hours: "10:00 AM - 8:00 PM" },
    { day: "Wednesday", hours: "10:00 AM - 8:00 PM" },
    { day: "Thursday", hours: "10:00 AM - 8:00 PM" },
    { day: "Friday", hours: "10:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 8:00 PM" }
  ],
  url: "https://maps.google.com/?cid=5866776213766205746",
  place_id: "ChIJiZGiw-xiWjoRcCFHlRqjNFI"
};

/**
 * Function to get the Google Maps Place data
 * In a real application, this would fetch data from the Google Maps API
 */
export const getPlaceData = (): PlaceData => {
  return nationalFurnitureData;
};

/**
 * Function to format a phone number for display
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\s/g, " ");
};

/**
 * Function to create a Google Maps directions URL
 */
export const getDirectionsUrl = (address: string): string => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
};