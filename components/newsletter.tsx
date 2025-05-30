import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="bg-white text-foreground" />
            <Button variant="secondary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </div>

          <p className="text-sm mt-4 opacity-75">No spam, unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
