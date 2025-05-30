"use client"

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerImages = [
  {
    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    alt: "Fashion Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
    alt: "T-Shirt Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop",
    alt: "Summer Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
    alt: "New Arrivals",
  },
  {
    src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072&auto=format&fit=crop",
    alt: "Custom Designs",
  },
  {
    src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
    alt: "Trendy Collection",
  },
];

const FadeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideInterval = useRef(null);
  
  // Function to go to the next slide with fade transition
  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with the CSS transition duration
    }, 500); // Match this with the CSS transition duration
  };
  
  // Function to go to the previous slide with fade transition
  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with the CSS transition duration
    }, 500); // Match this with the CSS transition duration
  };
  
  // Function to handle dot navigation
  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with the CSS transition duration
    }, 500); // Match this with the CSS transition duration
    
    // Reset the interval when manually changing slides
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      startSlideInterval();
    }
  };
  
  // Function to start the automatic slide interval
  const startSlideInterval = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    
    slideInterval.current = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        nextSlide();
      }
    }, 1000); // Change slide every 1 second
  };
  
  // Set up automatic sliding on component mount and when isPaused changes
  useEffect(() => {
    startSlideInterval();
    
    // Clean up interval on component unmount
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isPaused, isTransitioning]);
  
  // Pause auto-sliding when user hovers over the banner
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  // Resume auto-sliding when user leaves the banner
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides with fade effect */}
      {bannerImages.map((image, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            currentSlide === index 
              ? 'opacity-100 z-10' 
              : 'opacity-0 z-0'
          } ${isTransitioning ? 'fade-transition' : ''}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h2 className="text-4xl font-bold mb-2">{image.alt}</h2>
              <p className="text-xl">Discover our latest collection</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          if (!isTransitioning) prevSlide();
        }}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-black z-20"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          if (!isTransitioning) nextSlide();
        }}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-black z-20"
        aria-label="Next slide"
        disabled={isTransitioning}
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => !isTransitioning && goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
      
      {/* Add custom animation */}
      <style jsx global>{`
        .fade-transition {
          animation: fadeTransition 1s ease-in-out;
        }
        
        @keyframes fadeTransition {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FadeBanner;