import { useEffect } from 'react';

interface SEOMetaProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  canonicalPath?: string;
  ogImage?: string;
}

export default function SEOMeta({
  title,
  description,
  keywords,
  canonicalUrl,
  canonicalPath,
  ogImage = "/logo.png",
}: SEOMetaProps) {
  useEffect(() => {
    // Format the base title
    const formattedTitle = `${title} | National Furniture & Interiors`;
    
    // Join keywords for meta tag
    const keywordsString = keywords.join(', ');

    // Set defaults for canonical URL if not provided
    const siteUrl = window.location.origin;
    const canonical = canonicalUrl || (canonicalPath ? `${siteUrl}${canonicalPath}` : window.location.href);

    // Update document head
    document.title = formattedTitle;

    // Update meta tags
    const metaTags = {
      description,
      keywords: keywordsString,
      'og:title': formattedTitle,
      'og:description': description,
      'og:image': ogImage,
      'og:url': canonical,
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'twitter:title': formattedTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    // Update or create meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                document.querySelector(`meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
  }, [title, description, keywords, canonicalUrl, canonicalPath, ogImage]);

  // This component doesn't render anything visible
  return null;
}