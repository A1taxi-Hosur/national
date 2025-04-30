import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { getPlaceData, getDirectionsUrl, formatPhoneNumber } from "@/lib/google-maps";

export default function ContactInfo() {
  const placeData = getPlaceData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-primary mb-4">Contact Information</h3>
      
      {/* Address */}
      <div className="flex items-start mb-4">
        <MapPin className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
        <div>
          <p className="text-neutral-dark">{placeData.formatted_address}</p>
          <a 
            href={getDirectionsUrl(placeData.formatted_address)}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 text-sm inline-flex items-center mt-1"
          >
            <span className="mr-1">Get directions</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      
      {/* Phone */}
      <div className="flex items-center mb-4">
        <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
        <div>
          <a 
            href={`tel:${placeData.international_phone_number.replace(/\s/g, '')}`}
            className="text-neutral-dark hover:text-primary"
          >
            {formatPhoneNumber(placeData.formatted_phone_number)}
          </a>
        </div>
      </div>
      
      {/* Business Hours */}
      <div className="flex items-start">
        <Clock className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
        <div>
          <p className="text-neutral-dark font-medium mb-1">Business Hours</p>
          <dl className="space-y-1">
            {placeData.business_hours.map((day, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <dt className="text-neutral-dark/70">{day.day}</dt>
                <dd className="text-neutral-dark">{day.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      
      {/* Website */}
      {placeData.website && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <a 
            href={placeData.website}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 inline-flex items-center"
          >
            <span className="mr-1">Visit our website</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}