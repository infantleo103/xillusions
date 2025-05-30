import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { CustomizeSection } from "@/components/customize-section"
import { CustomizableProducts } from "@/components/customizable-products"
import { CustomizationFeatures } from "@/components/customization-features"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero bannerType="slide" />
        <Categories />
        <FeaturedProducts />
        <CustomizeSection />
        <CustomizableProducts />
        <CustomizationFeatures />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
