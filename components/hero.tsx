import { Button } from "./ui/button"
import dynamic from 'next/dynamic'

// Dynamically import the banner components with no SSR to avoid hydration issues
const HomeBanner = dynamic(() => import('./HomeBanner'), { ssr: false })
const FadeBanner = dynamic(() => import('./FadeBanner'), { ssr: false })
const CubeBanner = dynamic(() => import('./CubeBanner'), { ssr: false })

interface HeroProps {
  bannerType?: 'slide' | 'fade' | 'cube'
}

// Hero component that accepts a bannerType prop
const Hero = ({ bannerType = 'slide' }: HeroProps) => {
  // Render the appropriate banner based on the bannerType prop
  const renderBanner = () => {
    switch (bannerType) {
      case 'fade':
        return <FadeBanner />;
      case 'cube':
        return <CubeBanner />;
      case 'slide':
      default:
        return <HomeBanner />;
    }
  };

  return (
    <section className="relative">
      {/* Banner Slider */}
      {renderBanner()}
      
      {/* Additional content below the banner if needed */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Discover Our Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our wide range of high-quality apparel, from casual everyday wear to custom designs that express your unique style.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              Customize
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
