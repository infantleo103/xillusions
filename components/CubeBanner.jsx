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

const CubeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' or 'prev'
  const slideInterval = useRef(null);
  
  // Function to go to the next slide
  const nextSlide = () => {
    setDirection('next');
    setCurrentSlide((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
  };
  
  // Function to go to the previous slide
  const prevSlide = () => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };
  
  // Function to handle dot navigation
  const goToSlide = (index) => {
    if (index === currentSlide) return;
    
    setDirection(index > currentSlide ? 'next' : 'prev');
    setCurrentSlide(index);
    
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
      if (!isPaused) {
        setDirection('next');
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
  }, [isPaused]);
  
  // Pause auto-sliding when user hovers over the banner
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  // Resume auto-sliding when user leaves the banner
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  // Calculate previous and next indices
  const prevIndex = currentSlide === 0 ? bannerImages.length - 1 : currentSlide - 1;
  const nextIndex = currentSlide === bannerImages.length - 1 ? 0 : currentSlide + 1;
  
  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden perspective"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cube-container h-full w-full relative">
        <div 
          className={`cube h-full w-full relative transition-transform duration-1000 ease-in-out ${
            direction === 'next' ? 'rotate-next' : 'rotate-prev'
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateY(${-currentSlide * 90}deg)`
          }}
        >
          {bannerImages.map((image, index) => {
            // Determine the position of this slide (front, right, back, left)
            let position = '';
            if (index === currentSlide) position = 'front';
            else if (index === nextIndex) position = 'right';
            else if (index === prevIndex) position = 'left';
            else position = 'back';
            
            return (
              <div 
                key={index} 
                className={`cube-face cube-face-${position} absolute inset-0`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: getTransform(position),
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === currentSlide}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h2 className="text-4xl font-bold mb-2">{image.alt}</h2>
                    <p className="text-xl">Discover our latest collection</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          prevSlide();
        }}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-black z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          nextSlide();
        }}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-black z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Add custom styles */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        
        .cube-container {
          transform-style: preserve-3d;
        }
        
        .cube {
          transform-style: preserve-3d;
          position: relative;
        }
        
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        
        .cube-face-front {
          transform: translateZ(50vw);
        }
        
        .cube-face-right {
          transform: rotateY(90deg) translateZ(50vw);
        }
        
        .cube-face-back {
          transform: rotateY(180deg) translateZ(50vw);
        }
        
        .cube-face-left {
          transform: rotateY(-90deg) translateZ(50vw);
        }
      `}</style>
    </div>
  );
};

// Helper function to get the transform style for each face of the cube
function getTransform(position) {
  switch (position) {
    case 'front':
      return 'translateZ(50vw)';
    case 'right':
      return 'rotateY(90deg) translateZ(50vw)';
    case 'back':
      return 'rotateY(180deg) translateZ(50vw)';
    case 'left':
      return 'rotateY(-90deg) translateZ(50vw)';
    default:
      return '';
  }
}

export default CubeBanner;