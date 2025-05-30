import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const bannerImages = [
  {
    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    alt: "Fashion Collection",
    category: "Fashion"
  },
  {
    src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
    alt: "T-Shirt Collection",
    category: "T-Shirts"
  },
  {
    src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop",
    alt: "Summer Collection",
    category: "Summer"
  },
  {
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
    alt: "New Arrivals",
    category: "New"
  },
  {
    src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072&auto=format&fit=crop",
    alt: "Custom Designs",
    category: "Custom"
  },
  {
    src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
    alt: "Trendy Collection",
    category: "Trending"
  },
];

const AdvancedBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  // Calculate indices for visible slides
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((currentIndex + i) % bannerImages.length);
    }
    return indices;
  };
  
  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 1000); // Change slide every 1 second
    
    return () => clearInterval(interval);
  }, []);
  
  // Manual navigation
  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };
  
  const visibleIndices = getVisibleIndices();
  
  return (
    <div className="relative w-full bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Collections</h2>
        
        {/* Main banner */}
        <div className="relative h-[400px] mb-8 overflow-hidden rounded-xl shadow-xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={bannerImages[currentIndex].src}
                alt={bannerImages[currentIndex].alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{bannerImages[currentIndex].alt}</h3>
                  <p className="text-xl">{bannerImages[currentIndex].category} Collection</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 text-black z-10"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 text-black z-10"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {/* Thumbnail navigation */}
        <div className="grid grid-cols-6 gap-4">
          {bannerImages.map((image, index) => (
            <div 
              key={index}
              className={`relative h-24 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ${
                index === currentIndex ? 'ring-4 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => goToSlide(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-xs font-medium">{image.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedBanner;