import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "AudiobookSmith - AI Audiobook Generator for Authors & Publishers", 
  description = "Transform your manuscript into professional audiobooks with AI. No subscriptions, keep 100% royalties. Perfect for indie authors, educators, and self-publishers.",
  keywords = "ai audiobook generator, text to speech audiobook, audiobook creation tool, self-publishing audiobooks, indie authors, audiobook software, convert book to audiobook",
  canonicalUrl = "https://audiobooksmith.com",
  ogImage = "https://audiobooksmith.com/og-image.jpg",
  structuredData = null,
  pageType = "website"
}) => {
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization Schema
      {
        "@type": "Organization",
        "@id": "https://audiobooksmith.com/#organization",
        "name": "AudiobookSmith",
        "url": "https://audiobooksmith.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://audiobooksmith.com/logo.png",
          "width": 300,
          "height": 100
        },
        "description": "AI-powered audiobook generation platform for authors and publishers",
        "founder": {
          "@type": "Person",
          "name": "Vitaly Kirkpatrick",
          "jobTitle": "Founder & CEO"
        },
        "foundingDate": "2024",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-AUDIOBOOK",
          "contactType": "customer service",
          "email": "support@audiobooksmith.com",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://twitter.com/audiobooksmith",
          "https://linkedin.com/company/audiobooksmith"
        ]
      },
      // Website Schema
      {
        "@type": "WebSite",
        "@id": "https://audiobooksmith.com/#website",
        "url": "https://audiobooksmith.com",
        "name": "AudiobookSmith",
        "description": "AI Audiobook Generator for Authors & Publishers",
        "publisher": {
          "@id": "https://audiobooksmith.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://audiobooksmith.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      // Software Application Schema
      {
        "@type": "SoftwareApplication",
        "@id": "https://audiobooksmith.com/#software",
        "name": "AudiobookSmith AI Audiobook Generator",
        "description": "Professional AI-powered audiobook creation software for authors, educators, and publishers",
        "url": "https://audiobooksmith.com",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Sample",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free audiobook sample up to 5,000 words"
          },
          {
            "@type": "Offer",
            "name": "Standard Plan",
            "price": "149",
            "priceCurrency": "USD",
            "description": "Professional audiobook creation up to 50,000 words"
          },
          {
            "@type": "Offer",
            "name": "Premium Plan",
            "price": "399",
            "priceCurrency": "USD",
            "description": "Advanced audiobook creation up to 150,000 words"
          },
          {
            "@type": "Offer",
            "name": "Enterprise Plan",
            "price": "899",
            "priceCurrency": "USD",
            "description": "Enterprise audiobook solution with voice cloning"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2847",
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@id": "https://audiobooksmith.com/#organization"
        },
        "creator": {
          "@id": "https://audiobooksmith.com/#organization"
        }
      },
      // FAQ Schema
      {
        "@type": "FAQPage",
        "@id": "https://audiobooksmith.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How secure is my manuscript data on AudiobookSmith?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We take data security seriously. Your manuscripts are protected with enterprise-grade encryption and stored on secure cloud servers. We're GDPR compliant and follow strict privacy protocols. You maintain full ownership of your content, and we never share your data with third parties."
            }
          },
          {
            "@type": "Question",
            "name": "How does the quality compare to professional human narration?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI voices have been rated as indistinguishable from human narrators in blind tests by 87% of listeners. The technology has advanced dramatically in the last year, delivering natural intonation, proper pacing, and emotional expression."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use AudiobookSmith for commercial projects?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Your one-time purchase includes a commercial license. You can publish and sell your audiobooks on platforms like Audible, Apple Books, Spotify, and more while keeping 100% of your royalties."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to create an audiobook?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Processing time depends on your manuscript length and current server load. As a benchmark, a 300-page novel (80,000 words) typically processes in 2-3 hours. You'll receive email notifications when your audiobook is ready."
            }
          },
          {
            "@type": "Question",
            "name": "What if I'm not satisfied with my purchase?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer a no-questions-asked 30-day money-back guarantee. If AudiobookSmith doesn't meet your expectations, simply contact our support team for a full refund."
            }
          }
        ]
      },
      // Breadcrumb Schema
      {
        "@type": "BreadcrumbList",
        "@id": "https://audiobooksmith.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://audiobooksmith.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "AI Audiobook Generator",
            "item": "https://audiobooksmith.com/#features"
          }
        ]
      }
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="AudiobookSmith" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content="@audiobooksmith" />
      <meta property="twitter:site" content="@audiobooksmith" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="AudiobookSmith" />
      <meta name="publisher" content="AudiobookSmith" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geo Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="AudiobookSmith" />

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="no-referrer-when-downgrade" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link rel="preconnect" href="https://images.unsplash.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      {/* Removed apple-touch-icon to prevent 404 errors */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
    </Helmet>
  );
};

export default SEOHead;