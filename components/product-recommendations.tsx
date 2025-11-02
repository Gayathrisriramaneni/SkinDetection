"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AnalysisResult {
  conditions?: {
    pimples?: { detected: boolean }
    acne?: { detected: boolean }
    scars?: { detected: boolean }
    darkCircles?: { detected: boolean }
  }
}

interface Product {
  id: string
  name: string
  category: string
  price: string
  rating: number
  description: string
  image: string
}

interface ProductRecommendationsProps {
  results: AnalysisResult | null
}

const productDatabase: Record<string, Product[]> = {
  pimples: [
    {
      id: "p1",
      name: "Salicylic Acid Cleanser",
      category: "Cleanser",
      price: "$12.99",
      rating: 4.5,
      description: "Gentle exfoliating cleanser for pimple-prone skin",
      image: "/salicylic-acid-cleanser.jpg",
    },
    {
      id: "p2",
      name: "Spot Treatment Serum",
      category: "Treatment",
      price: "$18.99",
      rating: 4.7,
      description: "Fast-acting spot treatment with benzoyl peroxide",
      image: "/spot-treatment-serum.jpg",
    },
  ],
  acne: [
    {
      id: "a1",
      name: "Acne Control Moisturizer",
      category: "Moisturizer",
      price: "$22.99",
      rating: 4.6,
      description: "Oil-free moisturizer for acne-prone skin",
      image: "/acne-control-moisturizer.jpg",
    },
    {
      id: "a2",
      name: "Niacinamide Serum",
      category: "Serum",
      price: "$24.99",
      rating: 4.8,
      description: "Reduces sebum production and pore size",
      image: "/niacinamide-serum.jpg",
    },
  ],
  scars: [
    {
      id: "s1",
      name: "Scar Fading Cream",
      category: "Treatment",
      price: "$28.99",
      rating: 4.4,
      description: "Helps reduce appearance of acne scars",
      image: "/scar-fading-cream.jpg",
    },
    {
      id: "s2",
      name: "Vitamin C Brightening Serum",
      category: "Serum",
      price: "$32.99",
      rating: 4.7,
      description: "Brightens skin and promotes collagen production",
      image: "/vitamin-c-serum.png",
    },
  ],
  darkCircles: [
    {
      id: "d1",
      name: "Eye Cream with Caffeine",
      category: "Eye Care",
      price: "$19.99",
      rating: 4.5,
      description: "Reduces puffiness and dark circles",
      image: "/eye-cream-caffeine.jpg",
    },
    {
      id: "d2",
      name: "Retinol Eye Serum",
      category: "Serum",
      price: "$26.99",
      rating: 4.6,
      description: "Strengthens delicate eye area skin",
      image: "/retinol-eye-serum.jpg",
    },
  ],
}

export default function ProductRecommendations({ results }: ProductRecommendationsProps) {
  const getRecommendedProducts = (): Product[] => {
    if (!results?.conditions) return []

    const products: Product[] = []
    const conditions = results.conditions

    if (conditions.pimples?.detected) {
      products.push(...productDatabase.pimples)
    }
    if (conditions.acne?.detected) {
      products.push(...productDatabase.acne)
    }
    if (conditions.scars?.detected) {
      products.push(...productDatabase.scars)
    }
    if (conditions.darkCircles?.detected) {
      products.push(...productDatabase.darkCircles)
    }

    // If no conditions detected, show general skincare
    if (products.length === 0) {
      return [...productDatabase.pimples.slice(0, 1), ...productDatabase.acne.slice(0, 1)]
    }

    return products.slice(0, 4) // Limit to 4 products
  }

  const recommendedProducts = getRecommendedProducts()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Recommended Products</h3>

      <div className="space-y-3">
        {recommendedProducts.map((product) => (
          <Card key={product.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="space-y-3">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg bg-muted"
              />
              <div>
                <h4 className="font-semibold text-foreground text-sm line-clamp-2">{product.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{product.price}</span>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="text-xs text-muted-foreground">{product.rating}</span>
                </div>
              </div>

              <Button size="sm" className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                🛒 View Product
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
