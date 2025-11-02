"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ImageUploader from "@/components/image-uploader"
import SkinAnalysisResults from "@/components/skin-analysis-results"
import ProductRecommendations from "@/components/product-recommendations"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageAnalysis = async (imageData: string) => {
    setUploadedImage(imageData)
    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze-skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      })

      const data = await response.json()
      setAnalysisResults(data)
    } catch (error) {
      console.error("Analysis failed:", error)
      setAnalysisResults({
        error: "Failed to analyze image. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAnalysisResults(null)
    setUploadedImage(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted">
      <Header onReset={handleReset} showReset={!!analysisResults} />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {!analysisResults ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-foreground">Analyze Your Skin with AI</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload a photo or use your camera to detect pimples, scars, acne, and dark circles. Get personalized
                product recommendations.
              </p>
            </div>

            {/* Image Uploader */}
            <ImageUploader onImageCapture={handleImageAnalysis} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Section */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
              <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent">
                Analyze Another Image
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Results Display */}
              <div className="lg:col-span-2">
                <SkinAnalysisResults results={analysisResults} uploadedImage={uploadedImage} />
              </div>

              {/* Product Recommendations */}
              <div>
                <ProductRecommendations results={analysisResults} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
