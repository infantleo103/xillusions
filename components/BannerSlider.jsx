import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';

const bannerImages = [
  {
    src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    alt: "Fashion Collection",
    title: "Fashion Collection",
    description: "Discover our latest styles for every occasion",
    buttonText: "Shop Now",
    buttonLink: "/collections/fashion"
  },
  {
    src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
    alt: "T-Shirt Collection",
    title: "Premium T-Shirts",
    description: "Quality fabrics with unique designs",
    buttonText: "Explore",
    buttonLink: "/collections/tshirts"
  },
  {
    src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop",
    alt: "Summer Collection",
    title: "Summer Essentials",
    description: "Stay cool with our summer collection",
    buttonText: "View Collection",
    buttonLink: "/collections/summer"
  },
  {
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
    alt: "New Arrivals",
    title: "New Arrivals",
    description: "Be the first to wear our latest designs",
    buttonText: "Shop New",
    buttonLink: "/collections/new"
  },
  {
    src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072&auto=format&fit=crop",
    alt: "Custom Designs",
    title: "Custom Designs",
    description: "Create your own unique style",
    buttonText: "Customize",
    buttonLink: "/customize"
  },
  {
    src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
    alt: "Trendy Collection",
    title: "Trending Now",
    description: "The styles everyone's talking about",
    buttonText: "See Trends",
    buttonLink: "/collections/trending"
  },
];

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef(null);
  
  // Function to go to the next slide
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
  };
  
  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 1000); // Change slide every 1 second
    
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);
  
  // Animation effect when slide changes
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.classList.add('fade-in');
      const timer = setTimeout(() => {
        slideRef.current?.classList.remove('fade-in');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);
  
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Current slide */}
      <div 
        ref={slideRef}
        className="w-full h-full transition-opacity duration-500"
      >
        <div className="relative w-full h-full">
          <Image
            src={bannerImages[activeIndex].src}
            alt={bannerImages[activeIndex].alt}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-lg text-white p-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{bannerImages[activeIndex].title}</h2>
                <p className="text-xl mb-6">{bannerImages[activeIndex].description}</p>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  {bannerImages[activeIndex].buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dots navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Add custom animation */}
      <style jsx global>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;